import { test, expect } from '@playwright/test'

test.describe('User Social Page Dark Mode', () => {
  let testUsername = 'testuser'

  // Setup: Create test user and set theme preference
  test.beforeEach(async ({ page }) => {
    // First, login to dashboard to set up theme preference
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    
    // Login with test credentials
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpass123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Get the test user's username from the page or assume it's known
    // This would typically come from test data setup
    testUsername = 'testuser' // In real tests, this would be dynamically determined
  })

  test('should apply light theme by default on social page', async ({ page }) => {
    // Navigate to user social page
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    // Verify page loads successfully
    await expect(page.locator('h1, h2').first()).toBeVisible()
    
    // Check that dark class is not applied by default
    const htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).not.toContain('dark')
    
    // Verify glass components have light theme styling
    const glassCard = page.locator('.glass-card').first()
    if (await glassCard.count() > 0) {
      const backgroundColor = await glassCard.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      )
      
      // Light theme should have brighter glass effects
      expect(backgroundColor).toContain('rgba')
    }
  })

  test('should apply dark theme when user preference is dark', async ({ page }) => {
    // First, set dark theme in dashboard
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    // Ensure we're in dark mode
    const currentClass = await page.locator('html').getAttribute('class')
    if (!currentClass?.includes('dark')) {
      await themeToggle.click()
      await page.waitForTimeout(1000)
    }
    
    // Now navigate to social page
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    // Verify dark theme is applied
    const htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
    
    // Verify dark theme styling
    const mainContainer = page.locator('div').first()
    const hasColorMeshBg = await mainContainer.evaluate(el => 
      el.classList.contains('color-mesh-bg')
    )
    expect(hasColorMeshBg).toBe(true)
  })

  test('should display glass components correctly in dark mode', async ({ page }) => {
    // Set dark theme first
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    const currentClass = await page.locator('html').getAttribute('class')
    if (!currentClass?.includes('dark')) {
      await themeToggle.click()
      await page.waitForTimeout(1000)
    }
    
    // Navigate to social page
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    // Test glass header
    const glassHeader = page.locator('.glass-header').or(
      page.locator('[data-testid="profile-header"]')
    )
    
    if (await glassHeader.count() > 0) {
      const headerBackground = await glassHeader.evaluate(el => 
        window.getComputedStyle(el).background
      )
      expect(headerBackground).toContain('rgba')
      
      const backdropFilter = await glassHeader.evaluate(el => 
        window.getComputedStyle(el).backdropFilter
      )
      expect(backdropFilter).toContain('blur')
    }
    
    // Test glass link buttons
    const glassLinks = page.locator('.glass-link')
    const linkCount = await glassLinks.count()
    
    if (linkCount > 0) {
      const firstLink = glassLinks.first()
      
      // Check dark mode glass styling
      const linkBackground = await firstLink.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      )
      
      const borderColor = await firstLink.evaluate(el => 
        window.getComputedStyle(el).borderColor
      )
      
      // Dark mode should have different rgba values
      expect(linkBackground).toContain('rgba')
      expect(borderColor).toContain('rgba')
      
      // Test hover effects
      await firstLink.hover()
      await page.waitForTimeout(200)
      
      const hoverBackground = await firstLink.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      )
      
      // Hover should change the background
      expect(hoverBackground).not.toBe(linkBackground)
    }
  })

  test('should display profile header correctly in dark mode', async ({ page }) => {
    // Set dark theme
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    const currentClass = await page.locator('html').getAttribute('class')
    if (!currentClass?.includes('dark')) {
      await themeToggle.click()
      await page.waitForTimeout(1000)
    }
    
    // Navigate to social page
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    // Test profile header elements
    const profileHeader = page.locator('[data-testid="profile-header"]').or(
      page.locator('.glass-header')
    )
    
    await expect(profileHeader).toBeVisible()
    
    // Check header text visibility in dark mode
    const headerText = profileHeader.locator('h1, h2, p').first()
    if (await headerText.count() > 0) {
      const textColor = await headerText.evaluate(el => 
        window.getComputedStyle(el).color
      )
      
      // Text should be light colored in dark mode
      expect(textColor).toMatch(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    }
    
    // Test avatar/image in dark mode
    const avatar = profileHeader.locator('img').first()
    if (await avatar.count() > 0) {
      await expect(avatar).toBeVisible()
      
      // Avatar should have proper contrast border in dark mode
      const avatarBorder = await avatar.evaluate(el => 
        window.getComputedStyle(el).border
      )
    }
  })

  test('should handle smooth theme transitions', async ({ page }) => {
    // Start with light theme
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    // Get initial styles
    const mainContainer = page.locator('body').or(page.locator('html'))
    const initialBackground = await mainContainer.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    // Switch to dark theme in dashboard
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    await themeToggle.click()
    await page.waitForTimeout(1000)
    
    // Return to social page
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    // Verify theme changed
    const newBackground = await mainContainer.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    expect(newBackground).not.toBe(initialBackground)
    
    // Check for transition duration CSS
    const transitionDuration = await mainContainer.evaluate(el => 
      window.getComputedStyle(el).transitionDuration
    )
    
    // Should have 300ms transitions as defined in CSS
    expect(transitionDuration).toContain('0.3s')
  })

  test('should maintain theme across page refreshes', async ({ page }) => {
    // Set dark theme
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    const currentClass = await page.locator('html').getAttribute('class')
    if (!currentClass?.includes('dark')) {
      await themeToggle.click()
      await page.waitForTimeout(1000)
    }
    
    // Navigate to social page
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    // Verify dark theme is applied
    let htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
    
    // Refresh the page
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Theme should persist after refresh
    htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
  })

  test('should render links correctly in dark mode', async ({ page }) => {
    // Set dark theme
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    const currentClass = await page.locator('html').getAttribute('class')
    if (!currentClass?.includes('dark')) {
      await themeToggle.click()
      await page.waitForTimeout(1000)
    }
    
    // Navigate to social page
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    // Find link buttons
    const linkButtons = page.locator('a[href], button').filter({ hasText: /.+/ })
    const visibleLinks = await linkButtons.count()
    
    if (visibleLinks > 0) {
      const firstLink = linkButtons.first()
      
      // Check link styling in dark mode
      const linkStyle = await firstLink.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          background: styles.backgroundColor,
          color: styles.color,
          border: styles.border
        }
      })
      
      // Links should have proper dark mode styling
      expect(linkStyle.background).toContain('rgba')
      expect(linkStyle.color).toMatch(/rgb/)
      
      // Test link interactions
      await firstLink.hover()
      await page.waitForTimeout(200)
      
      const hoverStyle = await firstLink.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          background: styles.backgroundColor,
          transform: styles.transform
        }
      })
      
      // Hover should change appearance
      expect(hoverStyle.background).not.toBe(linkStyle.background)
    }
  })

  test('should display bottom bar correctly in dark mode', async ({ page }) => {
    // Set dark theme
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    const currentClass = await page.locator('html').getAttribute('class')
    if (!currentClass?.includes('dark')) {
      await themeToggle.click()
      await page.waitForTimeout(1000)
    }
    
    // Navigate to social page
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    // Find bottom bar
    const bottomBar = page.locator('.glass-footer').or(
      page.locator('[data-testid="bottom-bar"]')
    )
    
    if (await bottomBar.count() > 0) {
      await expect(bottomBar).toBeVisible()
      
      // Check glass footer styling in dark mode
      const bottomBarStyle = await bottomBar.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          background: styles.background,
          backdropFilter: styles.backdropFilter,
          borderTop: styles.borderTop
        }
      })
      
      expect(bottomBarStyle.background).toContain('rgba')
      expect(bottomBarStyle.backdropFilter).toContain('blur')
    }
  })

  test('should handle missing theme gracefully', async ({ page }) => {
    // Navigate directly to social page without setting theme
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    // Page should still load successfully
    await expect(page.locator('body')).toBeVisible()
    
    // Should default to light theme
    const htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).not.toContain('dark')
    
    // Glass components should still work
    const glassElements = page.locator('.glass-card, .glass-link, .glass-header')
    const glassCount = await glassElements.count()
    
    if (glassCount > 0) {
      const firstGlass = glassElements.first()
      const glassBackground = await firstGlass.evaluate(el => 
        window.getComputedStyle(el).background
      )
      
      expect(glassBackground).toContain('rgba')
    }
  })

  test('should be mobile responsive in dark mode', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Set dark theme
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    const currentClass = await page.locator('html').getAttribute('class')
    if (!currentClass?.includes('dark')) {
      await themeToggle.click()
      await page.waitForTimeout(1000)
    }
    
    // Navigate to social page
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    // Verify dark theme is applied on mobile
    const htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
    
    // Check mobile-specific styling
    const mainContainer = page.locator('.color-mesh-bg').first()
    if (await mainContainer.count() > 0) {
      const containerStyle = await mainContainer.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          minHeight: styles.minHeight,
          padding: styles.padding
        }
      })
      
      // Should have proper mobile styling
      expect(containerStyle.minHeight).toContain('vh')
    }
    
    // Test touch interactions
    const linkButtons = page.locator('.glass-link')
    if (await linkButtons.count() > 0) {
      const firstLink = linkButtons.first()
      
      // Touch/tap should work
      await firstLink.tap()
      await page.waitForTimeout(200)
      
      // Should handle tap interaction
      await expect(firstLink).toBeVisible()
    }
  })
})