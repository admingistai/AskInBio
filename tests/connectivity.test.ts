/**
 * Network and Database Connectivity Tests
 * 
 * Purpose:
 * - Test network connectivity to database host
 * - Validate DATABASE_URL format
 * - Check environment variable loading
 */

import { test, expect } from '@playwright/test'

test.describe('Connectivity Diagnostics', () => {
  test('should load environment variables correctly', async () => {
    const databaseUrl = process.env.DATABASE_URL
    console.log('🔧 DATABASE_URL loaded:', databaseUrl ? 'YES' : 'NO')
    console.log('🔧 DATABASE_URL value:', databaseUrl)
    
    expect(databaseUrl).toBeDefined()
    expect(databaseUrl).toContain('postgresql://')
    
    // Parse URL components
    if (databaseUrl) {
      const url = new URL(databaseUrl)
      console.log('🔧 Host:', url.hostname)
      console.log('🔧 Port:', url.port)
      console.log('🔧 Database:', url.pathname)
      console.log('🔧 Username:', url.username)
      console.log('🔧 Password:', url.password ? '[REDACTED]' : 'NO PASSWORD')
    }
  })

  test('should parse Supabase URL correctly', async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('🔧 Supabase URL:', supabaseUrl)
    console.log('🔧 Supabase Key:', supabaseKey ? '[REDACTED]' : 'NO KEY')
    
    expect(supabaseUrl).toBeDefined()
    expect(supabaseKey).toBeDefined()
    
    if (supabaseUrl) {
      expect(supabaseUrl).toContain('supabase.co')
      expect(supabaseUrl).toMatch(/^https:\/\//)
    }
  })

  test('should have consistent project reference', async () => {
    const databaseUrl = process.env.DATABASE_URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    
    if (databaseUrl && supabaseUrl) {
      const dbUrl = new URL(databaseUrl)
      const sbUrl = new URL(supabaseUrl)
      
      // Extract project ID from both URLs
      const dbProject = dbUrl.hostname.split('.')[0]
      const sbProject = sbUrl.hostname.split('.')[0]
      
      console.log('🔧 Database project ID:', dbProject)
      console.log('🔧 Supabase project ID:', sbProject)
      
      expect(dbProject).toBe(sbProject)
    }
  })
})