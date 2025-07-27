import { test, expect } from '@playwright/test'

test.describe('Public Profile - Glass Design Verification', () => {
  test('glass profile loads and displays all components', async ({ page }) => {
    // Navigate to the demo profile
    await page.goto('/demo')

    // Wait for the profile to load
    await page.waitForSelector('.glass-header', { timeout: 10000 })

    // Verify glass header is visible
    const header = page.locator('.glass-header')
    await expect(header).toBeVisible()
    
    // Verify user info is displayed
    await expect(page.locator('h1')).toBeVisible() // Display name
    await expect(page.locator('p:has-text("@demo")')).toBeVisible() // Username
    
    // Verify glass link cards are present
    const links = page.locator('.glass-link')
    const linkCount = await links.count()
    expect(linkCount).toBeGreaterThan(0)
    
    // Verify glass bottom bar
    const bottomBar = page.locator('.glass-footer')
    await expect(bottomBar).toBeVisible()
    
    // Verify search functionality is present
    const searchInput = page.locator('input[placeholder="Search links..."]')
    await expect(searchInput).toBeVisible()
    
    // Verify share and QR buttons
    await expect(page.locator('button:has-text("Share")')).toBeVisible()
    await expect(page.locator('button:has-text("QR")')).toBeVisible()
  })

  test('glass effects are applied correctly', async ({ page }) => {
    await page.goto('/demo')
    await page.waitForSelector('.glass-header')

    // Check that glass header has backdrop filter
    const header = page.locator('.glass-header')
    const backdropFilter = await header.evaluate(el => 
      window.getComputedStyle(el).backdropFilter
    )
    expect(backdropFilter).toContain('blur')
    
    // Check that glass links exist and have glass styling
    const firstLink = page.locator('.glass-link').first()
    await expect(firstLink).toBeVisible()
    const classes = await firstLink.getAttribute('class')
    expect(classes).toContain('glass-link')
  })

  test('responsive mobile layout works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 }) // iPhone X size
    
    await page.goto('/demo')
    await page.waitForSelector('.glass-header')

    // All components should still be visible
    await expect(page.locator('.glass-header')).toBeVisible()
    await expect(page.locator('.glass-link').first()).toBeVisible()
    await expect(page.locator('.glass-footer')).toBeVisible()
    
    // Container should have max width for mobile
    const container = page.locator('.max-w-md')
    await expect(container).toBeVisible()
  })

  test('404 page works for non-existent profiles', async ({ page }) => {
    const response = await page.goto('/nonexistentuser')
    expect(response?.status()).toBe(404)
  })

  test('link elements are properly structured', async ({ page }) => {
    await page.goto('/demo')
    await page.waitForSelector('.glass-link')

    // Get all links
    const links = page.locator('.glass-link')
    const linkCount = await links.count()
    expect(linkCount).toBeGreaterThan(0)
    
    // Check first link structure
    const firstLink = links.first()
    await expect(firstLink).toBeVisible()
    
    // Verify it's a button element
    const tagName = await firstLink.evaluate(el => el.tagName.toLowerCase())
    expect(tagName).toBe('button')
    
    // Verify it has title text
    const titleText = await firstLink.locator('h3').textContent()
    expect(titleText).toBeTruthy()
    
    // Verify it has the glass styling
    const hasGlassClass = await firstLink.evaluate(el => 
      el.classList.contains('glass-link')
    )
    expect(hasGlassClass).toBe(true)
  })
})