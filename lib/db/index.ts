/**
 * Database Utility Functions
 * 
 * Purpose:
 * - Common database operations
 * - Type-safe queries
 * - Business logic layer
 * - Error handling
 * 
 * Features:
 * - User management
 * - Link operations
 * - Theme management
 * - Analytics tracking
 */

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// User operations
export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
    include: {
      links: {
        where: { active: true },
        orderBy: { order: 'asc' },
      },
      themes: true,
    },
  })
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      links: {
        orderBy: { order: 'asc' },
      },
      themes: true,
    },
  })
}

export async function createUser(data: {
  id: string // From Supabase auth
  username: string
  displayName?: string
  bio?: string
  avatar?: string
}) {
  return prisma.user.create({
    data,
  })
}

export async function updateUser(
  id: string,
  data: Prisma.UserUpdateInput
) {
  return prisma.user.update({
    where: { id },
    data,
  })
}

// Link operations
export async function getUserLinks(userId: string) {
  return prisma.link.findMany({
    where: { userId },
    orderBy: { order: 'asc' },
  })
}

export async function createLink(data: {
  userId: string
  title: string
  url: string
  thumbnail?: string
  order?: number
}) {
  // Get the highest order number for the user
  const lastLink = await prisma.link.findFirst({
    where: { userId: data.userId },
    orderBy: { order: 'desc' },
  })

  return prisma.link.create({
    data: {
      ...data,
      order: data.order ?? (lastLink ? lastLink.order + 1 : 0),
    },
  })
}

export async function updateLink(
  id: string,
  data: Prisma.LinkUpdateInput
) {
  return prisma.link.update({
    where: { id },
    data,
  })
}

export async function deleteLink(id: string) {
  return prisma.link.delete({
    where: { id },
  })
}

export async function reorderLinks(
  userId: string,
  linkIds: string[]
) {
  // Update all links with their new order
  const updates = linkIds.map((id, index) =>
    prisma.link.update({
      where: { id, userId }, // Ensure user owns the link
      data: { order: index },
    })
  )

  return prisma.$transaction(updates)
}

// Theme operations
export async function getUserThemes(userId: string) {
  return prisma.theme.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createTheme(data: {
  userId: string
  name: string
  preset?: Prisma.ThemeCreateInput['preset']
  primaryColor: string
  backgroundColor: string
  fontFamily: string
}) {
  return prisma.theme.create({
    data,
  })
}

export async function updateTheme(
  id: string,
  data: Prisma.ThemeUpdateInput
) {
  return prisma.theme.update({
    where: { id },
    data,
  })
}

export async function deleteTheme(id: string) {
  return prisma.theme.delete({
    where: { id },
  })
}

// Analytics operations
export async function trackClick(linkId: string, data?: {
  country?: string
  device?: string
}) {
  // Create click event
  await prisma.clickEvent.create({
    data: {
      linkId,
      ...data,
    },
  })

  // Increment click count on link
  await prisma.link.update({
    where: { id: linkId },
    data: {
      clicks: {
        increment: 1,
      },
    },
  })
}

export async function getClickAnalytics(userId: string, days = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const links = await prisma.link.findMany({
    where: { userId },
    include: {
      clickEvents: {
        where: {
          clickedAt: {
            gte: startDate,
          },
        },
        orderBy: {
          clickedAt: 'desc',
        },
      },
    },
  })

  // Aggregate analytics
  const analytics = {
    totalClicks: 0,
    clicksByLink: [] as Array<{
      linkId: string
      title: string
      clicks: number
      percentage: number
    }>,
    clicksByCountry: {} as Record<string, number>,
    clicksByDevice: {} as Record<string, number>,
    clicksByDay: [] as Array<{
      date: string
      clicks: number
    }>,
  }

  // Process data
  links.forEach((link) => {
    const linkClicks = link.clickEvents.length
    analytics.totalClicks += linkClicks

    if (linkClicks > 0) {
      analytics.clicksByLink.push({
        linkId: link.id,
        title: link.title,
        clicks: linkClicks,
        percentage: 0, // Will calculate after total
      })
    }

    // Count by country and device
    link.clickEvents.forEach((event) => {
      if (event.country) {
        analytics.clicksByCountry[event.country] = 
          (analytics.clicksByCountry[event.country] || 0) + 1
      }
      if (event.device) {
        analytics.clicksByDevice[event.device] = 
          (analytics.clicksByDevice[event.device] || 0) + 1
      }
    })
  })

  // Calculate percentages
  analytics.clicksByLink.forEach((item) => {
    item.percentage = analytics.totalClicks > 0
      ? Math.round((item.clicks / analytics.totalClicks) * 100)
      : 0
  })

  // Sort by clicks
  analytics.clicksByLink.sort((a, b) => b.clicks - a.clicks)

  // Generate daily click data
  const dailyClicks: Record<string, number> = {}
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    dailyClicks[dateStr] = 0
  }

  // Count clicks by day
  links.forEach((link) => {
    link.clickEvents.forEach((event) => {
      const dateStr = event.clickedAt.toISOString().split('T')[0]
      if (dailyClicks.hasOwnProperty(dateStr)) {
        dailyClicks[dateStr]++
      }
    })
  })

  // Convert to array and sort
  analytics.clicksByDay = Object.entries(dailyClicks)
    .map(([date, clicks]) => ({ date, clicks }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return analytics
}

// Profile operations (combines user, links, and theme)
export async function getPublicProfile(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      links: {
        where: { active: true },
        orderBy: { order: 'asc' },
      },
      themes: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!user) {
    return null
  }

  return {
    user,
    theme: user.themes[0] || null,
  }
}