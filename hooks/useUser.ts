/**
 * User Hook for Authentication State
 * 
 * Purpose:
 * - Manages client-side auth state
 * - Provides user context throughout app
 * - Handles session persistence
 * - Optimizes auth checks with caching
 * 
 * Features:
 * - Real-time auth state updates
 * - Session caching
 * - Loading states
 * - Error handling
 * - TypeScript support
 */

'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const supabase = createClient()
    
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setError(error)
        } else {
          setUser(session?.user ?? null)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get session'))
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading, error }
}