/**
 * Forgot Password Form Component
 * 
 * Purpose:
 * - Handles password reset email requests
 * - Validates email format
 * - Shows consistent success message for security
 * - Includes rate limiting protection
 * 
 * Features:
 * - Email validation
 * - Loading states
 * - Security-conscious responses
 * - Rate limit handling
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resetPassword } from '@/app/actions/auth'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    
    try {
      const result = await resetPassword(data.email)
      
      if (result?.code === 'RATE_LIMIT_EXCEEDED') {
        toast.error(result.error, {
          description: 'Please wait 15 minutes before trying again.',
          duration: 5000,
        })
      } else if (result?.code === 'VALIDATION_ERROR') {
        toast.error(result.error)
      } else {
        // Always show success for security reasons
        setIsSubmitted(true)
        toast.success('Check your email', {
          description: result.message,
          duration: 8000,
        })
      }
    } catch (error) {
      toast.error('An unexpected error occurred', {
        description: 'Please try again later.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
          <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Check your email</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            If an account exists with this email, you will receive a password reset link shortly.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Don&apos;t forget to check your spam folder.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          disabled={isLoading}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-500" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending reset email...
          </>
        ) : (
          'Send Reset Email'
        )}
      </Button>
    </form>
  )
}