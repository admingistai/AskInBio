import { defineConfig, devices } from '@playwright/test'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local' })

/**
 * Minimal Playwright Configuration for Testing Database Connection
 * No global setup, just basic test runner
 */

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
  },
  projects: [
    {
      name: 'minimal-test',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 30 * 1000,
  },
})