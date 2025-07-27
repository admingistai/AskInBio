/**
 * Basic Database Connection Test
 * 
 * Purpose:
 * - Test basic database connectivity
 * - Verify Prisma setup
 * - Simple connection validation
 */

import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

test.describe('Basic Database Tests', () => {
  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test('should connect to database', async () => {
    try {
      await prisma.$connect()
      const result = await prisma.$queryRaw`SELECT 1 as test`
      expect(result).toBeDefined()
      console.log('✅ Database connection successful')
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      throw error
    }
  })

  test('should have required tables', async () => {
    try {
      // Test if tables exist by querying them
      const userCount = await prisma.user.count()
      const linkCount = await prisma.link.count()
      const themeCount = await prisma.theme.count()
      const clickEventCount = await prisma.clickEvent.count()
      
      expect(typeof userCount).toBe('number')
      expect(typeof linkCount).toBe('number')
      expect(typeof themeCount).toBe('number')
      expect(typeof clickEventCount).toBe('number')
      
      console.log('✅ All required tables exist')
      console.log(`📊 Current data: ${userCount} users, ${linkCount} links, ${themeCount} themes, ${clickEventCount} clicks`)
    } catch (error) {
      console.error('❌ Database schema validation failed:', error)
      throw error
    }
  })
})