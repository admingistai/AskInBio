import { test, expect } from '@playwright/test'

test.describe('Dark Mode Theme Persistence', () => {
  let testUsername = 'testuser'

  // Setup: Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpass123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
    await page.waitForLoadState('networkidle')
    
    testUsername = 'testuser' // In real tests, this would be dynamically determined
  })

  test('should persist theme across dashboard navigation', async ({ page }) => {
    // Set dark theme
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    const currentClass = await page.locator('html').getAttribute('class')
    if (!currentClass?.includes('dark')) {
      await themeToggle.click()
      await page.waitForTimeout(1000)
    }
    
    // Verify dark mode is active
    let htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
    
    // Navigate to settings (if exists)
    const settingsLink = page.locator('a[href*="settings"]').or(
      page.locator('nav a').filter({ hasText: /settings/i })
    )
    
    if (await settingsLink.count() > 0) {
      await settingsLink.click()
      await page.waitForLoadState('networkidle')
      
      // Theme should persist
      htmlClass = await page.locator('html').getAttribute('class')
      expect(htmlClass).toContain('dark')
    }
    
    // Navigate back to dashboard
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Theme should still be dark
    htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
  })

  test('should persist theme from dashboard to social page', async ({ page }) => {
    // Set dark theme in dashboard
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    const currentClass = await page.locator('html').getAttribute('class')
    if (!currentClass?.includes('dark')) {
      await themeToggle.click()
      await page.waitForTimeout(1000)
    }
    
    // Verify dark mode in dashboard
    let htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
    
    // Navigate to social page
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    // Dark theme should be applied to social page
    htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
    
    // Switch back to light mode in dashboard
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const refreshedToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    await refreshedToggle.click()
    await page.waitForTimeout(1000)
    
    // Navigate to social page again
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    // Should now be light theme
    htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).not.toContain('dark')
  })

  test('should persist theme across browser refresh', async ({ page }) => {
    // Set dark theme
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    const currentClass = await page.locator('html').getAttribute('class')
    if (!currentClass?.includes('dark')) {
      await themeToggle.click()
      await page.waitForTimeout(1000)
    }
    
    // Verify dark mode
    let htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
    
    // Refresh the page
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Theme should persist after refresh
    htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
    
    // Toggle should reflect current state
    const refreshedToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    await expect(refreshedToggle).toBeVisible()
    
    // Check if moon icon is visible (indicating dark mode)
    const moonIcon = page.locator('[data-lucide="moon"]')
    await expect(moonIcon).toBeVisible()
  })

  test('should persist theme across multiple browser tabs', async ({ browser }) => {
    const context = await browser.newContext()
    
    // First tab - set dark theme
    const page1 = await context.newPage()
    await page1.goto('/login')
    await page1.waitForLoadState('networkidle')
    
    await page1.fill('input[type="email"]', 'test@example.com')
    await page1.fill('input[type="password"]', 'testpass123')
    await page1.click('button[type="submit"]')
    await page1.waitForURL('/dashboard')
    await page1.waitForLoadState('networkidle')
    
    const themeToggle1 = page1.locator('[data-testid="theme-toggle"]').or(
      page1.locator('button').filter({ hasText: /dark|light/i })
    )
    
    const currentClass = await page1.locator('html').getAttribute('class')
    if (!currentClass?.includes('dark')) {
      await themeToggle1.click()
      await page1.waitForTimeout(1000)
    }
    
    // Verify dark mode in first tab
    let htmlClass1 = await page1.locator('html').getAttribute('class')
    expect(htmlClass1).toContain('dark')
    
    // Second tab - navigate to social page
    const page2 = await context.newPage()
    await page2.goto(`/${testUsername}`)
    await page2.waitForLoadState('networkidle')
    
    // Theme should be applied in second tab
    const htmlClass2 = await page2.locator('html').getAttribute('class')
    expect(htmlClass2).toContain('dark')
    
    // Third tab - new dashboard session
    const page3 = await context.newPage()
    await page3.goto('/dashboard')
    await page3.waitForLoadState('networkidle')
    
    // Should still be dark theme
    const htmlClass3 = await page3.locator('html').getAttribute('class')
    expect(htmlClass3).toContain('dark')
    
    await context.close()
  })

  test('should maintain theme after logout and login', async ({ page }) => {
    // Set dark theme
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    const currentClass = await page.locator('html').getAttribute('class')
    if (!currentClass?.includes('dark')) {
      await themeToggle.click()
      await page.waitForTimeout(1000)
    }
    
    // Verify dark mode
    let htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
    
    // Logout
    const logoutButton = page.locator('button').filter({ hasText: /logout|sign out/i }).or(
      page.locator('[data-testid="logout"]')
    )
    
    // Find logout functionality (might be in menu or direct button)
    if (await logoutButton.count() > 0) {
      await logoutButton.click()
    } else {
      // Try to find user menu first
      const userMenu = page.locator('[data-testid="user-menu"]').or(
        page.locator('button').filter({ hasText: /menu|profile/i })
      )
      
      if (await userMenu.count() > 0) {
        await userMenu.click()
        await page.waitForTimeout(500)
        
        const logoutInMenu = page.locator('button').filter({ hasText: /logout|sign out/i })
        if (await logoutInMenu.count() > 0) {
          await logoutInMenu.click()
        }
      }
    }
    
    // Wait for redirect to login or home
    await page.waitForTimeout(2000)
    
    // Login again
    if (page.url().includes('/login')) {
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'testpass123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')
      await page.waitForLoadState('networkidle')
    } else {
      // Navigate to login manually
      await page.goto('/login')
      await page.waitForLoadState('networkidle')
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'testpass123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')
      await page.waitForLoadState('networkidle')
    }
    
    // Theme preference should be restored
    htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
  })

  test('should handle database sync delays gracefully', async ({ page }) => {
    // Set dark theme
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    const currentClass = await page.locator('html').getAttribute('class')
    if (!currentClass?.includes('dark')) {
      await themeToggle.click()
      
      // Don't wait for full completion - test immediate navigation
      await page.waitForTimeout(100)
    }
    
    // Immediately navigate to social page (might be before DB save completes)
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    // Wait a bit for potential DB sync
    await page.waitForTimeout(2000)
    
    // Check final theme state
    const htmlClass = await page.locator('html').getAttribute('class')
    
    // Theme should eventually be applied (might take time for DB sync)
    // In a real app, this would depend on implementation details
    expect(htmlClass).toContain('dark')
  })

  test('should revalidate social page when theme changes', async ({ page }) => {
    // Start with light theme - navigate to social page
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    // Verify light theme
    let htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).not.toContain('dark')
    
    // Return to dashboard and change theme
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    await themeToggle.click()
    await page.waitForTimeout(1000)
    
    // Navigate back to social page
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    // Page should be revalidated with new theme
    htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
    
    // Check that revalidatePath worked by looking for updated content
    const colorMeshBg = page.locator('.color-mesh-bg')
    if (await colorMeshBg.count() > 0) {
      const bgStyle = await colorMeshBg.first().evaluate(el => 
        window.getComputedStyle(el).background
      )
      
      // Should have dark mode gradient
      expect(bgStyle).toContain('linear-gradient')
    }
  })

  test('should handle concurrent theme changes correctly', async ({ browser }) => {
    const context = await browser.newContext()
    
    // Open two tabs with dashboard
    const page1 = await context.newPage()
    const page2 = await context.newPage()
    
    // Login in both tabs
    for (const page of [page1, page2]) {
      await page.goto('/login')
      await page.waitForLoadState('networkidle')
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'testpass123')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')
      await page.waitForLoadState('networkidle')
    }
    
    // Simultaneously change theme in both tabs
    const toggle1 = page1.locator('[data-testid="theme-toggle"]').or(
      page1.locator('button').filter({ hasText: /dark|light/i })
    )
    const toggle2 = page2.locator('[data-testid="theme-toggle"]').or(
      page2.locator('button').filter({ hasText: /dark|light/i })
    )
    
    // Click both toggles simultaneously
    await Promise.all([
      toggle1.click(),
      toggle2.click()
    ])
    
    // Wait for operations to complete
    await page1.waitForTimeout(2000)
    await page2.waitForTimeout(2000)
    
    // Check final states - should be consistent
    const htmlClass1 = await page1.locator('html').getAttribute('class')
    const htmlClass2 = await page2.locator('html').getAttribute('class')
    
    // Both tabs should have the same theme state
    expect(htmlClass1).toBe(htmlClass2)
    
    // Navigate to social page from both tabs
    await page1.goto(`/${testUsername}`)
    await page2.goto(`/${testUsername}`)
    
    await page1.waitForLoadState('networkidle')
    await page2.waitForLoadState('networkidle')
    
    // Social pages should also match
    const socialClass1 = await page1.locator('html').getAttribute('class')
    const socialClass2 = await page2.locator('html').getAttribute('class')
    
    expect(socialClass1).toBe(socialClass2)
    
    await context.close()
  })

  test('should gracefully handle database errors', async ({ page }) => {
    // Mock network to simulate database errors
    await page.route('**/api/**', async route => {
      const request = route.request()
      if (request.method() === 'POST' && request.url().includes('theme')) {
        // Simulate database error
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Database connection failed' })
        })
      } else {
        await route.continue()
      }
    })
    
    // Try to change theme
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    const initialClass = await page.locator('html').getAttribute('class')
    
    await themeToggle.click()
    await page.waitForTimeout(1000)
    
    // Theme should revert to original state due to error
    const finalClass = await page.locator('html').getAttribute('class')
    expect(finalClass).toBe(initialClass)
    
    // Error toast should appear
    const errorToast = page.locator('[data-sonner-toast]').filter({ hasText: /failed|error/i })
    await expect(errorToast).toBeVisible({ timeout: 3000 })
  })

  test('should maintain theme preference for new sessions', async ({ browser }) => {
    // First session - set theme preference
    const context1 = await browser.newContext()
    const page1 = await context1.newPage()
    
    await page1.goto('/login')
    await page1.waitForLoadState('networkidle')
    await page1.fill('input[type="email"]', 'test@example.com')
    await page1.fill('input[type="password"]', 'testpass123')
    await page1.click('button[type="submit"]')
    await page1.waitForURL('/dashboard')
    await page1.waitForLoadState('networkidle')
    
    const themeToggle1 = page1.locator('[data-testid="theme-toggle"]').or(
      page1.locator('button').filter({ hasText: /dark|light/i })
    )
    
    const currentClass = await page1.locator('html').getAttribute('class')
    if (!currentClass?.includes('dark')) {
      await themeToggle1.click()
      await page1.waitForTimeout(1000)
    }
    
    await context1.close()
    
    // New session - theme should be restored
    const context2 = await browser.newContext()
    const page2 = await context2.newPage()
    
    await page2.goto('/login')
    await page2.waitForLoadState('networkidle')
    await page2.fill('input[type="email"]', 'test@example.com')
    await page2.fill('input[type="password"]', 'testpass123')
    await page2.click('button[type="submit"]')
    await page2.waitForURL('/dashboard')
    await page2.waitForLoadState('networkidle')
    
    // Theme should be restored from database
    const htmlClass = await page2.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
    
    await context2.close()
  })
})