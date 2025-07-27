/**
 * Password Reset Page
 * 
 * Purpose:
 * - Handles password reset confirmation after email link
 * - Validates reset token from URL
 * - Allows users to set new password
 * - Shows success/error states
 * 
 * Features:
 * - New password form with validation
 * - Password strength requirements
 * - Confirmation field matching
 * - Success redirect to login
 */

import { Suspense } from 'react'
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password | AskInBio',
  description: 'Set your new password',
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Please enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}