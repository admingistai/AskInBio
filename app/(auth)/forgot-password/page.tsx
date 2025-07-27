/**
 * Forgot Password Page
 * 
 * Purpose:
 * - Allows users to request password reset email
 * - Validates email format
 * - Shows success message (same for all emails for security)
 * - Provides link back to login
 * 
 * Features:
 * - Email validation
 * - Rate limiting protection
 * - Security-conscious messaging
 * - Loading states
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Forgot Password | AskInBio',
  description: 'Reset your AskInBio password',
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Your Password?</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ForgotPasswordForm />
          
          <div className="text-center text-sm">
            Remember your password?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}