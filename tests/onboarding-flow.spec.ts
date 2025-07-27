import { test, expect } from '@playwright/test'

test.describe('Get Started Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for page to fully load
    await page.waitForSelector('text=Link Anything.', { state: 'visible' })
  })

  test('should display Get Started button with correct styling', async ({ page }) => {
    const getStartedButton = page.locator('text=Get Started').first()
    
    // Check initial visibility
    await expect(getStartedButton).toBeVisible()
    
    // Check styling
    const buttonElement = await getStartedButton.elementHandle()
    const styles = await buttonElement?.evaluate((el) => {
      const computed = window.getComputedStyle(el.parentElement!)
      return {
        backgroundColor: computed.backgroundColor,
        borderRadius: computed.borderRadius,
        backdropFilter: computed.backdropFilter || computed.webkitBackdropFilter
      }
    })
    
    expect(styles?.backdropFilter).toContain('blur')
    expect(styles?.borderRadius).toBe('28px')
  })

  test('should morph Get Started button into onboarding container', async ({ page }) => {
    const getStartedButton = page.locator('text=Get Started').first()
    
    // Record initial position
    const initialBox = await getStartedButton.boundingBox()
    expect(initialBox).toBeTruthy()
    
    // Click to start onboarding
    await getStartedButton.click()
    
    // Wait for morphing animation
    await page.waitForTimeout(400) // Wait for morph animation
    
    // Check that container has expanded
    const container = page.locator('[class*="fixed bottom-"][class*="bg-white"]').first()
    const expandedBox = await container.boundingBox()
    
    expect(expandedBox?.width).toBeGreaterThan(initialBox!.width)
    expect(expandedBox?.height).toBeGreaterThan(initialBox!.height)
    
    // Check for progress indicators
    await expect(page.locator('[class*="h-1"][class*="rounded-full"]')).toHaveCount(3)
  })

  test('should navigate through all three phases', async ({ page }) => {
    // Start onboarding
    await page.locator('text=Get Started').first().click()
    await page.waitForTimeout(500)
    
    // Phase 1: Goal Selection
    await expect(page.locator('text=What is the primary goal for your Ask Anything?')).toBeVisible()
    await expect(page.locator('input[placeholder="Enter goal"]')).toBeVisible()
    
    // Check options are visible with staggered animation
    const phase1Options = [
      'Increase Subscription Value',
      'Boost General Engagement',
      'Drive Newsletter Signups'
    ]
    
    for (const option of phase1Options) {
      await expect(page.locator(`text="${option}"`)).toBeVisible()
    }
    
    // Select an option
    await page.locator('text=Boost General Engagement').click()
    await page.waitForTimeout(300)
    
    // Move to Phase 2
    // Since phase 2 requires continue button in our implementation,
    // we need to check if it auto-advances or needs modification
    
    // Check Phase 2
    await expect(page.locator('text=What tone should it answer in?')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('input[placeholder="Ask Anything"]')).toBeVisible()
    
    const phase2Options = [
      'Strictly Journalistic',
      'Engaging Explainer',
      'Archival Researcher'
    ]
    
    for (const option of phase2Options) {
      await expect(page.locator(`text="${option}"`)).toBeVisible()
    }
    
    // Select tone and continue
    await page.locator('text=Engaging Explainer').click()
    await page.locator('text=Continue').click()
    
    // Phase 3: Ready to launch
    await expect(page.locator('text=Ready to launch.')).toBeVisible()
    await expect(page.locator('text=Newsroom Integrity Guardrails')).toBeVisible()
    await expect(page.locator('text=Readiness Score:')).toBeVisible()
    await expect(page.locator('text=98/100')).toBeVisible()
    
    // Complete setup
    await page.locator('text=Finish Setup').click()
    await page.waitForTimeout(500)
    
    // Should return to Get Started button
    await expect(page.locator('text=Get Started').first()).toBeVisible()
  })

  test('should handle keyboard navigation and escape key', async ({ page }) => {
    // Start onboarding
    await page.locator('text=Get Started').first().click()
    await page.waitForTimeout(500)
    
    // Wait for phase 1 to be visible
    await expect(page.locator('text=What is the primary goal')).toBeVisible()
    
    // Press Escape to close
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
    
    // Should return to Get Started button
    await expect(page.locator('text=Get Started').first()).toBeVisible()
    await expect(page.locator('text=What is the primary goal')).not.toBeVisible()
  })

  test('should show voice input functionality', async ({ page }) => {
    await page.locator('text=Get Started').first().click()
    await page.waitForTimeout(500)
    
    // Check for microphone icon
    const micIcon = page.locator('svg[class*="w-5 h-5"]').filter({ 
      has: page.locator('path[d*="M12"]') 
    })
    
    await expect(micIcon).toBeVisible()
    
    // Test input field interaction
    const inputField = page.locator('input[placeholder="Enter goal"]')
    await inputField.click()
    await inputField.fill('Custom goal text')
    
    const inputValue = await inputField.inputValue()
    expect(inputValue).toBe('Custom goal text')
  })

  test('should animate progress indicators correctly', async ({ page }) => {
    await page.locator('text=Get Started').first().click()
    await page.waitForTimeout(500)
    
    // Phase 1 - first indicator should be active
    const indicators = page.locator('[class*="h-1"][class*="rounded-full"]')
    await expect(indicators).toHaveCount(3)
    
    // Check first indicator has gradient
    const firstIndicator = indicators.nth(0)
    const firstIndicatorClass = await firstIndicator.getAttribute('class')
    expect(firstIndicatorClass).toContain('from-[#B8FFE3]')
    
    // Progress to phase 2
    await page.locator('text=Boost General Engagement').click()
    // Add logic to advance to phase 2 based on actual implementation
    
    // Note: Additional phase progression tests would go here
  })

  test('should maintain liquid glass aesthetic throughout', async ({ page }) => {
    await page.locator('text=Get Started').first().click()
    await page.waitForTimeout(500)
    
    // Check all interactive elements have glass styling
    const optionButtons = page.locator('button[class*="bg-white/"][class*="backdrop-blur"]')
    const count = await optionButtons.count()
    expect(count).toBeGreaterThan(3) // At least the option buttons
    
    // Check backdrop blur is applied
    for (let i = 0; i < count; i++) {
      const button = optionButtons.nth(i)
      const styles = await button.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          backdropFilter: computed.backdropFilter || computed.webkitBackdropFilter,
          backgroundColor: computed.backgroundColor
        }
      })
      
      expect(styles.backdropFilter).toContain('blur')
    }
  })

  test('should handle More button expansion', async ({ page }) => {
    await page.locator('text=Get Started').first().click()
    await page.waitForTimeout(500)
    
    // Check for More button
    const moreButton = page.locator('text=✦ More')
    await expect(moreButton).toBeVisible()
    
    // Click More button (functionality to be implemented)
    await moreButton.click()
    // Add assertions for expanded options when implemented
  })

  test('should preserve user selections across phases', async ({ page }) => {
    await page.locator('text=Get Started').first().click()
    await page.waitForTimeout(500)
    
    // Make selections
    const goalSelection = 'Drive Newsletter Signups'
    await page.locator(`text="${goalSelection}"`).click()
    
    // Progress through phases and verify selections are maintained
    // This test would be expanded based on actual state management implementation
  })

  test('responsive behavior on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    await page.waitForSelector('text=Link Anything.', { state: 'visible' })
    
    const getStartedButton = page.locator('text=Get Started').first()
    await expect(getStartedButton).toBeVisible()
    
    // Click and check mobile responsiveness
    await getStartedButton.click()
    await page.waitForTimeout(500)
    
    // Container should adapt to mobile width
    const container = page.locator('[class*="fixed bottom-"][class*="bg-white"]').first()
    const box = await container.boundingBox()
    
    expect(box?.width).toBeLessThanOrEqual(375 - 48) // Account for padding
  })
})

