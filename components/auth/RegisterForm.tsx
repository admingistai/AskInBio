/**
 * Registration Form Component
 * 
 * Purpose:
 * - Handles new user registration with email/password
 * - Client component with comprehensive form validation
 * - Password strength requirements
 * - Terms of service acceptance
 * - Sends confirmation email via Supabase
 * 
 * Features:
 * - Email uniqueness validation
 * - Password confirmation field
 * - Username availability check
 * - Terms checkbox requirement
 * - Success message with email verification notice
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
import { signUp } from '@/app/actions/auth'
import type { RegisterFormData } from '@/types'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

interface RegisterFormProps {
  defaultUsername?: string
}

export function RegisterForm({ defaultUsername }: RegisterFormProps = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: defaultUsername || '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    
    try {
      const result = await signUp(data)
      
      if (result?.error) {
        // Handle specific error codes with user-friendly messages
        switch (result.code) {
          case 'RATE_LIMIT_EXCEEDED':
            toast.error(result.error, {
              description: 'Too many attempts. Please wait 15 minutes.',
              duration: 5000,
            })
            break
          case 'USERNAME_TAKEN':
            toast.error(result.error, {
              description: 'Please choose a different username.',
            })
            break
          case 'EMAIL_EXISTS':
            toast.error(result.error, {
              description: 'Please login or use a different email.',
            })
            break
          case 'VALIDATION_ERROR':
            toast.error(result.error, {
              description: result.field ? `Check the ${result.field} field.` : undefined,
            })
            break
          case 'WEAK_PASSWORD':
            toast.error(result.error, {
              description: 'Use 8+ chars with uppercase, lowercase, and numbers.',
            })
            break
          default:
            toast.error(result.error || 'Unable to create account')
        }
      } else if (result?.success) {
        toast.success(result.message, {
          description: 'You can close this page or login after verification.',
          duration: 8000,
        })
        // Reset form or redirect after success
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
        <Label htmlFor="username" className="text-white/80 text-sm font-medium">Username</Label>
        <GlassInput
          id="username"
          type="text"
          placeholder="johndoe"
          hasError={!!errors.username}
          {...register('username')}
          disabled={isLoading}
          aria-invalid={errors.username ? 'true' : 'false'}
          aria-describedby={errors.username ? 'username-error' : undefined}
        />
        {errors.username && (
          <p id="username-error" className="text-sm text-red-400 pl-6" role="alert">
            {errors.username.message}
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

      <div className="space-y-3">
        <Label htmlFor="confirmPassword" className="text-white/80 text-sm font-medium">Confirm Password</Label>
        <div className="relative">
          <GlassInput
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            hasError={!!errors.confirmPassword}
            {...register('confirmPassword')}
            disabled={isLoading}
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 focus:outline-none transition-colors"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            disabled={isLoading}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="confirm-password-error" className="text-sm text-red-400 pl-6" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="acceptTerms"
            {...register('acceptTerms')}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-[#5EEAD4] focus:ring-[#5EEAD4] focus:ring-2 focus:ring-offset-0"
          />
          <Label
            htmlFor="acceptTerms"
            className="text-sm font-normal cursor-pointer text-white/70"
          >
            I agree to the{' '}
            <Link href="/terms" className="text-[#5EEAD4] hover:text-[#4FD1C7] transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-[#5EEAD4] hover:text-[#4FD1C7] transition-colors">
              Privacy Policy
            </Link>
          </Label>
        </div>
        {errors.acceptTerms && (
          <p id="terms-error" className="text-sm text-red-400 pl-7" role="alert">
            {errors.acceptTerms.message}
          </p>
        )}
      </div>

      <div className="pt-2">
        <GlassButton
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </GlassButton>
      </div>
    </form>
  )
}