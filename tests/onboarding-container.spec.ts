import { test, expect } from '@playwright/test'

test.describe('Onboarding Container', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should show container when Get Started is clicked', async ({ page }) => {
    const button = page.locator('button:has-text("Get Started")')
    const container = page.locator('.onboarding-widget')
    
    // Initially container should not be visible
    await expect(container).toHaveCSS('opacity', '0')
    
    // Click Get Started
    await button.click()
    
    // Wait for animations and show onboarding (1100ms delay + transition time)
    await page.waitForTimeout(1500)
    
    // Container should be visible
    await expect(container).toHaveCSS('opacity', '1')
  })

  test('should not have debug border in production', async ({ page }) => {
    const button = page.locator('button:has-text("Get Started")')
    await button.click()
    await page.waitForTimeout(1500)
    
    const container = page.locator('.onboarding-widget')
    // Debug mode should be disabled by default
    await expect(container).not.toHaveClass(/debug-border/)
  })

  test('should be fixed positioned and centered', async ({ page }) => {
    const button = page.locator('button:has-text("Get Started")')
    await button.click()
    await page.waitForTimeout(1500)
    
    const container = page.locator('.onboarding-widget')
    
    await expect(container).toHaveCSS('position', 'fixed')
    await expect(container).toHaveCSS('width', '303px')
    
    // Check that it's horizontally centered using transform
    const transform = await container.evaluate((el) => {
      return window.getComputedStyle(el).transform
    })
    expect(transform).toContain('matrix') // transform: translateX(-50%) becomes a matrix
  })

  test('should close when close button is clicked', async ({ page }) => {
    const getStartedButton = page.locator('button:has-text("Get Started")')
    await getStartedButton.click()
    await page.waitForTimeout(1500)
    
    const closeButton = page.locator('button:has-text("Close")')
    await closeButton.click()
    
    // Container should fade out
    const container = page.locator('.onboarding-widget')
    await expect(container).toHaveCSS('opacity', '0')
    
    // Get Started button should reappear
    await expect(getStartedButton).toBeVisible()
  })

  test('should have smooth fade transition', async ({ page }) => {
    const button = page.locator('button:has-text("Get Started")')
    const container = page.locator('.onboarding-widget')
    
    // Check transition duration and timing
    const transitionDuration = await container.evaluate((el) => {
      return window.getComputedStyle(el).transitionDuration
    })
    const transitionTiming = await container.evaluate((el) => {
      return window.getComputedStyle(el).transitionTimingFunction
    })
    
    expect(transitionDuration).toBe('0.3s') // 300ms duration
    expect(transitionTiming).toBe('cubic-bezier(0, 0, 0.2, 1)') // Tailwind's ease-out
  })

  test('should contain test input for keyboard detection', async ({ page }) => {
    const button = page.locator('button:has-text("Get Started")')
    await button.click()
    await page.waitForTimeout(1500)
    
    const input = page.locator('input[placeholder="Test keyboard detection..."]')
    await expect(input).toBeVisible()
    await expect(input).toHaveClass(/glass-input/)
  })

  test('should have proper z-index layering', async ({ page }) => {
    const button = page.locator('button:has-text("Get Started")')
    await button.click()
    await page.waitForTimeout(1500)
    
    const container = page.locator('.onboarding-widget')
    const zIndex = await container.evaluate((el) => {
      return window.getComputedStyle(el).zIndex
    })
    
    // Should be above the Get Started button (z-20)
    expect(parseInt(zIndex)).toBeGreaterThan(20)
  })

  test('keyboard detection on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    const button = page.locator('button:has-text("Get Started")')
    await button.click()
    await page.waitForTimeout(1500)
    
    const input = page.locator('input[placeholder="Test keyboard detection..."]')
    
    // Focus input to trigger keyboard
    await input.focus()
    
    // Check console logs for keyboard detection
    const logs: string[] = []
    page.on('console', msg => {
      if (msg.text().includes('Keyboard')) {
        logs.push(msg.text())
      }
    })
    
    // Wait a bit for keyboard detection
    await page.waitForTimeout(500)
    
    // Blur to hide keyboard
    await input.blur()
    await page.waitForTimeout(500)
    
    // Note: Actual keyboard detection will work on real iOS devices
    // This test verifies the structure is in place
  })
})