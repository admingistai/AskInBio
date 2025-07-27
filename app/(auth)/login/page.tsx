/**
 * Login Page (Server Component)
 * 
 * Purpose:
 * - Server-side rendered login page
 * - Checks if user is already authenticated and redirects
 * - Renders login form and social auth options
 * - SEO optimized with proper meta tags
 * 
 * Features:
 * - Automatic redirect if already logged in
 * - Login form with email/password
 * - Google OAuth button
 * - Link to registration page
 * - Mobile responsive layout
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/auth/LoginForm'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Login - AskInBio',
  description: 'Sign in to your AskInBio account',
}

export default async function LoginPage() {
  // Check if user is already authenticated
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Enter your email and password to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm />
        
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
          Don't have an account?{' '}
          <Link
            href="/register"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}