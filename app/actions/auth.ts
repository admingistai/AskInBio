/**
 * Server Actions for Authentication
 * 
 * Purpose:
 * - Server-side authentication logic
 * - Secure handling of credentials
 * - Integration with Supabase Auth
 * - Form validation and error handling
 * 
 * Actions:
 * - signIn: Email/password login
 * - signUp: New user registration
 * - signOut: User logout
 * - resetPassword: Password reset email
 * - updatePassword: Change password
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { z } from 'zod'
import type { LoginFormData, RegisterFormData } from '@/types'

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Helper function for rate limiting
async function checkRateLimit(identifier: string, maxAttempts: number = 5): Promise<boolean> {
  const now = Date.now()
  const userLimit = rateLimitMap.get(identifier)
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + 15 * 60 * 1000 }) // 15 minutes
    return true
  }
  
  if (userLimit.count >= maxAttempts) {
    return false
  }
  
  userLimit.count++
  return true
}

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password is too short'),
  remember: z.boolean().optional(),
})

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string()
    .min(3, 'Username too short')
    .max(20, 'Username too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Invalid username format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase')
    .regex(/[a-z]/, 'Password must contain lowercase')
    .regex(/[0-9]/, 'Password must contain number'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export async function signIn(formData: LoginFormData) {
  try {
    // Validate input
    const validatedData = loginSchema.parse(formData)
    
    // Rate limiting check
    const clientIP = (await headers()).get('x-forwarded-for') || 'unknown'
    const canProceed = await checkRateLimit(`signin:${clientIP}`)
    
    if (!canProceed) {
      return { 
        error: 'Too many login attempts. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED' 
      }
    }
    
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (error) {
      // Check for specific error types
      if (error.message.includes('Invalid login credentials')) {
        return { 
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        }
      }
      
      if (error.message.includes('Email not confirmed')) {
        return { 
          error: 'Please verify your email before logging in',
          code: 'EMAIL_NOT_VERIFIED'
        }
      }
      
      return { 
        error: 'An error occurred during sign in',
        code: 'AUTH_ERROR'
      }
    }

    if (!data.user) {
      return { 
        error: 'Unable to sign in',
        code: 'AUTH_FAILED'
      }
    }

    redirect('/dashboard')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        error: error.issues[0].message,
        code: 'VALIDATION_ERROR'
      }
    }
    
    console.error('Sign in error:', error)
    return { 
      error: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR'
    }
  }
}

export async function signUp(formData: RegisterFormData) {
  try {
    // Validate input
    const validatedData = registerSchema.parse(formData)
    
    // Rate limiting check
    const clientIP = (await headers()).get('x-forwarded-for') || 'unknown'
    const canProceed = await checkRateLimit(`signup:${clientIP}`, 3) // Stricter limit for signup
    
    if (!canProceed) {
      return { 
        error: 'Too many signup attempts. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED' 
      }
    }
    
    const supabase = await createClient()

    // Check if username is already taken
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('username')
      .eq('username', validatedData.username)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Username check error:', checkError)
      return { 
        error: 'Unable to verify username availability',
        code: 'DB_ERROR'
      }
    }

    if (existingUser) {
      return { 
        error: 'Username is already taken',
        code: 'USERNAME_TAKEN'
      }
    }

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          username: validatedData.username,
        },
        emailRedirectTo: `${(await headers()).get('origin')}/auth/confirm`,
      },
    })

    if (error) {
      // Check for specific error types
      if (error.message.includes('already registered')) {
        return { 
          error: 'This email is already registered',
          code: 'EMAIL_EXISTS'
        }
      }
      
      if (error.message.includes('Password')) {
        return { 
          error: 'Password does not meet requirements',
          code: 'WEAK_PASSWORD'
        }
      }
      
      return { 
        error: 'Unable to create account',
        code: 'SIGNUP_ERROR'
      }
    }

    if (data?.user) {
      return { 
        success: true, 
        message: 'Please check your email to confirm your account.',
        code: 'SIGNUP_SUCCESS'
      }
    }

    return { 
      error: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR'
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        error: error.issues[0].message,
        code: 'VALIDATION_ERROR',
        field: error.issues[0].path[0] as string
      }
    }
    
    console.error('Sign up error:', error)
    return { 
      error: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR'
    }
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const headersList = await headers()
  
  // Get origin with fallback to host header or environment variable
  let origin = headersList.get('origin')
  
  if (!origin) {
    const host = headersList.get('host')
    const protocol = headersList.get('x-forwarded-proto') || 'https'
    origin = host ? `${protocol}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL || null)
  }
  
  if (!origin) {
    console.error('Unable to determine origin for OAuth redirect')
    return { 
      error: 'Configuration error: Unable to determine redirect URL',
      code: 'CONFIG_ERROR'
    }
  }
  
  const redirectTo = `${origin}/api/auth/callback`
  console.log('OAuth redirect URL:', redirectTo) // Debug log
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    console.error('Google OAuth error:', error)
    return { 
      error: error.message,
      code: 'OAUTH_ERROR'
    }
  }

  if (!data.url) {
    return { 
      error: 'OAuth initialization failed',
      code: 'OAUTH_FAILED'
    }
  }

  // Log successful OAuth URL generation
  console.log('Redirecting to Google OAuth URL:', data.url)
  
  // Redirect outside try-catch to allow NEXT_REDIRECT to be handled properly
  redirect(data.url)
}

export async function resetPassword(email: string) {
  try {
    // Validate email format
    const emailSchema = z.string().email('Invalid email format')
    const validatedEmail = emailSchema.parse(email)
    
    // Rate limiting check - very strict for password reset
    const clientIP = (await headers()).get('x-forwarded-for') || 'unknown'
    const canProceed = await checkRateLimit(`reset:${clientIP}:${validatedEmail}`, 2)
    
    if (!canProceed) {
      return { 
        error: 'Too many password reset attempts. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED' 
      }
    }
    
    const supabase = await createClient()
    const headersList = await headers()
    const origin = headersList.get('origin')

    const { error } = await supabase.auth.resetPasswordForEmail(validatedEmail, {
      redirectTo: `${origin}/auth/reset-password`,
    })

    if (error) {
      console.error('Password reset error:', error)
      // Don't reveal if email exists or not for security
      return { 
        success: true, 
        message: 'If an account exists with this email, you will receive a password reset link.',
        code: 'RESET_REQUESTED'
      }
    }

    return { 
      success: true, 
      message: 'If an account exists with this email, you will receive a password reset link.',
      code: 'RESET_REQUESTED'
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        error: 'Please provide a valid email address',
        code: 'VALIDATION_ERROR'
      }
    }
    
    console.error('Password reset error:', error)
    return { 
      error: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR'
    }
  }
}

// New function for updating password after reset
export async function updatePassword(newPassword: string, confirmPassword: string) {
  try {
    // Validate passwords
    const passwordSchema = z.object({
      password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain uppercase')
        .regex(/[a-z]/, 'Password must contain lowercase')
        .regex(/[0-9]/, 'Password must contain number'),
      confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    })
    
    const validatedData = passwordSchema.parse({ 
      password: newPassword, 
      confirmPassword 
    })
    
    const supabase = await createClient()
    
    const { error } = await supabase.auth.updateUser({
      password: validatedData.password
    })
    
    if (error) {
      return { 
        error: 'Unable to update password',
        code: 'UPDATE_FAILED'
      }
    }
    
    return { 
      success: true,
      message: 'Password updated successfully',
      code: 'PASSWORD_UPDATED'
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        error: error.issues[0].message,
        code: 'VALIDATION_ERROR',
        field: error.issues[0].path[0] as string
      }
    }
    
    console.error('Update password error:', error)
    return { 
      error: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR'
    }
  }
}