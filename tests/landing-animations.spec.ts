import { test, expect } from '@playwright/test'

test.describe('Landing Page Animations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should have staggered fade-in sequence on load', async ({ page }) => {
    // Check initial states
    const title = page.locator('h1')
    const description = page.locator('p:has-text("Add Link Anything")')
    const button = page.locator('button:has-text("Get Started")')
    
    // Title should appear first (no delay)
    await expect(title).toHaveCSS('opacity', '1', { timeout: 2000 })
    
    // Description should appear with delay
    await expect(description).toHaveCSS('opacity', '1', { timeout: 2000 })
    
    // Button should appear last (1200ms delay)
    await page.waitForTimeout(1200)
    await expect(button).toHaveCSS('opacity', '1')
  })

  test('should fade out content before button when clicked', async ({ page }) => {
    const title = page.locator('h1')
    const description = page.locator('p:has-text("Add Link Anything")')
    const button = page.locator('button:has-text("Get Started")')
    
    // Wait for button to appear
    await page.waitForTimeout(1500)
    
    // Click the button
    await button.click()
    
    // Content should fade out first
    await page.waitForTimeout(100)
    await expect(title).toHaveCSS('opacity', '0')
    await expect(description).toHaveCSS('opacity', '0')
    
    // Button should fade out after content
    await page.waitForTimeout(400)
    await expect(button).toHaveCSS('opacity', '0')
    
    // Onboarding container should appear
    await page.waitForTimeout(1000)
    const container = page.locator('.onboarding-container')
    await expect(container).toHaveCSS('opacity', '1')
  })

  test('button should have smooth fade-in animation', async ({ page }) => {
    const button = page.locator('button:has-text("Get Started")')
    
    // Initially hidden
    await expect(button).toHaveCSS('opacity', '0')
    
    // Should fade in after delay
    await page.waitForTimeout(1500)
    await expect(button).toHaveCSS('opacity', '1')
    
    // Check transition property
    const transitionProperty = await button.evaluate((el) => {
      return window.getComputedStyle(el).transitionProperty
    })
    expect(transitionProperty).toContain('opacity')
  })

  test('animation timing should be coordinated', async ({ page }) => {
    const button = page.locator('button:has-text("Get Started")')
    
    // Wait for all animations to complete
    await page.waitForTimeout(2000)
    
    // Click button and measure timing
    await button.click()
    
    // Track visibility changes
    const title = page.locator('h1')
    const container = page.locator('.onboarding-container')
    
    // Content fades out (300ms)
    await page.waitForTimeout(350)
    await expect(title).toHaveCSS('opacity', '0')
    
    // Button fades out (starts at 300ms, duration 800ms)
    await page.waitForTimeout(500)
    await expect(button).toHaveCSS('opacity', '0')
    
    // Container appears (at 1100ms)
    await page.waitForTimeout(300)
    await expect(container).toBeVisible()
  })
})