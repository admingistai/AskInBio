/**
 * Supabase Direct Connection Test
 * 
 * Purpose:
 * - Test direct Supabase connectivity
 * - Validate authentication
 * - Check database accessibility
 */

import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

test.describe('Supabase Connection Tests', () => {
  test('should connect to Supabase with credentials', async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('🔧 Testing Supabase connection...')
    console.log('🔧 URL:', supabaseUrl)
    console.log('🔧 Key:', supabaseKey ? '[REDACTED]' : 'NO KEY')
    
    expect(supabaseUrl).toBeDefined()
    expect(supabaseKey).toBeDefined()
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      try {
        // Test basic connection
        const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
        
        if (error) {
          console.log('❌ Supabase error:', error.message)
          console.log('❌ Error details:', error)
          
          // This might be expected if table doesn't exist yet
          if (error.message.includes('relation "users" does not exist')) {
            console.log('ℹ️  Users table does not exist yet - this is expected')
            expect(true).toBe(true) // Pass the test
          } else {
            throw error
          }
        } else {
          console.log('✅ Supabase connection successful!')
          console.log('📊 Users table accessible, count:', data)
          expect(data).toBeDefined()
        }
      } catch (connectionError) {
        console.log('❌ Connection failed:', connectionError)
        throw connectionError
      }
    }
  })

  test('should validate service role key', async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('🔧 Testing service role connection...')
    
    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
      
      try {
        // Test with service role (can create tables)
        const { error } = await supabase.from('users').select('count', { count: 'exact', head: true })
        
        if (error && error.message.includes('relation "users" does not exist')) {
          console.log('ℹ️  Service role working - table does not exist yet')
          expect(true).toBe(true)
        } else if (error) {
          console.log('❌ Service role error:', error)
          throw error
        } else {
          console.log('✅ Service role connection successful!')
          expect(true).toBe(true)
        }
      } catch (connectionError) {
        console.log('❌ Service role connection failed:', connectionError)
        throw connectionError
      }
    } else {
      console.log('❌ Missing service role credentials')
      throw new Error('Missing service role credentials')
    }
  })
})