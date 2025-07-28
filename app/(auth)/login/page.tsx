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
    <div 
      className="w-full transition-all duration-700 opacity-100 scale-100"
      style={{
        borderRadius: '32px',
        background: 'rgba(20, 20, 23, 0.85)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.125)',
        boxShadow: `
          0 32px 64px rgba(0, 0, 0, 0.4),
          0 16px 32px rgba(0, 0, 0, 0.3),
          0 4px 16px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.15),
          inset 0 0 20px rgba(255, 255, 255, 0.05)
        `,
        willChange: 'backdrop-filter, transform'
      }}
    >
      {/* Glass Card Header */}
      <div className="p-8 pb-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white leading-tight">
            Welcome back
          </h1>
          <p className="text-white/70 text-lg">
            Enter your email and password to sign in to your account
          </p>
        </div>
      </div>

      {/* Glass Card Content */}
      <div className="px-8 pb-8 space-y-6">
        {/* Google OAuth - Primary Option */}
        <div className="space-y-4">
          <GoogleButton />
          <p className="text-center text-sm text-white/60">
            Quick and secure sign in with Google
          </p>
        </div>
        
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span 
              className="w-full h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)'
              }}
            />
          </div>
          <div className="relative flex justify-center">
            <span 
              className="px-4 text-xs uppercase tracking-wider text-white/50"
              style={{
                background: 'rgba(20, 20, 23, 0.85)'
              }}
            >
              Or sign in with email
            </span>
          </div>
        </div>
        
        {/* Email Login Form */}
        <LoginForm />
      </div>

      {/* Glass Card Footer */}
      <div 
        className="px-8 py-6 text-center border-t"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <p className="text-sm text-white/60">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-[#5EEAD4] hover:text-[#4FD1C7] transition-colors duration-200 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}