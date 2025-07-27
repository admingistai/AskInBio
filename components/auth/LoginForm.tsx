/**
 * Login Form Component
 * 
 * Purpose:
 * - Handles email/password authentication
 * - Client component with form validation using react-hook-form + Zod
 * - Shows loading states during authentication
 * - Displays error messages from Supabase
 * - Redirects to dashboard on successful login
 * 
 * Features:
 * - Email validation
 * - Password field with show/hide toggle
 * - "Remember me" checkbox
 * - Forgot password link
 * - Server action integration
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from '@/app/actions/auth'
import type { LoginFormData } from '@/types'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      const result = await signIn(data)
      
      if (result?.error) {
        // Handle specific error codes with user-friendly messages
        switch (result.code) {
          case 'RATE_LIMIT_EXCEEDED':
            toast.error(result.error, {
              description: 'Please wait before trying again.',
              duration: 5000,
            })
            break
          case 'INVALID_CREDENTIALS':
            toast.error(result.error, {
              description: 'Please check your email and password.',
            })
            break
          case 'EMAIL_NOT_VERIFIED':
            toast.warning(result.error, {
              description: 'Check your email for the verification link.',
              duration: 6000,
            })
            break
          case 'VALIDATION_ERROR':
            toast.error(result.error)
            break
          default:
            toast.error(result.error || 'Unable to sign in')
        }
      } else {
        toast.success('Welcome back!', {
          description: 'Redirecting to your dashboard...',
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
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

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('password')}
            disabled={isLoading}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-sm text-red-500" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remember"
            {...register('remember')}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label
            htmlFor="remember"
            className="text-sm font-normal cursor-pointer"
          >
            Remember me
          </Label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  )
}