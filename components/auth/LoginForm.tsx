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

import { GlassInput } from '@/components/auth/GlassInput'
import { GlassButton } from '@/components/auth/GlassButton'
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="email" className="text-white/80 text-sm font-medium">Email</Label>
        <GlassInput
          id="email"
          type="email"
          placeholder="you@example.com"
          hasError={!!errors.email}
          {...register('email')}
          disabled={isLoading}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-400 pl-6" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Label htmlFor="password" className="text-white/80 text-sm font-medium">Password</Label>
        <div className="relative">
          <GlassInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            hasError={!!errors.password}
            {...register('password')}
            disabled={isLoading}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 focus:outline-none transition-colors"
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
          <p id="password-error" className="text-sm text-red-400 pl-6" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="remember"
            {...register('remember')}
            className="h-4 w-4 rounded border-white/20 bg-white/10 text-[#5EEAD4] focus:ring-[#5EEAD4] focus:ring-2 focus:ring-offset-0"
          />
          <Label
            htmlFor="remember"
            className="text-sm font-normal cursor-pointer text-white/70"
          >
            Remember me
          </Label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-[#5EEAD4] hover:text-[#4FD1C7] transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      <div className="pt-2">
        <GlassButton
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </GlassButton>
      </div>
    </form>
  )
}