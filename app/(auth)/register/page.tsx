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
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { createClient } from '@/lib/supabase/server'

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

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RegisterForm />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <GoogleButton />
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}