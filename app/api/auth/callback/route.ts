/**
 * OAuth Callback Route Handler
 * 
 * Purpose:
 * - Handles OAuth provider callbacks (Google, etc)
 * - Exchanges auth code for session
 * - Sets secure cookies
 * - Redirects to dashboard or error page
 * 
 * Features:
 * - Secure token exchange
 * - Error handling
 * - Session persistence
 * - PKCE support
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || 
               requestUrl.searchParams.get('redirect_to') || 
               '/dashboard'
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  console.log('OAuth callback received:', {
    origin: requestUrl.origin,
    code: code ? 'present' : 'missing',
    error,
    error_description,
    next
  })

  if (error) {
    // Handle OAuth errors
    console.error('OAuth provider error:', { error, error_description })
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(
        error_description || 'Authentication failed'
      )}`
    )
  }

  if (code) {
    const supabase = await createClient()
    
    try {
      console.log('Attempting to exchange code for session...')
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError)
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=${encodeURIComponent(
            'Failed to complete authentication'
          )}`
        )
      }
      
      if (data.user) {
        console.log('OAuth authentication successful for user:', data.user.email)
        console.log('User metadata:', data.user.user_metadata)
      }
      
      // Successful authentication - redirect to intended destination
      console.log('OAuth successful, redirecting to:', next)
      console.log('Full redirect URL:', `${requestUrl.origin}${next}`)
      console.log('Session data:', data.session ? 'Session created' : 'No session')
      
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    } catch (error) {
      console.error('Unexpected error during OAuth callback:', error)
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent(
          'An unexpected error occurred'
        )}`
      )
    }
  }

  // No code or error - invalid callback
  console.warn('Invalid OAuth callback - no code or error parameter')
  return NextResponse.redirect(`${requestUrl.origin}/login`)
}