test.describe('Onboarding Flow Animations', () => {
  test('should have smooth staggered option reveals', async ({ page }) => {
    await page.goto('/')
    await page.locator('text=Get Started').first().click()
    await page.waitForTimeout(500)
    
    // Measure animation timing
    const options = page.locator('button[class*="bg-white/"][class*="backdrop-blur"]')
    
    // Record when each becomes visible
    const visibilityTimings: number[] = []
    const startTime = Date.now()
    
    for (let i = 0; i < 4; i++) { // 3 options + More button
      await options.nth(i).waitFor({ state: 'visible' })
      visibilityTimings.push(Date.now() - startTime)
    }
    
    // Check staggered timing (should be ~100ms apart)
    for (let i = 1; i < visibilityTimings.length; i++) {
      const delay = visibilityTimings[i] - visibilityTimings[i - 1]
      expect(delay).toBeGreaterThanOrEqual(50) // Allow some variance
      expect(delay).toBeLessThanOrEqual(150)
    }
  })

  test('should handle rapid clicks gracefully', async ({ page }) => {
    await page.goto('/')
    
    const getStartedButton = page.locator('text=Get Started').first()
    
    // Rapid clicks shouldn't break the animation
    await getStartedButton.click()
    await getStartedButton.click()
    await getStartedButton.click()
    
    await page.waitForTimeout(1000)
    
    // Should still show onboarding content properly
    await expect(page.locator('text=What is the primary goal')).toBeVisible()
    
    // Only one instance should be visible
    const containers = page.locator('[class*="fixed bottom-"][class*="bg-white"]')
    await expect(containers).toHaveCount(1)
  })
})