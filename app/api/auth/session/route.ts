/**
 * Session Management Route Handler
 * 
 * Purpose:
 * - Provides session status endpoint
 * - Refreshes auth tokens
 * - Returns user data for client
 * - Handles session expiration
 * 
 * Features:
 * - Token refresh
 * - Session validation
 * - User data retrieval
 * - CORS support
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to get session' },
        { status: 500 }
      )
    }
    
    if (!session) {
      return NextResponse.json(
        { user: null, session: null },
        { status: 200 }
      )
    }
    
    // Optionally refresh the session if it's close to expiring
    const expiresIn = session.expires_in || 0
    if (expiresIn < 300) { // Less than 5 minutes
      const { data: { session: refreshedSession }, error: refreshError } = 
        await supabase.auth.refreshSession()
      
      if (!refreshError && refreshedSession) {
        return NextResponse.json({
          user: refreshedSession.user,
          session: {
            access_token: refreshedSession.access_token,
            expires_in: refreshedSession.expires_in,
            expires_at: refreshedSession.expires_at,
          }
        })
      }
    }
    
    return NextResponse.json({
      user: session.user,
      session: {
        access_token: session.access_token,
        expires_in: session.expires_in,
        expires_at: session.expires_at,
      }
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}