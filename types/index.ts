/**
 * Type Definitions for AskInBio
 * 
 * Purpose:
 * - Type safety for all data structures
 * - Shared interfaces across the application
 * - Form validation schemas
 * - API response types
 */

export interface User {
  id: string
  email: string
  username: string
  full_name?: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface Link {
  id: string
  user_id: string
  title: string
  url: string
  description?: string
  icon?: string
  order: number
  is_active: boolean
  clicks: number
  created_at: string
  updated_at: string
}

export interface Theme {
  id: string
  user_id: string
  name: string
  primary_color: string
  secondary_color: string
  background_color: string
  text_color: string
  font_family: string
  button_style: 'rounded' | 'square' | 'pill'
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Analytics {
  id: string
  link_id: string
  clicked_at: string
  ip_address?: string
  user_agent?: string
  referrer?: string
  country?: string
  city?: string
  device_type?: 'mobile' | 'tablet' | 'desktop'
}

export interface Profile {
  user: User
  links: Link[]
  theme: Theme
}

// Authentication Types
export interface AuthError {
  message: string
  code?: string
}

export interface LoginFormData {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  username: string
  acceptTerms: boolean
}

export interface AuthResponse {
  user?: User
  error?: AuthError
}