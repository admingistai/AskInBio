import { test, expect } from '@playwright/test'

test.describe('Get Started Button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display button with correct Figma styling', async ({ page }) => {
    const button = page.locator('button:has-text("Get Started")')
    
    await expect(button).toBeVisible()
    await expect(button).toHaveCSS('position', 'fixed')
    
    // Check Figma dimensions
    const buttonStyles = await button.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return {
        width: styles.width,
        height: styles.height,
        borderRadius: styles.borderRadius,
        background: styles.background,
        backdropFilter: styles.backdropFilter
      }
    })
    
    expect(buttonStyles.width).toBe('353px')
    expect(buttonStyles.height).toBe('51px')
    expect(buttonStyles.borderRadius).toBe('23px')
    expect(buttonStyles.backdropFilter).toContain('blur')
    
    // Check positioning
    const boundingBox = await button.boundingBox()
    expect(boundingBox).toBeTruthy()
    
    // Should be centered horizontally
    const viewportSize = page.viewportSize()
    if (viewportSize && boundingBox) {
      const centerX = boundingBox.x + boundingBox.width / 2
      const viewportCenterX = viewportSize.width / 2
      expect(Math.abs(centerX - viewportCenterX)).toBeLessThan(10)
    }
  })

  test('should have pulse animation when not fading', async ({ page }) => {
    const button = page.locator('button:has-text("Get Started")')
    
    const animationStyle = await button.getAttribute('style')
    expect(animationStyle).toContain('pulse')
  })

  test('should fade out when clicked', async ({ page }) => {
    const button = page.locator('button:has-text("Get Started")')
    
    // Initial state
    await expect(button).toHaveCSS('opacity', '1')
    
    // Click and wait for fade
    await button.click()
    
    // Should start fading
    await expect(button).toHaveClass(/opacity-0/)
    await expect(button).toHaveClass(/scale-95/)
  })

  test('should navigate to register page after slower fade', async ({ page }) => {
    const button = page.locator('button:has-text("Get Started")')
    
    // Click and wait for navigation (800ms fade)
    const navigationPromise = page.waitForURL('/register', { waitUntil: 'domcontentloaded', timeout: 2000 })
    await button.click()
    await navigationPromise
    
    // Should be on register page
    expect(page.url()).toContain('/register')
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    const button = page.locator('button:has-text("Get Started")')
    await expect(button).toBeVisible()
    
    // Check responsive width
    const buttonStyles = await button.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return {
        width: styles.width,
        maxWidth: styles.maxWidth
      }
    })
    
    // Should respect maxWidth on mobile
    expect(parseInt(buttonStyles.width)).toBeLessThanOrEqual(353)
  })

  test('should maintain center position on different screen sizes', async ({ page }) => {
    const button = page.locator('button:has-text("Get Started")')
    
    // Test on different viewport widths
    const viewportWidths = [320, 768, 1024, 1440]
    
    for (const width of viewportWidths) {
      await page.setViewportSize({ width, height: 800 })
      await page.waitForTimeout(100) // Allow for reflow
      
      const boundingBox = await button.boundingBox()
      if (boundingBox) {
        const centerX = boundingBox.x + boundingBox.width / 2
        const expectedCenterX = width / 2
        expect(Math.abs(centerX - expectedCenterX)).toBeLessThan(10)
      }
    }
  })
})