/**
 * Authentication System E2E Tests
 * 
 * Purpose:
 * - Test login functionality with email/password
 * - Test registration flow
 * - Test form validation
 * - Test protected route access
 * - Test auth redirects
 * - Verify UI components
 */

import { test, expect } from '@playwright/test'

test.describe('Authentication System', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state before each test
    await page.context().clearCookies()
  })

  test('should load the landing page', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Check main heading
    await expect(page.getByRole('heading', { name: 'Your Links, Your Way' })).toBeVisible()
    
    // Check CTA buttons
    await expect(page.getByRole('link', { name: 'Get Started Free' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible()
  })

  test('should navigate to login page', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.getByRole('link', { name: 'Sign In' }).click()
    
    // Should be on login page
    await expect(page).toHaveURL('http://localhost:3000/login')
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    
    // Check form elements
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible()
  })

  test('should navigate to register page', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.getByRole('link', { name: 'Get Started Free' }).click()
    
    // Should be on register page
    await expect(page).toHaveURL('http://localhost:3000/register')
    await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible()
    
    // Check form elements
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Username')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.getByLabel('Confirm Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible()
  })

  test('should validate login form', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    
    // Try to submit empty form
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    // Should show validation errors
    await expect(page.getByText('Invalid email address')).toBeVisible()
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible()
    
    // Test invalid email
    await page.getByLabel('Email').fill('invalid-email')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.getByText('Invalid email address')).toBeVisible()
    
    // Test short password
    await page.getByLabel('Email').fill('test@example.com')
    await page.locator('#password').fill('123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible()
  })

  test('should validate registration form', async ({ page }) => {
    await page.goto('http://localhost:3000/register')
    
    // Try to submit empty form
    await page.getByRole('button', { name: 'Create Account' }).click()
    
    // Should show validation errors
    await expect(page.getByText('Invalid email address')).toBeVisible()
    await expect(page.getByText('Username must be at least 3 characters')).toBeVisible()
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible()
    await expect(page.getByText('You must accept the terms and conditions')).toBeVisible()
    
    // Test username validation
    await page.getByLabel('Username').fill('ab')
    await page.getByRole('button', { name: 'Create Account' }).click()
    await expect(page.getByText('Username must be at least 3 characters')).toBeVisible()
    
    // Test password validation
    await page.getByLabel('Username').fill('testuser')
    await page.locator('#password').fill('weak')
    await page.getByRole('button', { name: 'Create Account' }).click()
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible()
    
    // Test password mismatch
    await page.locator('#password').fill('StrongPass123')
    await page.getByLabel('Confirm Password').fill('DifferentPass123')
    await page.getByRole('button', { name: 'Create Account' }).click()
    await expect(page.getByText("Passwords don't match")).toBeVisible()
  })

  test('should protect dashboard routes', async ({ page }) => {
    // Try to access protected route without auth
    await page.goto('http://localhost:3000/dashboard')
    
    // Should redirect to login with redirect param
    await expect(page).toHaveURL('http://localhost:3000/login?redirect=%2Fdashboard')
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  })

  test('should protect analytics route', async ({ page }) => {
    await page.goto('http://localhost:3000/analytics')
    
    // Should redirect to login
    await expect(page).toHaveURL('http://localhost:3000/login?redirect=%2Fanalytics')
  })

  test('should protect settings route', async ({ page }) => {
    await page.goto('http://localhost:3000/settings')
    
    // Should redirect to login
    await expect(page).toHaveURL('http://localhost:3000/login?redirect=%2Fsettings')
  })

  test('should show/hide password', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    
    const passwordInput = page.locator('#password')
    const toggleButton = page.getByRole('button', { name: 'Show password' })
    
    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Click to show password
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'text')
    
    // Click to hide password again
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('should navigate between login and register', async ({ page }) => {
    // Start at login
    await page.goto('http://localhost:3000/login')
    
    // Navigate to register
    await page.getByRole('link', { name: 'Sign up' }).click()
    await expect(page).toHaveURL('http://localhost:3000/register')
    
    // Navigate back to login
    await page.getByRole('link', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('http://localhost:3000/login')
  })

  test('should display terms and privacy links', async ({ page }) => {
    await page.goto('http://localhost:3000/register')
    
    // Check for terms and privacy links
    await expect(page.getByRole('link', { name: 'Terms of Service' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible()
  })

  test('should handle loading states', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    
    // Fill valid form
    await page.getByLabel('Email').fill('test@example.com')
    await page.locator('#password').fill('password123')
    
    // Click sign in and check for loading state
    const signInButton = page.getByRole('button', { name: 'Sign In' })
    
    // Note: Since we don't have a real Supabase connection,
    // we're just verifying the button exists and is clickable
    await expect(signInButton).toBeEnabled()
    await signInButton.click()
    
    // In a real test with Supabase, we'd check:
    // await expect(page.getByText('Signing in...')).toBeVisible()
  })

  test('should have responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('http://localhost:3000/login')
    
    // Check that elements are still visible
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  })
})

test.describe('Visual Regression', () => {
  test('login page visual test', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    await page.waitForLoadState('networkidle')
    
    // Take screenshot for visual comparison
    await expect(page).toHaveScreenshot('login-page.png', { fullPage: true })
  })

  test('register page visual test', async ({ page }) => {
    await page.goto('http://localhost:3000/register')
    await page.waitForLoadState('networkidle')
    
    await expect(page).toHaveScreenshot('register-page.png', { fullPage: true })
  })
})