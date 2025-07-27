import { defineConfig, devices } from '@playwright/test'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local' })

/**
 * Playwright Configuration
 * 
 * Purpose:
 * - Configure test runner settings
 * - Define browser contexts
 * - Set up test reporting
 * - Configure parallel execution
 * - Database test configuration
 */

export default defineConfig({
  testDir: './tests',
  /* Global setup and teardown for database tests */
  globalSetup: require.resolve('./tests/db.setup.ts'),
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Update snapshots instead of failing */
    ignoreSnapshots: true,
  },

  /* Configure projects for different test types */
  projects: [
    /* Database Unit Tests */
    {
      name: 'database',
      testMatch: /.*\.test\.ts$/,
      use: {},
    },

    /* Database Integration Tests */
    {
      name: 'database-integration',
      testMatch: /.*db-integration\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },

    /* Regular E2E Tests */
    {
      name: 'chromium',
      testMatch: /.*\.spec\.ts$/,
      testIgnore: [/.*db-integration\.spec\.ts$/],
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})