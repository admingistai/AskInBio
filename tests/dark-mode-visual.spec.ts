import { test, expect } from '@playwright/test'

test.describe('Dark Mode Visual Styling and Transitions', () => {
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
    
    testUsername = 'testuser'
  })

  test('should have smooth 300ms theme transitions', async ({ page }) => {
    // Get initial theme state
    const currentClass = await page.locator('html').getAttribute('class')
    const initiallyDark = currentClass?.includes('dark') || false
    
    // Check transition properties on elements
    const transitionElements = page.locator('*').filter({ hasText: /.+/ }).first()
    
    const transitionStyle = await transitionElements.evaluate(el => {
      const styles = window.getComputedStyle(el)
      return {
        transitionDuration: styles.transitionDuration,
        transitionProperty: styles.transitionProperty,
        transitionTimingFunction: styles.transitionTimingFunction
      }
    })
    
    // Should have 300ms transitions as defined in CSS
    expect(transitionStyle.transitionDuration).toContain('0.3s')
    expect(transitionStyle.transitionProperty).toContain('background-color')
    expect(transitionStyle.transitionTimingFunction).toContain('ease')
    
    // Toggle theme and measure transition
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    const startTime = Date.now()
    await themeToggle.click()
    
    // Wait for transition to complete
    await page.waitForTimeout(400)
    
    // Verify theme changed
    const newClass = await page.locator('html').getAttribute('class')
    const nowDark = newClass?.includes('dark') || false
    expect(nowDark).toBe(!initiallyDark)
  })

  test('should display correct glass pill styling in both themes', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    // Test light theme glass pill
    const lightStyles = await themeToggle.evaluate(el => {
      const styles = window.getComputedStyle(el)
      return {
        background: styles.background,
        backdropFilter: styles.backdropFilter,
        borderRadius: styles.borderRadius,
        border: styles.border
      }
    })
    
    expect(lightStyles.background).toContain('rgba')
    expect(lightStyles.backdropFilter).toContain('blur(10px)')
    expect(lightStyles.borderRadius).toContain('9999px')
    expect(lightStyles.border).toContain('rgba')
    
    // Toggle to dark theme
    await themeToggle.click()
    await page.waitForTimeout(500)
    
    // Test dark theme glass pill
    const darkStyles = await themeToggle.evaluate(el => {
      const styles = window.getComputedStyle(el)
      return {
        background: styles.background,
        backdropFilter: styles.backdropFilter,
        borderRadius: styles.borderRadius,
        border: styles.border
      }
    })
    
    expect(darkStyles.background).toContain('rgba')
    expect(darkStyles.backdropFilter).toContain('blur(10px)')
    expect(darkStyles.borderRadius).toContain('9999px')
    
    // Dark theme should have different rgba values
    expect(darkStyles.background).not.toBe(lightStyles.background)
    expect(darkStyles.border).not.toBe(lightStyles.border)
  })

  test('should animate sun/moon icons correctly', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    const sunIcon = page.locator('[data-lucide="sun"]')
    const moonIcon = page.locator('[data-lucide="moon"]')
    
    // Get initial icon states
    const initialSunVisible = await sunIcon.isVisible()
    const initialMoonVisible = await moonIcon.isVisible()
    
    // One icon should be visible initially
    expect(initialSunVisible || initialMoonVisible).toBe(true)
    
    // Check icon transition properties
    if (initialSunVisible) {
      const sunTransition = await sunIcon.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          transition: styles.transition,
          opacity: styles.opacity,
          transform: styles.transform
        }
      })
      
      expect(sunTransition.transition).toContain('0.3s')
      expect(sunTransition.opacity).toBe('1')
    }
    
    // Toggle theme
    await themeToggle.click()
    await page.waitForTimeout(500)
    
    // Icons should have swapped
    const finalSunVisible = await sunIcon.isVisible()
    const finalMoonVisible = await moonIcon.isVisible()
    
    expect(finalSunVisible).toBe(!initialSunVisible)
    expect(finalMoonVisible).toBe(!initialMoonVisible)
    
    // Check rotation and scale animations
    if (finalMoonVisible) {
      const moonStyles = await moonIcon.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          opacity: styles.opacity,
          transform: styles.transform
        }
      })
      
      expect(moonStyles.opacity).toBe('1')
    }
  })

  test('should display toggle indicator animation', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button').filter({ hasText: /dark|light/i })
    )
    
    await expect(themeToggle).toBeVisible()
    
    // Find toggle indicator (slider thumb)
    const toggleIndicator = themeToggle.locator('div').filter(el => 
      el.evaluate(node => {
        const styles = window.getComputedStyle(node)
        return styles.borderRadius.includes('9999px') && 
               styles.background.includes('rgba(255, 255, 255')
      })
    )
    
    if (await toggleIndicator.count() > 0) {
      // Get initial position
      const initialTransform = await toggleIndicator.first().evaluate(el => 
        window.getComputedStyle(el).transform
      )
      
      // Toggle theme
      await themeToggle.click()
      await page.waitForTimeout(400)
      
      // Position should change
      const finalTransform = await toggleIndicator.first().evaluate(el => 
        window.getComputedStyle(el).transform
      )
      
      expect(finalTransform).not.toBe(initialTransform)
      
      // Should have smooth transition
      const transitionStyle = await toggleIndicator.first().evaluate(el => 
        window.getComputedStyle(el).transition
      )
      
      expect(transitionStyle).toContain('0.3s')
    }
  })

  test('should render color mesh backgrounds correctly', async ({ page }) => {
    // Test light theme first
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    const colorMeshBg = page.locator('.color-mesh-bg')
    await expect(colorMeshBg).toBeVisible()
    
    // Check light theme gradient
    const lightGradient = await colorMeshBg.evaluate(el => 
      window.getComputedStyle(el).background
    )
    
    expect(lightGradient).toContain('radial-gradient')
    expect(lightGradient).toContain('linear-gradient')
    
    // Switch to dark theme
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
    
    // Navigate back to social page
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    // Check dark theme gradient
    const darkColorMeshBg = page.locator('.color-mesh-bg')
    const darkGradient = await darkColorMeshBg.evaluate(el => 
      window.getComputedStyle(el).background
    )
    
    expect(darkGradient).toContain('radial-gradient')
    expect(darkGradient).toContain('linear-gradient')
    
    // Gradients should be different
    expect(darkGradient).not.toBe(lightGradient)
  })

  test('should animate mesh flow correctly', async ({ page }) => {
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    const colorMeshAnimated = page.locator('.color-mesh-animated')
    
    if (await colorMeshAnimated.count() > 0) {
      // Check for animation properties
      const animationStyle = await colorMeshAnimated.evaluate(el => {
        const pseudoEl = window.getComputedStyle(el, '::before')
        return {
          animation: pseudoEl.animation,
          content: pseudoEl.content
        }
      })
      
      expect(animationStyle.animation).toContain('mesh-flow')
      expect(animationStyle.animation).toContain('20s')
    }
  })

  test('should display glass components with proper styling', async ({ page }) => {
    // Test dashboard glass components
    const dashboardPanels = page.locator('.dashboard-panel')
    
    if (await dashboardPanels.count() > 0) {
      const panelStyles = await dashboardPanels.first().evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          background: styles.background,
          backdropFilter: styles.backdropFilter,
          border: styles.border,
          borderRadius: styles.borderRadius,
          boxShadow: styles.boxShadow
        }
      })
      
      expect(panelStyles.background).toContain('rgba')
      expect(panelStyles.backdropFilter).toContain('blur(15px)')
      expect(panelStyles.border).toContain('rgba')
      expect(panelStyles.borderRadius).toContain('1rem')
      expect(panelStyles.boxShadow).toContain('rgba')
    }
    
    // Test glass cards
    const glassCards = page.locator('.glass-card')
    
    if (await glassCards.count() > 0) {
      const cardStyles = await glassCards.first().evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          background: styles.background,
          backdropFilter: styles.backdropFilter,
          boxShadow: styles.boxShadow
        }
      })
      
      expect(cardStyles.background).toContain('rgba')
      expect(cardStyles.backdropFilter).toContain('blur')
      expect(cardStyles.boxShadow).toContain('rgba')
    }
  })

  test('should show hover effects on glass components', async ({ page }) => {
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    const glassLinks = page.locator('.glass-link')
    
    if (await glassLinks.count() > 0) {
      const firstLink = glassLinks.first()
      
      // Get initial styles
      const initialStyles = await firstLink.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          background: styles.background,
          transform: styles.transform,
          boxShadow: styles.boxShadow
        }
      })
      
      // Hover over the link
      await firstLink.hover()
      await page.waitForTimeout(300)
      
      // Get hover styles
      const hoverStyles = await firstLink.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          background: styles.background,
          transform: styles.transform,
          boxShadow: styles.boxShadow
        }
      })
      
      // Styles should change on hover
      expect(hoverStyles.background).not.toBe(initialStyles.background)
      expect(hoverStyles.transform).toContain('scale')
      expect(hoverStyles.boxShadow).not.toBe(initialStyles.boxShadow)
    }
  })

  test('should support backdrop filter fallbacks', async ({ page }) => {
    // Test browser compatibility fallbacks
    const glassElements = page.locator('.glass-surface')
    
    if (await glassElements.count() > 0) {
      const fallbackTest = await glassElements.first().evaluate(el => {
        // Check if backdrop-filter is supported
        const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(20px)')
        
        const styles = window.getComputedStyle(el)
        return {
          supportsBackdropFilter,
          background: styles.background,
          backdropFilter: styles.backdropFilter
        }
      })
      
      if (fallbackTest.supportsBackdropFilter) {
        expect(fallbackTest.backdropFilter).toContain('blur')
      } else {
        // Should have solid background fallback
        expect(fallbackTest.background).toContain('rgba')
      }
    }
  })

  test('should maintain visual consistency across viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1920, height: 1080 }  // Desktop
    ]
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await page.goto(`/${testUsername}`)
      await page.waitForLoadState('networkidle')
      
      // Check glass components are properly styled at this viewport
      const glassCard = page.locator('.glass-card').first()
      
      if (await glassCard.count() > 0) {
        const styles = await glassCard.evaluate(el => {
          const computed = window.getComputedStyle(el)
          return {
            background: computed.background,
            backdropFilter: computed.backdropFilter,
            borderRadius: computed.borderRadius
          }
        })
        
        expect(styles.background).toContain('rgba')
        expect(styles.backdropFilter).toContain('blur')
        expect(styles.borderRadius).toBeTruthy()
      }
      
      // Check responsive design
      const mainContainer = page.locator('.color-mesh-bg')
      if (await mainContainer.count() > 0) {
        const containerStyles = await mainContainer.evaluate(el => {
          const computed = window.getComputedStyle(el)
          return {
            minHeight: computed.minHeight,
            backgroundAttachment: computed.backgroundAttachment
          }
        })
        
        expect(containerStyles.minHeight).toContain('vh')
      }
    }
  })

  test('should display correct text contrast in both themes', async ({ page }) => {
    // Test light theme contrast
    await page.goto(`/${testUsername}`)
    await page.waitForLoadState('networkidle')
    
    const textElements = page.locator('h1, h2, h3, p, span').filter({ hasText: /.+/ })
    
    if (await textElements.count() > 0) {
      const lightTextColor = await textElements.first().evaluate(el => 
        window.getComputedStyle(el).color
      )
      
      // Switch to dark theme
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
      
      await page.goto(`/${testUsername}`)
      await page.waitForLoadState('networkidle')
      
      const darkTextElements = page.locator('h1, h2, h3, p, span').filter({ hasText: /.+/ })
      
      if (await darkTextElements.count() > 0) {
        const darkTextColor = await darkTextElements.first().evaluate(el => 
          window.getComputedStyle(el).color
        )
        
        // Text colors should be different between themes
        expect(darkTextColor).not.toBe(lightTextColor)
        
        // Should have appropriate contrast (this is a simplified check)
        expect(darkTextColor).toMatch(/rgb\(\d+,\s*\d+,\s*\d+\)/)
      }
    }
  })

  test('should handle specular highlight effects', async ({ page }) => {
    const specularElements = page.locator('.specular-highlight')
    
    if (await specularElements.count() > 0) {
      const firstSpecular = specularElements.first()
      
      // Check for pseudo-element animation
      const pseudoStyles = await firstSpecular.evaluate(el => {
        const before = window.getComputedStyle(el, '::before')
        return {
          content: before.content,
          background: before.background,
          transition: before.transition,
          left: before.left
        }
      })
      
      expect(pseudoStyles.content).toBe('""')
      expect(pseudoStyles.background).toContain('linear-gradient')
      expect(pseudoStyles.transition).toContain('left')
      
      // Test hover animation
      await firstSpecular.hover()
      await page.waitForTimeout(100)
      
      const hoverPseudoStyles = await firstSpecular.evaluate(el => {
        const before = window.getComputedStyle(el, '::before')
        return {
          left: before.left
        }
      })
      
      // Left position should change on hover
      expect(hoverPseudoStyles.left).not.toBe(pseudoStyles.left)
    }
  })

  test('should render glass shimmer loading effects', async ({ page }) => {
    const shimmerElements = page.locator('.glass-shimmer-load')
    
    if (await shimmerElements.count() > 0) {
      const shimmerStyles = await shimmerElements.first().evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          background: styles.background,
          backgroundSize: styles.backgroundSize,
          animation: styles.animation
        }
      })
      
      expect(shimmerStyles.background).toContain('linear-gradient')
      expect(shimmerStyles.backgroundSize).toContain('200%')
      expect(shimmerStyles.animation).toContain('shimmer-load')
    }
  })

  test('should display glass glow animations', async ({ page }) => {
    const glowElements = page.locator('.glass-glow-subtle')
    
    if (await glowElements.count() > 0) {
      const glowStyles = await glowElements.first().evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          animation: styles.animation,
          boxShadow: styles.boxShadow
        }
      })
      
      expect(glowStyles.animation).toContain('glass-glow')
      expect(glowStyles.animation).toContain('4s')
      expect(glowStyles.boxShadow).toContain('rgba')
    }
  })
})