const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Testing database connection...')
    const result = await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful!')
    console.log('Result:', result)
  } catch (error) {
    console.error('❌ Database connection failed:')
    console.error(error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()