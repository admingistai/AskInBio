/**
 * Database Utility Unit Tests
 * 
 * Purpose:
 * - Test all database utility functions
 * - Verify CRUD operations
 * - Test error handling
 * - Validate business logic
 * 
 * Coverage:
 * - User operations
 * - Link management
 * - Theme customization
 * - Analytics tracking
 */

import { test, expect } from './db.setup'
import * as db from '@/lib/db'
import { 
  createTestUser,
  createTestLink,
  createTestTheme,
  cleanupTestData,
  generateClickEvents,
  testPrisma
} from './utils/db-helpers'
import { ThemePreset } from '@prisma/client'

test.describe('Database Utilities', () => {
  test.afterEach(async ({ dbCleanup }) => {
    await dbCleanup()
  })

  test.describe('User Operations', () => {
    test('getUserByUsername - should return user with relations', async () => {
      // Create test data
      const user = await createTestUser({ username: 'test_user_123' })
      await createTestLink(user.id, { title: 'Active Link', active: true })
      await createTestLink(user.id, { title: 'Inactive Link', active: false })
      await createTestTheme(user.id)

      // Test the function
      const result = await db.getUserByUsername('test_user_123')

      // Assertions
      expect(result).toBeTruthy()
      expect(result?.username).toBe('test_user_123')
      expect(result?.links).toHaveLength(1) // Only active links
      expect(result?.links[0].title).toBe('Active Link')
      expect(result?.themes).toHaveLength(1)
    })

    test('getUserByUsername - should return null for non-existent user', async () => {
      const result = await db.getUserByUsername('non_existent_user')
      expect(result).toBeNull()
    })

    test('getUserById - should return user with all links', async () => {
      const user = await createTestUser()
      await createTestLink(user.id, { active: true })
      await createTestLink(user.id, { active: false })

      const result = await db.getUserById(user.id)

      expect(result).toBeTruthy()
      expect(result?.links).toHaveLength(2) // All links, not just active
    })

    test('createUser - should create user with valid data', async () => {
      const userData = {
        id: 'test_new_user_id',
        username: 'test_new_user',
        displayName: 'Test User',
        bio: 'Test bio',
        avatar: 'https://example.com/avatar.jpg'
      }

      const result = await db.createUser(userData)

      expect(result.id).toBe(userData.id)
      expect(result.username).toBe(userData.username)
      expect(result.displayName).toBe(userData.displayName)
      expect(result.bio).toBe(userData.bio)
      expect(result.avatar).toBe(userData.avatar)
    })

    test('createUser - should fail with duplicate username', async () => {
      await createTestUser({ username: 'test_duplicate' })

      await expect(
        db.createUser({
          id: 'test_another_id',
          username: 'test_duplicate',
        })
      ).rejects.toThrow()
    })

    test('updateUser - should update user fields', async () => {
      const user = await createTestUser()

      const updated = await db.updateUser(user.id, {
        displayName: 'Updated Name',
        bio: 'Updated bio',
      })

      expect(updated.displayName).toBe('Updated Name')
      expect(updated.bio).toBe('Updated bio')
      expect(updated.username).toBe(user.username) // Unchanged
    })
  })

  test.describe('Link Operations', () => {
    test('getUserLinks - should return links in order', async () => {
      const user = await createTestUser()
      await createTestLink(user.id, { title: 'Link 3', order: 2 })
      await createTestLink(user.id, { title: 'Link 1', order: 0 })
      await createTestLink(user.id, { title: 'Link 2', order: 1 })

      const links = await db.getUserLinks(user.id)

      expect(links).toHaveLength(3)
      expect(links[0].title).toBe('Link 1')
      expect(links[1].title).toBe('Link 2')
      expect(links[2].title).toBe('Link 3')
    })

    test('createLink - should auto-assign order', async () => {
      const user = await createTestUser()
      
      const link1 = await db.createLink({
        userId: user.id,
        title: 'First Link',
        url: 'https://example.com',
      })
      
      const link2 = await db.createLink({
        userId: user.id,
        title: 'Second Link',
        url: 'https://example.com',
      })

      expect(link1.order).toBe(0)
      expect(link2.order).toBe(1)
    })

    test('createLink - should respect provided order', async () => {
      const user = await createTestUser()
      
      const link = await db.createLink({
        userId: user.id,
        title: 'Custom Order Link',
        url: 'https://example.com',
        order: 5,
      })

      expect(link.order).toBe(5)
    })

    test('updateLink - should update link fields', async () => {
      const user = await createTestUser()
      const link = await createTestLink(user.id)

      const updated = await db.updateLink(link.id, {
        title: 'Updated Title',
        active: false,
      })

      expect(updated.title).toBe('Updated Title')
      expect(updated.active).toBe(false)
    })

    test('deleteLink - should remove link', async () => {
      const user = await createTestUser()
      const link = await createTestLink(user.id)

      await db.deleteLink(link.id)

      const links = await db.getUserLinks(user.id)
      expect(links).toHaveLength(0)
    })

    test('reorderLinks - should update order correctly', async () => {
      const user = await createTestUser()
      const link1 = await createTestLink(user.id, { title: 'Link 1' })
      const link2 = await createTestLink(user.id, { title: 'Link 2' })
      const link3 = await createTestLink(user.id, { title: 'Link 3' })

      // Reorder: 3, 1, 2
      await db.reorderLinks(user.id, [link3.id, link1.id, link2.id])

      const links = await db.getUserLinks(user.id)
      expect(links[0].id).toBe(link3.id)
      expect(links[1].id).toBe(link1.id)
      expect(links[2].id).toBe(link2.id)
    })

    test('reorderLinks - should only reorder user\'s own links', async () => {
      const user1 = await createTestUser()
      const user2 = await createTestUser()
      const link1 = await createTestLink(user1.id)
      const link2 = await createTestLink(user2.id)

      // Try to reorder user2's link as user1
      await expect(
        db.reorderLinks(user1.id, [link1.id, link2.id])
      ).rejects.toThrow()
    })
  })

  test.describe('Theme Operations', () => {
    test('getUserThemes - should return themes ordered by date', async () => {
      const user = await createTestUser()
      const theme1 = await createTestTheme(user.id, { name: 'Old Theme' })
      
      // Wait a bit to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10))
      
      const theme2 = await createTestTheme(user.id, { name: 'New Theme' })

      const themes = await db.getUserThemes(user.id)

      expect(themes).toHaveLength(2)
      expect(themes[0].name).toBe('New Theme') // Most recent first
      expect(themes[1].name).toBe('Old Theme')
    })

    test('createTheme - should create theme with valid preset', async () => {
      const user = await createTestUser()
      
      const theme = await db.createTheme({
        userId: user.id,
        name: 'Custom Theme',
        preset: ThemePreset.NEON,
        primaryColor: '#FF0000',
        backgroundColor: '#000000',
        fontFamily: 'Arial',
      })

      expect(theme.preset).toBe(ThemePreset.NEON)
      expect(theme.primaryColor).toBe('#FF0000')
    })

    test('updateTheme - should update theme fields', async () => {
      const user = await createTestUser()
      const theme = await createTestTheme(user.id)

      const updated = await db.updateTheme(theme.id, {
        name: 'Updated Theme',
        primaryColor: '#00FF00',
      })

      expect(updated.name).toBe('Updated Theme')
      expect(updated.primaryColor).toBe('#00FF00')
    })

    test('deleteTheme - should remove theme', async () => {
      const user = await createTestUser()
      const theme = await createTestTheme(user.id)

      await db.deleteTheme(theme.id)

      const themes = await db.getUserThemes(user.id)
      expect(themes).toHaveLength(0)
    })
  })

  test.describe('Analytics Operations', () => {
    test('trackClick - should create click event and increment counter', async () => {
      const user = await createTestUser()
      const link = await createTestLink(user.id, { clicks: 0 })

      await db.trackClick(link.id, {
        country: 'US',
        device: 'mobile',
      })

      // Check click event was created
      const events = await testPrisma.clickEvent.findMany({
        where: { linkId: link.id },
      })
      expect(events).toHaveLength(1)
      expect(events[0].country).toBe('US')
      expect(events[0].device).toBe('mobile')

      // Check link click count was incremented
      const updatedLink = await testPrisma.link.findUnique({
        where: { id: link.id },
      })
      expect(updatedLink?.clicks).toBe(1)
    })

    test('getClickAnalytics - should aggregate analytics correctly', async () => {
      const user = await createTestUser()
      const link1 = await createTestLink(user.id, { title: 'Link 1' })
      const link2 = await createTestLink(user.id, { title: 'Link 2' })

      // Generate clicks
      await generateClickEvents(link1.id, 10)
      await generateClickEvents(link2.id, 5)

      const analytics = await db.getClickAnalytics(user.id, 30)

      expect(analytics.totalClicks).toBe(15)
      expect(analytics.clicksByLink).toHaveLength(2)
      expect(analytics.clicksByLink[0].clicks).toBe(10)
      expect(analytics.clicksByLink[0].title).toBe('Link 1')
      expect(analytics.clicksByLink[1].clicks).toBe(5)
      expect(analytics.clicksByLink[1].title).toBe('Link 2')

      // Check percentages
      expect(analytics.clicksByLink[0].percentage).toBe(67) // 10/15 ≈ 67%
      expect(analytics.clicksByLink[1].percentage).toBe(33) // 5/15 ≈ 33%

      // Check country and device aggregation
      expect(Object.keys(analytics.clicksByCountry).length).toBeGreaterThan(0)
      expect(Object.keys(analytics.clicksByDevice).length).toBeGreaterThan(0)
    })

    test('getClickAnalytics - should respect date range', async () => {
      const user = await createTestUser()
      const link = await createTestLink(user.id)

      // Create old click event (outside date range)
      await testPrisma.clickEvent.create({
        data: {
          linkId: link.id,
          clickedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago
        },
      })

      // Create recent click event
      await testPrisma.clickEvent.create({
        data: {
          linkId: link.id,
          clickedAt: new Date(),
        },
      })

      const analytics = await db.getClickAnalytics(user.id, 30)

      expect(analytics.totalClicks).toBe(1) // Only recent click
    })
  })

  test.describe('Profile Operations', () => {
    test('getPublicProfile - should return user without sensitive data', async () => {
      const user = await createTestUser({ username: 'public_user' })
      await createTestLink(user.id, { active: true })
      await createTestLink(user.id, { active: false })
      await createTestTheme(user.id)

      const profile = await db.getPublicProfile('public_user')

      expect(profile).toBeTruthy()
      expect(profile?.user.username).toBe('public_user')
      expect(profile?.user.links).toHaveLength(1) // Only active links
      expect(profile?.theme).toBeTruthy()
      
      // Check sensitive data is removed
      expect(profile?.user).not.toHaveProperty('createdAt')
      expect(profile?.user).not.toHaveProperty('updatedAt')
    })

    test('getPublicProfile - should return null for non-existent user', async () => {
      const profile = await db.getPublicProfile('non_existent')
      expect(profile).toBeNull()
    })
  })

  test.describe('Error Handling', () => {
    test('should handle database connection errors gracefully', async () => {
      // This test would require mocking the database connection
      // For now, we'll test that functions handle invalid input
      
      await expect(
        db.getUserById('invalid-uuid-format')
      ).rejects.toThrow()
    })

    test('should handle concurrent operations', async () => {
      const user = await createTestUser()
      
      // Create multiple links concurrently
      const promises = Array.from({ length: 5 }, (_, i) =>
        db.createLink({
          userId: user.id,
          title: `Link ${i}`,
          url: `https://example.com/${i}`,
        })
      )

      const links = await Promise.all(promises)
      
      // Check all links were created with proper ordering
      const orders = links.map(l => l.order).sort((a, b) => a - b)
      expect(orders).toEqual([0, 1, 2, 3, 4])
    })
  })
})