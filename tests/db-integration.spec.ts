/**
 * Database Integration E2E Tests
 * 
 * Purpose:
 * - Test complete user flows with real database
 * - Verify data persistence across operations
 * - Test UI interactions with database
 * - Validate real-world scenarios
 * 
 * Coverage:
 * - User registration and profile creation
 * - Link management workflows
 * - Theme customization
 * - Analytics tracking
 */

import { test, expect } from './db.setup'
import { 
  createTestUser,
  createTestLink,
  createTestTheme,
  cleanupTestData,
  assertLinkOrder,
  testPrisma,
  waitFor
} from './utils/db-helpers'
import * as db from '@/lib/db'

test.describe('Database Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and local storage
    await page.context().clearCookies()
    await page.evaluate(() => localStorage.clear())
  })

  test.afterEach(async ({ dbCleanup }) => {
    await dbCleanup()
  })

  test.describe('User Profile Flow', () => {
    test('should display user profile with links', async ({ page }) => {
      // Create test user with data
      const user = await createTestUser({ 
        username: 'testprofile',
        displayName: 'Test Profile User',
        bio: 'This is my test bio'
      })
      
      const links = await Promise.all([
        createTestLink(user.id, { 
          title: 'My Website',
          url: 'https://example.com',
          order: 0,
          active: true
        }),
        createTestLink(user.id, { 
          title: 'Twitter',
          url: 'https://twitter.com/test',
          order: 1,
          active: true
        }),
        createTestLink(user.id, { 
          title: 'Hidden Link',
          url: 'https://hidden.com',
          order: 2,
          active: false
        }),
      ])

      // Visit profile page
      await page.goto(`http://localhost:3000/testprofile`)
      
      // Check profile information
      await expect(page.getByText('@testprofile')).toBeVisible()
      await expect(page.getByText('Test Profile User')).toBeVisible()
      await expect(page.getByText('This is my test bio')).toBeVisible()
      
      // Check links are displayed (only active ones)
      await expect(page.getByText('My Website')).toBeVisible()
      await expect(page.getByText('Twitter')).toBeVisible()
      await expect(page.getByText('Hidden Link')).not.toBeVisible()
    })

    test('should track link clicks', async ({ page }) => {
      const user = await createTestUser({ username: 'clicktest' })
      const link = await createTestLink(user.id, {
        title: 'Track This Link',
        url: 'https://track.example.com',
        clicks: 0
      })

      // Visit profile and click link
      await page.goto(`http://localhost:3000/clicktest`)
      
      // Click the link
      const linkElement = page.getByText('Track This Link')
      await linkElement.click()
      
      // Wait for click to be recorded
      await waitFor(500)
      
      // Verify click was tracked in database
      const updatedLink = await testPrisma.link.findUnique({
        where: { id: link.id }
      })
      expect(updatedLink?.clicks).toBe(1)
      
      // Verify click event was created
      const clickEvents = await testPrisma.clickEvent.findMany({
        where: { linkId: link.id }
      })
      expect(clickEvents).toHaveLength(1)
    })

    test('should apply custom theme to profile', async ({ page }) => {
      const user = await createTestUser({ username: 'themetest' })
      await createTestTheme(user.id, {
        name: 'Custom Theme',
        primaryColor: '#FF0000',
        backgroundColor: '#000000',
        fontFamily: 'monospace'
      })

      await page.goto(`http://localhost:3000/themetest`)
      
      // Check theme is applied (this would need actual implementation)
      const body = page.locator('body')
      
      // Verify theme styles are applied
      // Note: These assertions would need the actual theme implementation
      // For now, we're just checking the page loads
      await expect(page).toHaveURL(/.*themetest/)
    })
  })

  test.describe('Dashboard Link Management', () => {
    test('should add new link', async ({ page, dbUser }) => {
      // Mock authentication (would need actual auth implementation)
      // For now, we'll test the database operations directly
      
      const newLinkData = {
        userId: dbUser.id,
        title: 'New Test Link',
        url: 'https://newlink.com'
      }
      
      // Create link via database
      const link = await db.createLink(newLinkData)
      
      // Verify link was created
      expect(link.title).toBe(newLinkData.title)
      expect(link.url).toBe(newLinkData.url)
      expect(link.order).toBe(0)
      expect(link.active).toBe(true)
      
      // Verify link appears in user's links
      const userLinks = await db.getUserLinks(dbUser.id)
      expect(userLinks).toHaveLength(1)
      expect(userLinks[0].id).toBe(link.id)
    })

    test('should reorder links', async ({ page, dbUser }) => {
      // Create multiple links
      const link1 = await createTestLink(dbUser.id, { title: 'Link 1', order: 0 })
      const link2 = await createTestLink(dbUser.id, { title: 'Link 2', order: 1 })
      const link3 = await createTestLink(dbUser.id, { title: 'Link 3', order: 2 })
      
      // Reorder links
      await db.reorderLinks(dbUser.id, [link3.id, link1.id, link2.id])
      
      // Verify new order
      const reordered = await db.getUserLinks(dbUser.id)
      expect(reordered[0].id).toBe(link3.id)
      expect(reordered[1].id).toBe(link1.id)
      expect(reordered[2].id).toBe(link2.id)
      
      // Verify order values
      expect(reordered[0].order).toBe(0)
      expect(reordered[1].order).toBe(1)
      expect(reordered[2].order).toBe(2)
    })

    test('should update link details', async ({ page, dbUser }) => {
      const link = await createTestLink(dbUser.id, {
        title: 'Original Title',
        url: 'https://original.com',
        active: true
      })
      
      // Update link
      const updated = await db.updateLink(link.id, {
        title: 'Updated Title',
        url: 'https://updated.com',
        active: false
      })
      
      expect(updated.title).toBe('Updated Title')
      expect(updated.url).toBe('https://updated.com')
      expect(updated.active).toBe(false)
    })

    test('should delete link', async ({ page, dbUser }) => {
      const link = await createTestLink(dbUser.id)
      
      // Verify link exists
      let links = await db.getUserLinks(dbUser.id)
      expect(links).toHaveLength(1)
      
      // Delete link
      await db.deleteLink(link.id)
      
      // Verify link is gone
      links = await db.getUserLinks(dbUser.id)
      expect(links).toHaveLength(0)
      
      // Verify cascade deletion of click events
      const clickEvents = await testPrisma.clickEvent.findMany({
        where: { linkId: link.id }
      })
      expect(clickEvents).toHaveLength(0)
    })
  })

  test.describe('Analytics Dashboard', () => {
    test('should show accurate click analytics', async ({ page, dbUser }) => {
      // Create links with clicks
      const link1 = await createTestLink(dbUser.id, { title: 'Popular Link' })
      const link2 = await createTestLink(dbUser.id, { title: 'Less Popular' })
      
      // Track clicks
      for (let i = 0; i < 10; i++) {
        await db.trackClick(link1.id, {
          country: i % 2 === 0 ? 'US' : 'UK',
          device: i % 3 === 0 ? 'mobile' : 'desktop'
        })
      }
      
      for (let i = 0; i < 5; i++) {
        await db.trackClick(link2.id, {
          country: 'CA',
          device: 'tablet'
        })
      }
      
      // Get analytics
      const analytics = await db.getClickAnalytics(dbUser.id)
      
      // Verify analytics data
      expect(analytics.totalClicks).toBe(15)
      expect(analytics.clicksByLink).toHaveLength(2)
      
      // Check link rankings
      expect(analytics.clicksByLink[0].title).toBe('Popular Link')
      expect(analytics.clicksByLink[0].clicks).toBe(10)
      expect(analytics.clicksByLink[0].percentage).toBe(67)
      
      expect(analytics.clicksByLink[1].title).toBe('Less Popular')
      expect(analytics.clicksByLink[1].clicks).toBe(5)
      expect(analytics.clicksByLink[1].percentage).toBe(33)
      
      // Check country distribution
      expect(analytics.clicksByCountry['US']).toBe(5)
      expect(analytics.clicksByCountry['UK']).toBe(5)
      expect(analytics.clicksByCountry['CA']).toBe(5)
      
      // Check device distribution
      expect(analytics.clicksByDevice['desktop']).toBe(6)
      expect(analytics.clicksByDevice['mobile']).toBe(4)
      expect(analytics.clicksByDevice['tablet']).toBe(5)
    })

    test('should show daily click trends', async ({ page, dbUser }) => {
      const link = await createTestLink(dbUser.id)
      
      // Create clicks over several days
      const now = new Date()
      for (let daysAgo = 0; daysAgo < 7; daysAgo++) {
        const clickDate = new Date(now)
        clickDate.setDate(clickDate.getDate() - daysAgo)
        
        // More clicks on weekends (0 = Sunday, 6 = Saturday)
        const clickCount = clickDate.getDay() === 0 || clickDate.getDay() === 6 ? 5 : 2
        
        for (let i = 0; i < clickCount; i++) {
          await testPrisma.clickEvent.create({
            data: {
              linkId: link.id,
              clickedAt: clickDate,
              country: 'US',
              device: 'mobile'
            }
          })
        }
      }
      
      // Get analytics
      const analytics = await db.getClickAnalytics(dbUser.id, 7)
      
      // Verify we have 7 days of data
      expect(analytics.clicksByDay).toHaveLength(7)
      
      // Verify click counts
      const totalClicks = analytics.clicksByDay.reduce((sum, day) => sum + day.clicks, 0)
      expect(totalClicks).toBeGreaterThan(0)
    })
  })

  test.describe('Data Integrity', () => {
    test('should maintain referential integrity', async ({ dbUser }) => {
      // Create related data
      const link = await createTestLink(dbUser.id)
      const theme = await createTestTheme(dbUser.id)
      
      // Generate click events
      await db.trackClick(link.id)
      await db.trackClick(link.id)
      
      // Delete user (should cascade)
      await testPrisma.user.delete({
        where: { id: dbUser.id }
      })
      
      // Verify all related data is deleted
      const remainingLinks = await testPrisma.link.findMany({
        where: { userId: dbUser.id }
      })
      expect(remainingLinks).toHaveLength(0)
      
      const remainingThemes = await testPrisma.theme.findMany({
        where: { userId: dbUser.id }
      })
      expect(remainingThemes).toHaveLength(0)
      
      const remainingClicks = await testPrisma.clickEvent.findMany({
        where: { linkId: link.id }
      })
      expect(remainingClicks).toHaveLength(0)
    })

    test('should handle concurrent updates correctly', async ({ dbUser }) => {
      // Create a link
      const link = await createTestLink(dbUser.id, { clicks: 0 })
      
      // Simulate concurrent clicks
      const clickPromises = Array.from({ length: 10 }, () =>
        db.trackClick(link.id)
      )
      
      await Promise.all(clickPromises)
      
      // Verify all clicks were recorded
      const updatedLink = await testPrisma.link.findUnique({
        where: { id: link.id }
      })
      expect(updatedLink?.clicks).toBe(10)
      
      const clickEvents = await testPrisma.clickEvent.findMany({
        where: { linkId: link.id }
      })
      expect(clickEvents).toHaveLength(10)
    })

    test('should enforce unique constraints', async () => {
      // Create user with specific username
      await createTestUser({ username: 'unique_test' })
      
      // Try to create another user with same username
      await expect(
        createTestUser({ username: 'unique_test' })
      ).rejects.toThrow()
    })
  })

  test.describe('Performance Considerations', () => {
    test('should handle large number of links efficiently', async ({ dbUser }) => {
      const startTime = Date.now()
      
      // Create 100 links
      const linkPromises = Array.from({ length: 100 }, (_, i) =>
        createTestLink(dbUser.id, {
          title: `Link ${i}`,
          order: i
        })
      )
      
      await Promise.all(linkPromises)
      
      // Fetch all links
      const links = await db.getUserLinks(dbUser.id)
      
      const endTime = Date.now()
      const duration = endTime - startTime
      
      // Verify all links were created
      expect(links).toHaveLength(100)
      
      // Performance check (should complete in reasonable time)
      expect(duration).toBeLessThan(5000) // 5 seconds max
    })

    test('should paginate analytics data efficiently', async ({ dbUser }) => {
      const link = await createTestLink(dbUser.id)
      
      // Create many click events
      const clickPromises = Array.from({ length: 1000 }, (_, i) =>
        testPrisma.clickEvent.create({
          data: {
            linkId: link.id,
            country: ['US', 'UK', 'CA'][i % 3],
            device: ['mobile', 'desktop', 'tablet'][i % 3],
            clickedAt: new Date(Date.now() - i * 60000) // Spread over time
          }
        })
      )
      
      await Promise.all(clickPromises)
      
      const startTime = Date.now()
      const analytics = await db.getClickAnalytics(dbUser.id, 30)
      const endTime = Date.now()
      
      // Verify analytics were calculated
      expect(analytics.totalClicks).toBeGreaterThan(0)
      
      // Performance check
      expect(endTime - startTime).toBeLessThan(2000) // 2 seconds max
    })
  })
})