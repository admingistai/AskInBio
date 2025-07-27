/**
 * useProfile Hook
 * 
 * Purpose:
 * - Client-side user profile state management
 * - Fetches full user profile with Prisma data
 * - Provides user profile throughout the app
 * - Handles loading and error states
 */

'use client'

import { useEffect, useState } from 'react'
import { User } from '@prisma/client'
import { createClient } from '@/lib/supabase/client'

interface UseProfileReturn {
  profile: User | null
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      if (!authUser) {
        setProfile(null)
        return
      }

      // Fetch user profile from database
      const response = await fetch('/api/user/profile')
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      
      const data = await response.json()
      setProfile(data.user)
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          fetchProfile()
        } else if (event === 'SIGNED_OUT') {
          setProfile(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    profile,
    loading,
    error,
    refresh: fetchProfile,
  }
}