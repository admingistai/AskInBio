/**
 * Supabase Database Tests
 * 
 * Purpose:
 * - Test database operations using Supabase client
 * - Validate CRUD operations work
 * - Test data relationships
 * - Alternative to Prisma tests when direct connection fails
 */

import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

test.describe('Supabase Database Operations', () => {
  const testUserId = `test_user_${Date.now()}`
  const testUsername = `test_${Date.now()}`
  
  test.afterAll(async () => {
    // Cleanup test data
    await supabase.from('users').delete().eq('id', testUserId)
    console.log('🧹 Test cleanup completed')
  })

  test('should create a user via Supabase', async () => {
    console.log('🔧 Creating test user...')
    
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: testUserId,
        username: testUsername,
        display_name: 'Test User',
        bio: 'This is a test user',
        avatar: 'https://example.com/avatar.jpg'
      })
      .select()
      .single()

    if (error) {
      console.log('❌ Create user error:', error)
      throw error
    }

    console.log('✅ User created successfully:', data)
    expect(data).toBeDefined()
    expect(data.username).toBe(testUsername)
    expect(data.display_name).toBe('Test User')
  })

  test('should read the created user', async () => {
    console.log('🔧 Reading test user...')
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', testUserId)
      .single()

    if (error) {
      console.log('❌ Read user error:', error)
      throw error
    }

    console.log('✅ User read successfully:', data)
    expect(data).toBeDefined()
    expect(data.username).toBe(testUsername)
    expect(data.display_name).toBe('Test User')
  })

  test('should update the user', async () => {
    console.log('🔧 Updating test user...')
    
    const { data, error } = await supabase
      .from('users')
      .update({
        display_name: 'Updated Test User',
        bio: 'Updated bio'
      })
      .eq('id', testUserId)
      .select()
      .single()

    if (error) {
      console.log('❌ Update user error:', error)
      throw error
    }

    console.log('✅ User updated successfully:', data)
    expect(data.display_name).toBe('Updated Test User')
    expect(data.bio).toBe('Updated bio')
  })

  test('should create a link for the user', async () => {
    console.log('🔧 Creating test link...')
    
    const { data, error } = await supabase
      .from('links')
      .insert({
        user_id: testUserId,
        title: 'Test Link',
        url: 'https://example.com',
        order: 0,
        active: true
      })
      .select()
      .single()

    if (error) {
      console.log('❌ Create link error:', error)
      throw error
    }

    console.log('✅ Link created successfully:', data)
    expect(data).toBeDefined()
    expect(data.title).toBe('Test Link')
    expect(data.url).toBe('https://example.com')
    expect(data.user_id).toBe(testUserId)
  })

  test('should query user with links', async () => {
    console.log('🔧 Querying user with relationships...')
    
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        links (*)
      `)
      .eq('id', testUserId)
      .single()

    if (error) {
      console.log('❌ Query with relations error:', error)
      throw error
    }

    console.log('✅ User with links queried successfully:', data)
    expect(data).toBeDefined()
    expect(data.links).toBeDefined()
    expect(data.links.length).toBeGreaterThan(0)
    expect(data.links[0].title).toBe('Test Link')
  })

  test('should count total users', async () => {
    console.log('🔧 Counting total users...')
    
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.log('❌ Count users error:', error)
      throw error
    }

    console.log('✅ Total users counted:', count)
    expect(count).toBeGreaterThan(0)
  })
})