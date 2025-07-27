/**
 * useUser Hook
 * 
 * Purpose:
 * - Client-side user state management
 * - Subscribes to auth state changes
 * - Provides user data throughout the app
 * - Handles loading and error states
 * 
 * Returns:
 * - user: Current user object or null
 * - loading: Authentication check in progress
 * - error: Any authentication errors
 * - signOut: Function to log out user
 */

'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        setUser(user)
      } catch (error) {
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        
        // Handle auth events
        if (event === 'SIGNED_IN') {
          router.refresh()
        } else if (event === 'SIGNED_OUT') {
          router.push('/')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    signOut,
  }
}