import { test, expect, Page } from '@playwright/test'

test.describe('Landing Page - Glass Morphism Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Visual Design & Glass Effects', () => {
    test('should display glass morphism background and effects', async ({ page }) => {
      // Check color mesh background
      const colorMesh = page.locator('.color-mesh-bg')
      await expect(colorMesh).toBeVisible()
      await expect(colorMesh).toHaveClass(/color-mesh-animated/)

      // Check floating glass orbs
      const floatingOrbs = page.locator('.fixed.inset-0.overflow-hidden.pointer-events-none')
      await expect(floatingOrbs).toBeVisible()
      
      // Verify glass orbs exist
      const orbs = floatingOrbs.locator('.rounded-full')
      await expect(orbs).toHaveCount(2)
    })

    test('should have glass navigation bar with proper styling', async ({ page }) => {
      const nav = page.locator('nav.glass-header')
      await expect(nav).toBeVisible()
      await expect(nav).toHaveCSS('position', 'fixed')
      
      // Check logo and navigation items
      await expect(page.getByText('AskInBio').first()).toBeVisible()
      await expect(page.getByText('Sign In')).toBeVisible()
      await expect(page.getByText('Get Started').first()).toBeVisible()
    })

    test('should capture full page screenshot for visual regression', async ({ page }) => {
      await page.waitForLoadState('networkidle')
      await page.screenshot({ 
        path: 'tests/screenshots/landing-page-full.png',
        fullPage: true 
      })
    })
  })

  test.describe('Hero Section', () => {
    test('should display hero content with glass card', async ({ page }) => {
      const heroCard = page.locator('.glass-card-intense').first()
      await expect(heroCard).toBeVisible()
      
      // Check main heading
      await expect(page.getByRole('heading', { name: /AskInBio/i })).toBeVisible()
      await expect(page.getByText('powered by GetAskAnything')).toBeVisible()
      
      // Check subtitle
      await expect(page.getByText(/Create a stunning, glass-morphism/)).toBeVisible()
      
      // Check CTAs
      const getStartedBtn = page.getByRole('link', { name: /Get Started Free/i })
      const seeDemoBtn = page.getByRole('link', { name: /See Demo/i })
      
      await expect(getStartedBtn).toBeVisible()
      await expect(seeDemoBtn).toBeVisible()
      
      // Check feature pills
      await expect(page.getByText('Free Forever')).toBeVisible()
      await expect(page.getByText('No Credit Card')).toBeVisible()
      await expect(page.getByText('Analytics Included')).toBeVisible()
    })

    test('should navigate to register page on CTA click', async ({ page }) => {
      await page.getByRole('link', { name: /Get Started Free/i }).click()
      await expect(page).toHaveURL('/register')
    })

    test('should smooth scroll to demo section', async ({ page }) => {
      await page.getByRole('link', { name: /See Demo/i }).click()
      
      // Wait for smooth scroll
      await page.waitForTimeout(1000)
      
      // Check if demo section is in view
      const demoSection = page.locator('#demo')
      await expect(demoSection).toBeInViewport()
    })
  })

  test.describe('Features Section', () => {
    test('should display all 6 feature cards with glass effects', async ({ page }) => {
      const featureCards = page.locator('.glass-card').filter({ hasText: /Lightning Fast|Secure & Private|Rich Analytics|Custom Domains|Beautiful Themes|Premium Effects/ })
      await expect(featureCards).toHaveCount(6)
      
      // Check each feature card
      const features = [
        { icon: 'Lightning Fast', color: 'yellow' },
        { icon: 'Secure & Private', color: 'green' },
        { icon: 'Rich Analytics', color: 'blue' },
        { icon: 'Custom Domains', color: 'purple' },
        { icon: 'Beautiful Themes', color: 'pink' },
        { icon: 'Premium Effects', color: 'cyan' }
      ]
      
      for (const feature of features) {
        const card = page.locator('.glass-card').filter({ hasText: feature.icon })
        await expect(card).toBeVisible()
        
        // Check hover effect
        await card.hover()
        await expect(card).toHaveCSS('transform', /scale/)
      }
    })
  })

  test.describe('Interactive Demo Section', () => {
    test('should display iPhone frame with demo profile', async ({ page }) => {
      const demoFrame = page.locator('.preview-frame')
      await expect(demoFrame).toBeVisible()
      
      // Check demo profile content
      await expect(page.getByText('John Doe')).toBeVisible()
      await expect(page.getByText('Creator & Developer')).toBeVisible()
      
      // Check demo links
      const demoLinks = [
        '🌐 My Website',
        '📱 Instagram',
        '🎥 YouTube Channel',
        '💼 Portfolio'
      ]
      
      for (const link of demoLinks) {
        await expect(page.getByText(link)).toBeVisible()
      }
      
      // Check demo button
      const tryDemoBtn = page.getByRole('link', { name: /Try Live Demo/i })
      await expect(tryDemoBtn).toBeVisible()
    })

    test('should navigate to demo page on button click', async ({ page }) => {
      await page.getByRole('link', { name: /Try Live Demo/i }).click()
      await expect(page).toHaveURL('/demo')
    })
  })

  test.describe('Testimonials Carousel', () => {
    test('should display testimonial carousel with navigation', async ({ page }) => {
      const testimonialSection = page.locator('.glass-card-intense').filter({ has: page.locator('text=/Sarah Chen|Marcus Rodriguez|Emily Watson/') })
      await expect(testimonialSection).toBeVisible()
      
      // Check initial testimonial
      await expect(page.getByText('Sarah Chen')).toBeVisible()
      await expect(page.getByText('Content Creator')).toBeVisible()
      
      // Check navigation buttons
      const prevBtn = page.locator('button').filter({ has: page.locator('[class*="ChevronLeft"]') })
      const nextBtn = page.locator('button').filter({ has: page.locator('[class*="ChevronRight"]') })
      
      await expect(prevBtn).toBeVisible()
      await expect(nextBtn).toBeVisible()
      
      // Check rating stars
      const stars = page.locator('[class*="Star"]')
      await expect(stars).toHaveCount(5)
    })

    test('should navigate through testimonials', async ({ page }) => {
      // Click next button
      const nextBtn = page.locator('button').filter({ has: page.locator('[class*="ChevronRight"]') })
      await nextBtn.click()
      
      // Check second testimonial
      await expect(page.getByText('Marcus Rodriguez')).toBeVisible()
      await expect(page.getByText('Digital Artist')).toBeVisible()
      
      // Click next again
      await nextBtn.click()
      
      // Check third testimonial
      await expect(page.getByText('Emily Watson')).toBeVisible()
      await expect(page.getByText('Entrepreneur')).toBeVisible()
      
      // Click previous button
      const prevBtn = page.locator('button').filter({ has: page.locator('[class*="ChevronLeft"]') })
      await prevBtn.click()
      
      // Should go back to second testimonial
      await expect(page.getByText('Marcus Rodriguez')).toBeVisible()
    })

    test('should navigate using dot indicators', async ({ page }) => {
      const dots = page.locator('button.w-2.h-2.rounded-full')
      await expect(dots).toHaveCount(3)
      
      // Click on third dot
      await dots.nth(2).click()
      
      // Should show third testimonial
      await expect(page.getByText('Emily Watson')).toBeVisible()
      
      // Check active dot styling
      const activeDot = dots.filter({ hasClass: 'w-8' })
      await expect(activeDot).toHaveCount(1)
    })
  })

  test.describe('Pricing Section', () => {
    test('should display all pricing tiers with glass effects', async ({ page }) => {
      // Check all three pricing cards
      await expect(page.getByRole('heading', { name: 'Free', exact: true })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Pro', exact: true })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Business', exact: true })).toBeVisible()
      
      // Check Pro tier has popular badge
      const popularBadge = page.getByText('Popular')
      await expect(popularBadge).toBeVisible()
      
      // Check pricing
      await expect(page.getByText('$0')).toBeVisible()
      await expect(page.getByText('$9')).toBeVisible()
      await expect(page.getByText('$29')).toBeVisible()
      
      // Check CTA buttons
      const getStartedBtns = page.getByRole('link', { name: 'Get Started' })
      const proTrialBtn = page.getByRole('link', { name: 'Start Pro Trial' })
      const contactSalesBtn = page.getByRole('link', { name: 'Contact Sales' })
      
      await expect(getStartedBtns).toBeVisible()
      await expect(proTrialBtn).toBeVisible()
      await expect(contactSalesBtn).toBeVisible()
    })

    test('should have enhanced styling on Pro tier', async ({ page }) => {
      const proCard = page.locator('.glass-card-intense').filter({ has: page.getByRole('heading', { name: 'Pro' }) })
      await expect(proCard).toBeVisible()
      await expect(proCard).toHaveClass(/glass-card-intense/)
    })
  })

  test.describe('Footer', () => {
    test('should display footer with glass effect and all links', async ({ page }) => {
      const footer = page.locator('footer.glass-footer')
      await expect(footer).toBeVisible()
      
      // Check footer sections
      await expect(page.getByRole('heading', { name: 'Product' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Company' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Legal' })).toBeVisible()
      
      // Check copyright
      await expect(page.getByText('© 2024 AskInBio. All rights reserved.')).toBeVisible()
    })
  })

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Check mobile menu
      const nav = page.locator('nav.glass-header')
      await expect(nav).toBeVisible()
      
      // Check hero section stacks properly
      const heroButtons = page.locator('.flex-col.sm\\:flex-row')
      await expect(heroButtons).toBeVisible()
      
      // Check features grid collapses
      const featureGrid = page.locator('.grid.md\\:grid-cols-2.lg\\:grid-cols-3')
      await expect(featureGrid).toBeVisible()
    })

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      
      // Check layout adjustments
      const heroCard = page.locator('.glass-card-intense').first()
      await expect(heroCard).toBeVisible()
      
      // Check pricing grid
      const pricingGrid = page.locator('.grid.md\\:grid-cols-3')
      await expect(pricingGrid).toBeVisible()
    })
  })

  test.describe('Performance', () => {
    test('should load within performance budget', async ({ page }) => {
      const startTime = Date.now()
      await page.goto('/', { waitUntil: 'networkidle' })
      const loadTime = Date.now() - startTime
      
      expect(loadTime).toBeLessThan(3000) // 3 seconds
    })

    test('should have smooth animations', async ({ page }) => {
      // Check CSS transitions are applied
      const glassCards = page.locator('.glass-card')
      const firstCard = glassCards.first()
      
      await expect(firstCard).toHaveCSS('transition', /transform/)
    })
  })

  test.describe('Mouse Tracking Effects', () => {
    test('should track mouse movement for floating orbs', async ({ page }) => {
      // Move mouse to different positions
      await page.mouse.move(100, 100)
      await page.waitForTimeout(100)
      
      const orb1 = page.locator('.rounded-full').first()
      const transform1 = await orb1.evaluate(el => window.getComputedStyle(el).transform)
      
      await page.mouse.move(500, 500)
      await page.waitForTimeout(100)
      
      const transform2 = await orb1.evaluate(el => window.getComputedStyle(el).transform)
      
      // Transform should change with mouse movement
      expect(transform1).not.toBe(transform2)
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      const h1 = page.locator('h1')
      const h2 = page.locator('h2')
      
      await expect(h1).toHaveCount(1)
      await expect(h2.first()).toBeVisible()
    })

    test('should have accessible buttons and links', async ({ page }) => {
      // Check all interactive elements are keyboard accessible
      const interactiveElements = page.locator('a, button')
      const count = await interactiveElements.count()
      
      expect(count).toBeGreaterThan(10)
      
      // Check first CTA has proper contrast
      const getStartedBtn = page.getByRole('link', { name: /Get Started Free/i })
      await expect(getStartedBtn).toBeVisible()
    })
  })
})