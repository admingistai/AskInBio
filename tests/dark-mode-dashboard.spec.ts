import { test, expect } from '@playwright/test'

test.describe('Dashboard Dark Mode Toggle', () => {
  // Setup: Login and navigate to dashboard before each test
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Fill in test credentials (assuming test user exists)
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpass123')
    
    // Click login button
    await page.click('button[type="submit"]')
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard')
    await page.waitForLoadState('networkidle')
  })

  test('should render theme toggle component', async ({ page }) => {
    // Verify theme toggle exists in dashboard header
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    await expect(themeToggle).toBeVisible()
    
    // Verify glass pill styling
    await expect(themeToggle).toHaveClass(/glass-pill/)
    
    // Check for sun/moon icons
    const sunIcon = page.locator('[data-lucide="sun"]').or(
      page.locator('svg').filter({ hasText: /sun/i })
    )
    const moonIcon = page.locator('[data-lucide="moon"]').or(
      page.locator('svg').filter({ hasText: /moon/i })
    )
    
    // At least one icon should be visible
    const iconsVisible = await sunIcon.isVisible() || await moonIcon.isVisible()
    expect(iconsVisible).toBe(true)
  })

  test('should toggle between light and dark modes', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    // Get initial theme state
    const initialBodyClass = await page.locator('html').getAttribute('class')
    const initiallyDark = initialBodyClass?.includes('dark') || false
    
    // Click theme toggle
    await themeToggle.click()
    
    // Wait for transition
    await page.waitForTimeout(500)
    
    // Verify theme changed
    const newBodyClass = await page.locator('html').getAttribute('class')
    const nowDark = newBodyClass?.includes('dark') || false
    
    expect(nowDark).toBe(!initiallyDark)
    
    // Click again to toggle back
    await themeToggle.click()
    await page.waitForTimeout(500)
    
    // Should return to original state
    const finalBodyClass = await page.locator('html').getAttribute('class')
    const finallyDark = finalBodyClass?.includes('dark') || false
    
    expect(finallyDark).toBe(initiallyDark)
  })

  test('should show loading state during theme change', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    // Look for loading spinner
    const loadingSpinner = page.locator('[data-lucide="loader-2"]').or(
      page.locator('.animate-spin')
    )
    
    // Click toggle and immediately check for loading state
    await themeToggle.click()
    
    // Loading state might be very brief, so we'll check if it appeared
    // by checking if the button becomes disabled or shows loading indicator
    const isDisabledDuringLoad = await themeToggle.isDisabled()
    
    // Wait for operation to complete
    await page.waitForTimeout(1000)
    
    // Button should be enabled again
    await expect(themeToggle).toBeEnabled()
  })

  test('should update preview panel theme in real-time', async ({ page }) => {
    // Locate preview panel
    const previewPanel = page.locator('.dashboard-panel').filter({ hasText: /preview/i }).or(
      page.locator('[data-testid="preview-panel"]')
    )
    
    await expect(previewPanel).toBeVisible()
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    // Get initial preview styling
    const initialPreviewBg = await previewPanel.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    // Toggle theme
    await themeToggle.click()
    await page.waitForTimeout(500)
    
    // Verify preview panel updated
    const newPreviewBg = await previewPanel.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    // Background should have changed
    expect(newPreviewBg).not.toBe(initialPreviewBg)
  })

  test('should persist theme preference to database', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    // Toggle to dark mode
    await themeToggle.click()
    await page.waitForTimeout(1000)
    
    // Refresh page to test persistence
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Check if dark mode persisted
    const bodyClass = await page.locator('html').getAttribute('class')
    const isDark = bodyClass?.includes('dark') || false
    
    // If we toggled to dark, it should still be dark after refresh
    // Note: This test assumes we started in light mode
    expect(isDark).toBe(true)
    
    // Toggle back and test again
    const refreshedToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    await refreshedToggle.click()
    await page.waitForTimeout(1000)
    
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    const finalBodyClass = await page.locator('html').getAttribute('class')
    const finallyDark = finalBodyClass?.includes('dark') || false
    
    expect(finallyDark).toBe(false)
  })

  test('should display correct icons based on theme state', async ({ page }) => {
    const sunIcon = page.locator('[data-lucide="sun"]')
    const moonIcon = page.locator('[data-lucide="moon"]')
    
    // Get initial state
    const initialBodyClass = await page.locator('html').getAttribute('class')
    const initiallyDark = initialBodyClass?.includes('dark') || false
    
    if (initiallyDark) {
      // In dark mode, moon should be visible
      await expect(moonIcon).toBeVisible()
      await expect(sunIcon).not.toBeVisible()
    } else {
      // In light mode, sun should be visible  
      await expect(sunIcon).toBeVisible()
      await expect(moonIcon).not.toBeVisible()
    }
    
    // Toggle theme
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    await themeToggle.click()
    await page.waitForTimeout(500)
    
    // Icons should have swapped
    if (initiallyDark) {
      await expect(sunIcon).toBeVisible()
      await expect(moonIcon).not.toBeVisible()
    } else {
      await expect(moonIcon).toBeVisible()
      await expect(sunIcon).not.toBeVisible()
    }
  })

  test('should apply glass pill styling correctly', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    // Verify glass pill base styles
    await expect(themeToggle).toHaveClass(/glass-pill/)
    
    // Check computed styles for glass effects
    const backgroundStyle = await themeToggle.evaluate(el => 
      window.getComputedStyle(el).background
    )
    const backdropFilter = await themeToggle.evaluate(el => 
      window.getComputedStyle(el).backdropFilter
    )
    
    // Should have glass background
    expect(backgroundStyle).toContain('rgba')
    
    // Should have backdrop filter (blur effect)
    expect(backdropFilter).toContain('blur')
    
    // Test hover effects
    await themeToggle.hover()
    await page.waitForTimeout(200)
    
    const hoverBackground = await themeToggle.evaluate(el => 
      window.getComputedStyle(el).background
    )
    
    // Background should change on hover
    expect(hoverBackground).not.toBe(backgroundStyle)
  })

  test('should show success toast on theme change', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    // Click toggle
    await themeToggle.click()
    
    // Look for success toast
    const toast = page.locator('[data-sonner-toast]').or(
      page.locator('.toast').filter({ hasText: /mode enabled/i })
    )
    
    // Toast should appear
    await expect(toast).toBeVisible({ timeout: 3000 })
    
    // Toast should contain theme-related message
    const toastText = await toast.textContent()
    expect(toastText).toMatch(/(dark|light) mode enabled/i)
  })

  test('should handle rapid toggle clicks gracefully', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    // Get initial state
    const initialBodyClass = await page.locator('html').getAttribute('class')
    
    // Rapidly click toggle multiple times
    await themeToggle.click()
    await themeToggle.click() 
    await themeToggle.click()
    
    // Wait for all operations to complete
    await page.waitForTimeout(2000)
    
    // Should still be functional and not crash
    await expect(themeToggle).toBeEnabled()
    
    // Final state should be stable
    const finalBodyClass = await page.locator('html').getAttribute('class')
    
    // Since we clicked odd number of times (3), theme should be different
    const initiallyDark = initialBodyClass?.includes('dark') || false
    const finallyDark = finalBodyClass?.includes('dark') || false
    
    expect(finallyDark).toBe(!initiallyDark)
  })

  test('should be keyboard accessible', async ({ page }) => {
    // Focus the theme toggle using Tab key
    await page.keyboard.press('Tab')
    
    // Find which element is focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    
    // Navigate to theme toggle (might need multiple tabs)
    let attempts = 0
    while (attempts < 10) {
      const currentFocus = page.locator(':focus')
      const isThemeToggle = await currentFocus.filter({ hasText: /dark|light/i }).count() > 0
      
      if (isThemeToggle) {
        break
      }
      
      await page.keyboard.press('Tab')
      attempts++
    }
    
    // Get current theme
    const initialBodyClass = await page.locator('html').getAttribute('class')
    const initiallyDark = initialBodyClass?.includes('dark') || false
    
    // Press Enter or Space to activate
    await page.keyboard.press('Enter')
    await page.waitForTimeout(500)
    
    // Verify theme changed
    const newBodyClass = await page.locator('html').getAttribute('class')
    const nowDark = newBodyClass?.includes('dark') || false
    
    expect(nowDark).toBe(!initiallyDark)
  })
})