import { test, expect } from '@playwright/test'

test.describe('Onboarding Flow Visual Test', () => {
  test('manual visual test of onboarding flow', async ({ page }) => {
    // Navigate to the page
    await page.goto('/')
    
    // Wait for page to load
    await page.waitForTimeout(2000)
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'tests/screenshots/onboarding-1-initial.png', fullPage: true })
    
    // Click Get Started
    const getStartedButton = page.locator('text=Get Started').first()
    await getStartedButton.click()
    
    // Wait for morph animation
    await page.waitForTimeout(1000)
    
    // Take screenshot of phase 1
    await page.screenshot({ path: 'tests/screenshots/onboarding-2-phase1.png', fullPage: true })
    
    // Select a goal
    await page.locator('text=Boost General Engagement').click()
    
    // Wait for transition to phase 2
    await page.waitForTimeout(1000)
    
    // Take screenshot of phase 2
    await page.screenshot({ path: 'tests/screenshots/onboarding-3-phase2.png', fullPage: true })
    
    // Select a tone
    await page.locator('text=Engaging Explainer').click()
    await page.waitForTimeout(500)
    
    // Click Continue
    await page.locator('text=Continue').click()
    await page.waitForTimeout(1000)
    
    // Take screenshot of phase 3
    await page.screenshot({ path: 'tests/screenshots/onboarding-4-phase3.png', fullPage: true })
    
    // Complete setup
    await page.locator('text=Finish Setup').click()
    await page.waitForTimeout(1000)
    
    // Take screenshot of completed state
    await page.screenshot({ path: 'tests/screenshots/onboarding-5-completed.png', fullPage: true })
    
    console.log('Visual test completed. Check screenshots in tests/screenshots/')
  })
})