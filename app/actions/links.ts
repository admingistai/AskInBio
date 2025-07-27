/**
 * Server Actions for Link Management
 * 
 * Purpose:
 * - CRUD operations for user links
 * - Secure server-side validation
 * - Optimistic UI support
 * - Error handling
 * 
 * Actions:
 * - createLink: Add new link
 * - updateLink: Modify existing link
 * - deleteLink: Remove link
 * - reorderLinks: Update link order
 * - toggleLinkStatus: Activate/deactivate
 */

'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  createLink as dbCreateLink,
  updateLink as dbUpdateLink,
  deleteLink as dbDeleteLink,
  reorderLinks as dbReorderLinks,
  getUserLinks,
} from '@/lib/db'

// Validation schemas
const linkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  url: z.string().url('Invalid URL').max(500, 'URL too long'),
  thumbnail: z.string().optional().nullable(),
})

const updateLinkSchema = linkSchema.partial().extend({
  active: z.boolean().optional(),
})

export async function createLink(formData: {
  title: string
  url: string
  thumbnail?: string | null
}) {
  try {
    // Validate input
    const validatedData = linkSchema.parse(formData)
    
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { 
        error: 'You must be logged in to create links',
        code: 'UNAUTHORIZED'
      }
    }
    
    // Create link in database
    const link = await dbCreateLink({
      userId: user.id,
      title: validatedData.title,
      url: validatedData.url,
      thumbnail: validatedData.thumbnail || undefined,
    })
    
    // Revalidate the dashboard page
    revalidatePath('/dashboard')
    
    return { 
      success: true,
      data: link,
      message: 'Link created successfully'
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        error: error.errors[0].message,
        code: 'VALIDATION_ERROR'
      }
    }
    
    console.error('Create link error:', error)
    return { 
      error: 'Failed to create link',
      code: 'INTERNAL_ERROR'
    }
  }
}

export async function updateLink(
  linkId: string,
  formData: {
    title?: string
    url?: string
    thumbnail?: string | null
    active?: boolean
  }
) {
  try {
    // Validate input
    const validatedData = updateLinkSchema.parse(formData)
    
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { 
        error: 'You must be logged in to update links',
        code: 'UNAUTHORIZED'
      }
    }
    
    // Check if user owns the link
    const links = await getUserLinks(user.id)
    const linkExists = links.some(link => link.id === linkId)
    
    if (!linkExists) {
      return { 
        error: 'Link not found',
        code: 'NOT_FOUND'
      }
    }
    
    // Update link in database
    const link = await dbUpdateLink(linkId, validatedData)
    
    // Revalidate the dashboard page
    revalidatePath('/dashboard')
    revalidatePath(`/${user.email?.split('@')[0] || 'user'}`) // Revalidate public profile
    
    return { 
      success: true,
      data: link,
      message: 'Link updated successfully'
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        error: error.errors[0].message,
        code: 'VALIDATION_ERROR'
      }
    }
    
    console.error('Update link error:', error)
    return { 
      error: 'Failed to update link',
      code: 'INTERNAL_ERROR'
    }
  }
}

export async function deleteLink(linkId: string) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { 
        error: 'You must be logged in to delete links',
        code: 'UNAUTHORIZED'
      }
    }
    
    // Check if user owns the link
    const links = await getUserLinks(user.id)
    const linkExists = links.some(link => link.id === linkId)
    
    if (!linkExists) {
      return { 
        error: 'Link not found',
        code: 'NOT_FOUND'
      }
    }
    
    // Delete link from database
    await dbDeleteLink(linkId)
    
    // Revalidate the dashboard page
    revalidatePath('/dashboard')
    revalidatePath(`/${user.email?.split('@')[0] || 'user'}`) // Revalidate public profile
    
    return { 
      success: true,
      message: 'Link deleted successfully'
    }
  } catch (error) {
    console.error('Delete link error:', error)
    return { 
      error: 'Failed to delete link',
      code: 'INTERNAL_ERROR'
    }
  }
}

export async function reorderLinks(linkIds: string[]) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { 
        error: 'You must be logged in to reorder links',
        code: 'UNAUTHORIZED'
      }
    }
    
    // Validate that user owns all links
    const userLinks = await getUserLinks(user.id)
    const userLinkIds = userLinks.map(link => link.id)
    const allLinksOwned = linkIds.every(id => userLinkIds.includes(id))
    
    if (!allLinksOwned) {
      return { 
        error: 'Invalid link IDs',
        code: 'FORBIDDEN'
      }
    }
    
    // Reorder links in database
    await dbReorderLinks(user.id, linkIds)
    
    // Revalidate the dashboard page
    revalidatePath('/dashboard')
    revalidatePath(`/${user.email?.split('@')[0] || 'user'}`) // Revalidate public profile
    
    return { 
      success: true,
      message: 'Links reordered successfully'
    }
  } catch (error) {
    console.error('Reorder links error:', error)
    return { 
      error: 'Failed to reorder links',
      code: 'INTERNAL_ERROR'
    }
  }
}

export async function toggleLinkStatus(linkId: string) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { 
        error: 'You must be logged in to toggle link status',
        code: 'UNAUTHORIZED'
      }
    }
    
    // Get current link state
    const links = await getUserLinks(user.id)
    const link = links.find(l => l.id === linkId)
    
    if (!link) {
      return { 
        error: 'Link not found',
        code: 'NOT_FOUND'
      }
    }
    
    // Toggle active status
    const updatedLink = await dbUpdateLink(linkId, {
      active: !link.active
    })
    
    // Revalidate the dashboard page
    revalidatePath('/dashboard')
    revalidatePath(`/${user.email?.split('@')[0] || 'user'}`) // Revalidate public profile
    
    return { 
      success: true,
      data: updatedLink,
      message: `Link ${updatedLink.active ? 'activated' : 'deactivated'} successfully`
    }
  } catch (error) {
    console.error('Toggle link status error:', error)
    return { 
      error: 'Failed to toggle link status',
      code: 'INTERNAL_ERROR'
    }
  }
}

export async function getUserLinksAction() {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { 
        error: 'You must be logged in to view links',
        code: 'UNAUTHORIZED'
      }
    }
    
    // Get user's links
    const links = await getUserLinks(user.id)
    
    return { 
      success: true,
      data: links
    }
  } catch (error) {
    console.error('Get user links error:', error)
    return { 
      error: 'Failed to get links',
      code: 'INTERNAL_ERROR'
    }
  }
}