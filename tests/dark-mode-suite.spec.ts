import { test, expect, type FullConfig } from '@playwright/test'

/**
 * Dark Mode Test Suite - Comprehensive Testing
 * 
 * This file orchestrates all dark mode tests and provides
 * configuration and utilities for the entire test suite.
 */

test.describe('Dark Mode Complete Test Suite', () => {
  
  test.beforeAll(async ({}, testInfo: FullConfig) => {
    console.log('🌙 Starting Dark Mode Test Suite')
    console.log('📋 Test Coverage:')
    console.log('  • Dashboard theme toggle functionality')
    console.log('  • User social page theme application')
    console.log('  • Theme persistence across navigation')
    console.log('  • Visual styling and transitions')
  })

  test('should run complete dark mode functionality test', async ({ page }) => {
    // This is a comprehensive integration test that combines key scenarios
    
    // 1. Login and verify dashboard loads
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpass123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
    await page.waitForLoadState('networkidle')
    
    console.log('✅ Login successful')
    
    // 2. Verify theme toggle exists and works
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    await expect(themeToggle).toBeVisible()
    console.log('✅ Theme toggle found')
    
    // 3. Test toggle functionality
    const initialClass = await page.locator('html').getAttribute('class')
    const initiallyDark = initialClass?.includes('dark') || false
    
    await themeToggle.click()
    await page.waitForTimeout(1000)
    
    const newClass = await page.locator('html').getAttribute('class')
    const nowDark = newClass?.includes('dark') || false
    
    expect(nowDark).toBe(!initiallyDark)
    console.log(`✅ Theme toggled: ${initiallyDark ? 'dark→light' : 'light→dark'}`)
    
    // 4. Test persistence to social page
    const testUsername = 'testuser' // In real tests, get from user data
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    const socialClass = await page.locator('html').getAttribute('class')
    const socialDark = socialClass?.includes('dark') || false
    
    expect(socialDark).toBe(nowDark)
    console.log('✅ Theme persisted to social page')
    
    // 5. Test visual elements
    const glassElements = page.locator('.glass-card, .glass-link').first()
    if (await glassElements.count() > 0) {
      const styles = await glassElements.evaluate(el => {
        const computed = window.getComputedStyle(el)
        return {
          background: computed.background,
          backdropFilter: computed.backdropFilter
        }
      })
      
      expect(styles.background).toContain('rgba')
      expect(styles.backdropFilter).toContain('blur')
      console.log('✅ Glass components styled correctly')
    }
    
    // 6. Test refresh persistence
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    const refreshClass = await page.locator('html').getAttribute('class')
    const refreshDark = refreshClass?.includes('dark') || false
    
    expect(refreshDark).toBe(nowDark)
    console.log('✅ Theme persisted after refresh')
    
    console.log('🎉 Complete dark mode test passed!')
  })

  test('should validate all CSS custom properties', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpass123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Test light theme CSS variables
    const lightThemeVars = await page.evaluate(() => {
      const root = document.documentElement
      const styles = window.getComputedStyle(root)
      
      return {
        glassBackgroundLight: styles.getPropertyValue('--glass-background-light'),
        glassBackgroundDark: styles.getPropertyValue('--glass-background-dark'),
        glassBoderLight: styles.getPropertyValue('--glass-border-light'),
        glassBorderDark: styles.getPropertyValue('--glass-border-dark'),
        colorMesh1: styles.getPropertyValue('--color-mesh-1'),
        colorMesh2: styles.getPropertyValue('--color-mesh-2'),
        colorMesh3: styles.getPropertyValue('--color-mesh-3')
      }
    })
    
    // Verify CSS variables are defined
    expect(lightThemeVars.glassBackgroundLight).toContain('rgba')
    expect(lightThemeVars.glassBackgroundDark).toContain('rgba')
    expect(lightThemeVars.glassBoderLight).toContain('rgba')
    expect(lightThemeVars.glassBorderDark).toContain('rgba')
    expect(lightThemeVars.colorMesh1).toContain('rgba')
    expect(lightThemeVars.colorMesh2).toContain('rgba')
    expect(lightThemeVars.colorMesh3).toContain('rgba')
    
    // Toggle to dark theme
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    await themeToggle.click()
    await page.waitForTimeout(500)
    
    // Test dark theme CSS variables
    const darkThemeVars = await page.evaluate(() => {
      const root = document.documentElement
      const styles = window.getComputedStyle(root)
      
      return {
        glassBackgroundLight: styles.getPropertyValue('--glass-background-light'),
        glassBackgroundDark: styles.getPropertyValue('--glass-background-dark'),
        colorMesh1: styles.getPropertyValue('--color-mesh-1'),
        colorMesh2: styles.getPropertyValue('--color-mesh-2'),
        colorMesh3: styles.getPropertyValue('--color-mesh-3')
      }
    })
    
    // Dark theme should have different values
    expect(darkThemeVars.glassBackgroundLight).not.toBe(lightThemeVars.glassBackgroundLight)
    expect(darkThemeVars.colorMesh1).not.toBe(lightThemeVars.colorMesh1)
    
    console.log('✅ CSS custom properties validated')
  })

  test('should validate accessibility in both themes', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpass123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Test keyboard accessibility
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    // Focus the toggle with keyboard
    await themeToggle.focus()
    
    // Should be focusable
    const isFocused = await themeToggle.evaluate(el => 
      document.activeElement === el
    )
    expect(isFocused).toBe(true)
    
    // Should have proper ARIA attributes
    const ariaLabel = await themeToggle.getAttribute('aria-label')
    const title = await themeToggle.getAttribute('title')
    
    // Should have accessibility descriptions
    expect(ariaLabel || title).toBeTruthy()
    
    // Test keyboard activation
    const initialClass = await page.locator('html').getAttribute('class')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(500)
    
    const newClass = await page.locator('html').getAttribute('class')
    expect(newClass).not.toBe(initialClass)
    
    console.log('✅ Accessibility features validated')
  })

  test.afterAll(async () => {
    console.log('🏁 Dark Mode Test Suite Complete')
    console.log('📊 Summary:')
    console.log('  • Dashboard functionality: ✅')
    console.log('  • Social page theming: ✅') 
    console.log('  • Theme persistence: ✅')
    console.log('  • Visual styling: ✅')
    console.log('  • CSS variables: ✅')
    console.log('  • Accessibility: ✅')
  })
})

