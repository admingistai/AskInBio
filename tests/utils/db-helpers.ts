/**
 * Database Test Utilities
 * 
 * Purpose:
 * - Factory functions for test data
 * - Database cleanup utilities
 * - Common test assertions
 * - Mock data generators
 * 
 * Features:
 * - Consistent test data creation
 * - Automatic cleanup
 * - Type-safe assertions
 * - Realistic data generation
 */

import { PrismaClient, User, Link, Theme, ThemePreset } from '@prisma/client'
import { faker } from '@faker-js/faker'

// Create a separate Prisma instance for tests
export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_TEST_URL || process.env.DATABASE_URL,
    },
  },
})

// Test ID prefix for easy cleanup
const TEST_PREFIX = 'test_'

/**
 * Generate a test-safe ID
 */
export function generateTestId(type: string): string {
  return `${TEST_PREFIX}${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Factory function to create a test user
 */
export async function createTestUser(overrides?: Partial<User>) {
  const testId = generateTestId('user')
  
  const userData = {
    id: testId,
    username: `${TEST_PREFIX}${faker.internet.userName().toLowerCase()}`,
    displayName: faker.person.fullName(),
    bio: faker.person.bio(),
    avatar: faker.image.avatar(),
    ...overrides,
  }

  return testPrisma.user.create({
    data: userData,
  })
}

/**
 * Factory function to create a test link
 */
export async function createTestLink(userId: string, overrides?: Partial<Link>) {
  const linkData = {
    title: faker.company.name(),
    url: faker.internet.url(),
    thumbnail: Math.random() > 0.5 ? faker.image.url() : null,
    order: 0,
    active: true,
    userId,
    ...overrides,
  }

  return testPrisma.link.create({
    data: linkData,
  })
}

/**
 * Factory function to create a test theme
 */
export async function createTestTheme(userId: string, overrides?: Partial<Theme>) {
  const presets = Object.values(ThemePreset)
  
  const themeData = {
    name: faker.word.adjective() + ' Theme',
    preset: presets[Math.floor(Math.random() * presets.length)],
    primaryColor: faker.color.rgb(),
    backgroundColor: faker.color.rgb(),
    fontFamily: faker.helpers.arrayElement(['Inter', 'Roboto', 'Open Sans', 'Lato']),
    userId,
    ...overrides,
  }

  return testPrisma.theme.create({
    data: themeData,
  })
}

/**
 * Create multiple test links for a user
 */
export async function createTestLinks(userId: string, count: number) {
  const links = []
  
  for (let i = 0; i < count; i++) {
    const link = await createTestLink(userId, { order: i })
    links.push(link)
  }
  
  return links
}

/**
 * Clean up all test data
 */
export async function cleanupTestData() {
  // Simple cleanup - delete all test users which will cascade
  try {
    await testPrisma.user.deleteMany({
      where: {
        username: {
          startsWith: TEST_PREFIX,
        },
      },
    })
    console.log('✅ Test data cleanup completed')
  } catch (error) {
    console.log('ℹ️  Test cleanup skipped (no test data found)')
  }
}

/**
 * Clean up specific test user and all related data
 */
export async function cleanupTestUser(userId: string) {
  if (!userId.startsWith(TEST_PREFIX)) {
    throw new Error('Cannot cleanup non-test user')
  }

  await testPrisma.user.delete({
    where: { id: userId },
  })
}

/**
 * Reset database to clean state (for integration tests)
 */
export async function resetDatabase() {
  // This is a more aggressive cleanup - use with caution
  await testPrisma.clickEvent.deleteMany()
  await testPrisma.link.deleteMany()
  await testPrisma.theme.deleteMany()
  await testPrisma.user.deleteMany({
    where: {
      id: {
        startsWith: TEST_PREFIX,
      },
    },
  })
}

/**
 * Assertion: Check if user exists
 */
export async function assertUserExists(username: string): Promise<boolean> {
  const user = await testPrisma.user.findUnique({
    where: { username },
  })
  return !!user
}

/**
 * Assertion: Check link order
 */
export async function assertLinkOrder(userId: string, expectedTitles: string[]): Promise<boolean> {
  const links = await testPrisma.link.findMany({
    where: { userId },
    orderBy: { order: 'asc' },
  })

  const actualTitles = links.map(link => link.title)
  
  if (actualTitles.length !== expectedTitles.length) {
    return false
  }

  return expectedTitles.every((title, index) => title === actualTitles[index])
}

/**
 * Assertion: Check if link has expected click count
 */
export async function assertLinkClicks(linkId: string, expectedClicks: number): Promise<boolean> {
  const link = await testPrisma.link.findUnique({
    where: { id: linkId },
  })
  
  return link?.clicks === expectedClicks
}

/**
 * Generate click events for testing analytics
 */
export async function generateClickEvents(linkId: string, count: number) {
  const countries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'BR']
  const devices = ['desktop', 'mobile', 'tablet']
  
  for (let i = 0; i < count; i++) {
    await testPrisma.clickEvent.create({
      data: {
        linkId,
        country: faker.helpers.arrayElement(countries),
        device: faker.helpers.arrayElement(devices),
        clickedAt: faker.date.recent({ days: 30 }),
      },
    })
  }
}

/**
 * Wait for database operation to complete
 */
export async function waitForDb(ms: number = 100): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Get test user with all relations
 */
export async function getTestUserWithRelations(userId: string) {
  return testPrisma.user.findUnique({
    where: { id: userId },
    include: {
      links: {
        orderBy: { order: 'asc' },
      },
      themes: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

/**
 * Verify database connection
 */
export async function verifyDatabaseConnection(): Promise<boolean> {
  try {
    await testPrisma.$connect()
    await testPrisma.$disconnect()
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}