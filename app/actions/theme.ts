'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateThemeMode(isDarkMode: boolean) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { 
        error: 'Not authenticated',
        code: 'AUTH_REQUIRED'
      }
    }

    // Check if user has a theme
    const existingTheme = await prisma.theme.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    if (existingTheme) {
      // Update existing theme
      await prisma.theme.update({
        where: { id: existingTheme.id },
        data: { isDarkMode }
      })
    } else {
      // Create default theme with dark mode preference
      await prisma.theme.create({
        data: {
          userId: user.id,
          name: 'Default Theme',
          preset: 'DEFAULT',
          primaryColor: '#B8FFE3',
          backgroundColor: '#000000',
          fontFamily: 'Work Sans',
          isDarkMode
        }
      })
    }

    // Get user profile to revalidate their public page
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { username: true }
    })

    if (userProfile) {
      // Revalidate the user's public profile page
      revalidatePath(`/${userProfile.username}`)
    }

    return { 
      success: true,
      message: 'Theme updated successfully' 
    }
  } catch (error) {
    console.error('Theme update error:', error)
    return { 
      error: 'Failed to update theme',
      code: 'UPDATE_FAILED'
    }
  }
}

export async function getUserTheme() {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { 
        error: 'Not authenticated',
        code: 'AUTH_REQUIRED'
      }
    }

    // Get user's theme
    const theme = await prisma.theme.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    if (!theme) {
      // Create default theme
      const newTheme = await prisma.theme.create({
        data: {
          userId: user.id,
          name: 'Default Theme',
          preset: 'DEFAULT',
          primaryColor: '#B8FFE3',
          backgroundColor: '#000000',
          fontFamily: 'Work Sans',
          isDarkMode: false
        }
      })
      return { 
        success: true, 
        data: newTheme 
      }
    }

    return { 
      success: true, 
      data: theme 
    }
  } catch (error) {
    console.error('Get theme error:', error)
    return { 
      error: 'Failed to get theme',
      code: 'FETCH_FAILED'
    }
  }
}

export async function createOrUpdateTheme(data: {
  name?: string
  preset?: 'DEFAULT' | 'DARK' | 'NEON' | 'MINIMAL'
  primaryColor?: string
  backgroundColor?: string
  fontFamily?: string
  isDarkMode?: boolean
}) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { 
        error: 'Not authenticated',
        code: 'AUTH_REQUIRED'
      }
    }

    // Check if user has a theme
    const existingTheme = await prisma.theme.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    let theme
    if (existingTheme) {
      // Update existing theme
      theme = await prisma.theme.update({
        where: { id: existingTheme.id },
        data
      })
    } else {
      // Create new theme with defaults
      theme = await prisma.theme.create({
        data: {
          userId: user.id,
          name: data.name || 'Default Theme',
          preset: data.preset || 'DEFAULT',
          primaryColor: data.primaryColor || '#B8FFE3',
          backgroundColor: data.backgroundColor || '#000000',
          fontFamily: data.fontFamily || 'Work Sans',
          isDarkMode: data.isDarkMode || false
        }
      })
    }

    // Get user profile to revalidate their public page
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { username: true }
    })

    if (userProfile) {
      // Revalidate the user's public profile page
      revalidatePath(`/${userProfile.username}`)
    }

    return { 
      success: true,
      data: theme,
      message: 'Theme updated successfully' 
    }
  } catch (error) {
    console.error('Theme create/update error:', error)
    return { 
      error: 'Failed to update theme',
      code: 'UPDATE_FAILED'
    }
  }
}