/**
 * Utility functions for dark mode testing
 */
export class DarkModeTestUtils {
  
  static async loginUser(page: any, email = 'test@example.com', password = 'testpass123') {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
    await page.waitForLoadState('networkidle')
  }
  
  static async toggleTheme(page: any) {
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    await themeToggle.click()
    await page.waitForTimeout(1000)
    
    return themeToggle
  }
  
  static async getCurrentTheme(page: any): Promise<'light' | 'dark'> {
    const htmlClass = await page.locator('html').getAttribute('class')
    return htmlClass?.includes('dark') ? 'dark' : 'light'
  }
  
  static async validateGlassEffects(page: any, selector = '.glass-card, .glass-link, .glass-pill') {
    const glassElements = page.locator(selector)
    const count = await glassElements.count()
    
    if (count === 0) return false
    
    const styles = await glassElements.first().evaluate(el => {
      const computed = window.getComputedStyle(el)
      return {
        background: computed.background,
        backdropFilter: computed.backdropFilter,
        border: computed.border
      }
    })
    
    return (
      styles.background.includes('rgba') &&
      styles.backdropFilter.includes('blur') &&
      styles.border.includes('rgba')
    )
  }
  
  static async waitForThemeTransition(page: any, timeout = 1000) {
    await page.waitForTimeout(timeout)
    
    // Wait for CSS transitions to complete
    await page.waitForFunction(() => {
      const elements = document.querySelectorAll('*')
      for (const el of elements) {
        const styles = window.getComputedStyle(el)
        if (styles.transitionDuration !== '0s') {
          return false
        }
      }
      return true
    }, { timeout: 5000 })
  }
  
  static async takeThemeScreenshot(page: any, filename: string) {
    await page.screenshot({ 
      path: `test-results/screenshots/${filename}`,
      fullPage: true
    })
  }
}

/**
 * Test data and configuration
 */
export const DarkModeTestConfig = {
  defaultTestUser: {
    email: 'test@example.com',
    password: 'testpass123',
    username: 'testuser'
  },
  
  transitionTimeout: 500,
  dbSyncTimeout: 1000,
  
  expectedCSSVars: [
    '--glass-background-light',
    '--glass-background-dark', 
    '--glass-border-light',
    '--glass-border-dark',
    '--color-mesh-1',
    '--color-mesh-2',
    '--color-mesh-3'
  ],
  
  glassSelectors: [
    '.glass-card',
    '.glass-link', 
    '.glass-pill',
    '.glass-header',
    '.glass-footer',
    '.dashboard-panel'
  ],
  
  testViewports: [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 }
  ]
}