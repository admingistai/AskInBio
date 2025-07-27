/**
 * Prisma Database Seed File
 * 
 * Purpose:
 * - Populate database with test data
 * - Create sample users, links, themes, and analytics
 * - Useful for development and testing
 * - Run with: npm run db:seed
 */

import { PrismaClient, ThemePreset } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  await prisma.clickEvent.deleteMany()
  await prisma.link.deleteMany()
  await prisma.theme.deleteMany()
  await prisma.user.deleteMany()

  // Create test users
  const testUser = await prisma.user.create({
    data: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      username: 'johndoe',
      displayName: 'John Doe',
      bio: '👋 Welcome to my link page! Software developer, coffee enthusiast, and lifelong learner.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe',
    },
  })

  const demoUser = await prisma.user.create({
    data: {
      id: '223e4567-e89b-12d3-a456-426614174001',
      username: 'demo',
      displayName: 'Demo User',
      bio: 'This is a demo account to showcase AskInBio features!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    },
  })

  console.log('✅ Created users')

  // Create themes
  const defaultTheme = await prisma.theme.create({
    data: {
      name: 'Clean & Modern',
      preset: ThemePreset.DEFAULT,
      primaryColor: '#8B5CF6',
      backgroundColor: '#FFFFFF',
      fontFamily: 'Inter',
      userId: testUser.id,
    },
  })

  const darkTheme = await prisma.theme.create({
    data: {
      name: 'Dark Mode',
      preset: ThemePreset.DARK,
      primaryColor: '#10B981',
      backgroundColor: '#0F172A',
      fontFamily: 'Inter',
      userId: testUser.id,
    },
  })

  const neonTheme = await prisma.theme.create({
    data: {
      name: 'Neon Vibes',
      preset: ThemePreset.NEON,
      primaryColor: '#F59E0B',
      backgroundColor: '#1E293B',
      fontFamily: 'Space Mono',
      userId: demoUser.id,
    },
  })

  console.log('✅ Created themes')

  // Create links for test user
  const links = await Promise.all([
    prisma.link.create({
      data: {
        title: '🌐 My Portfolio',
        url: 'https://johndoe.dev',
        thumbnail: 'https://via.placeholder.com/150',
        order: 0,
        active: true,
        userId: testUser.id,
      },
    }),
    prisma.link.create({
      data: {
        title: '🐦 Twitter / X',
        url: 'https://twitter.com/johndoe',
        order: 1,
        active: true,
        userId: testUser.id,
      },
    }),
    prisma.link.create({
      data: {
        title: '💼 LinkedIn',
        url: 'https://linkedin.com/in/johndoe',
        order: 2,
        active: true,
        userId: testUser.id,
      },
    }),
    prisma.link.create({
      data: {
        title: '📧 Email Me',
        url: 'mailto:john@example.com',
        order: 3,
        active: true,
        userId: testUser.id,
      },
    }),
    prisma.link.create({
      data: {
        title: '☕ Buy Me a Coffee',
        url: 'https://buymeacoffee.com/johndoe',
        order: 4,
        active: true,
        userId: testUser.id,
      },
    }),
    prisma.link.create({
      data: {
        title: '🎮 Discord Server',
        url: 'https://discord.gg/example',
        order: 5,
        active: false, // Inactive link example
        userId: testUser.id,
      },
    }),
  ])

  // Create links for demo user
  await Promise.all([
    prisma.link.create({
      data: {
        title: '🚀 AskInBio Features',
        url: 'https://askinbio.com/features',
        order: 0,
        active: true,
        userId: demoUser.id,
      },
    }),
    prisma.link.create({
      data: {
        title: '📚 Documentation',
        url: 'https://docs.askinbio.com',
        order: 1,
        active: true,
        userId: demoUser.id,
      },
    }),
    prisma.link.create({
      data: {
        title: '💳 Pricing',
        url: 'https://askinbio.com/pricing',
        order: 2,
        active: true,
        userId: demoUser.id,
      },
    }),
  ])

  console.log('✅ Created links')

  // Create click events for analytics
  const countries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'BR']
  const devices = ['desktop', 'mobile', 'tablet']

  for (const link of links.slice(0, 3)) { // Add clicks to first 3 links
    const clickCount = Math.floor(Math.random() * 50) + 10 // 10-60 clicks
    
    for (let i = 0; i < clickCount; i++) {
      const daysAgo = Math.floor(Math.random() * 30) // Random date within last 30 days
      const clickedAt = new Date()
      clickedAt.setDate(clickedAt.getDate() - daysAgo)
      
      await prisma.clickEvent.create({
        data: {
          linkId: link.id,
          clickedAt,
          country: countries[Math.floor(Math.random() * countries.length)],
          device: devices[Math.floor(Math.random() * devices.length)],
        },
      })
    }

    // Update click count
    await prisma.link.update({
      where: { id: link.id },
      data: { clicks: clickCount },
    })
  }

  console.log('✅ Created click events')

  console.log('🎉 Database seeded successfully!')
  console.log(`
  Test accounts created:
  - Username: johndoe
  - Username: demo
  
  You can now test the application with these accounts.
  `)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })