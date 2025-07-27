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
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  if (error) {
    // Handle OAuth errors
    console.error('OAuth error:', error, error_description)
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(
        error_description || 'Authentication failed'
      )}`
    )
  }

  if (code) {
    const supabase = await createClient()
    
    try {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError)
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=${encodeURIComponent(
            'Failed to complete authentication'
          )}`
        )
      }
      
      // Successful authentication - redirect to intended destination
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
  return NextResponse.redirect(`${requestUrl.origin}/login`)
}