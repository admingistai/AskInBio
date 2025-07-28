/**
 * Registration Page (Server Component)
 * 
 * Purpose:
 * - Server-side rendered registration page
 * - Handles new user signups
 * - Checks for existing sessions and redirects
 * - SEO optimized for user acquisition
 * 
 * Features:
 * - Registration form with validation
 * - Google OAuth option
 * - Link to login page
 * - Terms of service link
 * - Privacy policy link
 */

import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OnboardingAwareRegister from './OnboardingAwareRegister'

export const metadata: Metadata = {
  title: 'Sign Up - AskInBio',
  description: 'Create your free AskInBio account',
}

export default async function RegisterPage() {
  // Check if user is already authenticated
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return <OnboardingAwareRegister />
}