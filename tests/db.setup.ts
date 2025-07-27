/**
 * Database Test Setup
 * 
 * Purpose:
 * - Configure test database connection
 * - Set up test environment
 * - Handle test lifecycle
 * - Ensure test isolation
 * 
 * Features:
 * - Automatic database cleanup
 * - Test data seeding
 * - Transaction rollback
 * - Connection pooling
 */

import { test as base } from '@playwright/test'
import { 
  testPrisma, 
  cleanupTestData, 
  verifyDatabaseConnection,
  createTestUser,
  createTestLinks,
  createTestTheme
} from './utils/db-helpers'

// Extend base test with database fixtures
export const test = base.extend<{
  dbUser: Awaited<ReturnType<typeof createTestUser>>
  dbCleanup: () => Promise<void>
}>({
  // Create a test user for each test
  dbUser: async ({}, use) => {
    const user = await createTestUser()
    await use(user)
    // Cleanup is handled by dbCleanup fixture
  },

  // Cleanup function that runs after each test
  dbCleanup: async ({}, use) => {
    await use(async () => {
      await cleanupTestData()
    })
  },
})

// Export expect from Playwright
export { expect } from '@playwright/test'

// Global setup function
async function globalSetup() {
  console.log('🔧 Setting up test database...')
  
  // Verify database connection
  const isConnected = await verifyDatabaseConnection()
  if (!isConnected) {
    throw new Error('Failed to connect to test database')
  }

  // Clean up any leftover test data
  await cleanupTestData()
  
  console.log('✅ Test database ready')
  
  return async () => {
    console.log('🧹 Cleaning up test database...')
    await cleanupTestData()
    await testPrisma.$disconnect()
  }
}

// Global teardown function
export async function globalTeardown() {
  console.log('🔌 Disconnecting from test database...')
  await testPrisma.$disconnect()
}

// Helper to create a full test user with data
export async function createFullTestUser() {
  const user = await createTestUser()
  
  // Create some links
  const links = await createTestLinks(user.id, 5)
  
  // Create a theme
  const theme = await createTestTheme(user.id)
  
  return {
    user,
    links,
    theme,
  }
}

// Helper to seed database with multiple users
export async function seedTestDatabase(userCount: number = 3) {
  const users = []
  
  for (let i = 0; i < userCount; i++) {
    const userData = await createFullTestUser()
    users.push(userData)
  }
  
  return users
}

// Transaction helper for isolated tests
export async function withTransaction<T>(
  callback: (tx: typeof testPrisma) => Promise<T>
): Promise<T> {
  return testPrisma.$transaction(async (tx) => {
    const result = await callback(tx as typeof testPrisma)
    // Rollback by throwing an error
    throw new Error('ROLLBACK')
  }).catch((error) => {
    if (error.message === 'ROLLBACK') {
      return undefined as T
    }
    throw error
  })
}

// Helper to wait for async operations
export function waitFor(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Environment check
export function isTestEnvironment(): boolean {
  return process.env.NODE_ENV === 'test' || !!process.env.DATABASE_TEST_URL
}

// Database health check
export async function checkDatabaseHealth() {
  try {
    await testPrisma.$queryRaw`SELECT 1`
    return { healthy: true, message: 'Database is healthy' }
  } catch (error) {
    return { 
      healthy: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Export test helpers
export {
  createTestUser,
  createTestLink,
  createTestTheme,
  createTestLinks,
  cleanupTestData,
  cleanupTestUser,
  resetDatabase,
  assertUserExists,
  assertLinkOrder,
  assertLinkClicks,
  generateClickEvents,
  getTestUserWithRelations,
} from './utils/db-helpers'

// Default export for Playwright global setup
export default globalSetup