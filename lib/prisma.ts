/**
 * Prisma Client Instance
 * 
 * Purpose:
 * - Singleton instance of Prisma Client
 * - Prevents multiple instances in development
 * - Handles connection lifecycle
 * - Type-safe database access
 * 
 * Usage:
 * import { prisma } from '@/lib/prisma'
 * const users = await prisma.user.findMany()
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Ensure proper cleanup on hot reload
if (process.env.NODE_ENV === 'development') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}