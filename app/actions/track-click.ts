'use server'

import { trackClick as dbTrackClick } from '@/lib/db'

export async function trackClick(linkId: string, data?: {
  country?: string
  device?: string
}) {
  try {
    await dbTrackClick(linkId, data)
    return { success: true }
  } catch (error) {
    console.error('Failed to track click:', error)
    return { success: false, error: 'Failed to track click' }
  }
}