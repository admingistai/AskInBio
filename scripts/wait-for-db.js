const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function waitForDatabase() {
  console.log('⏳ Waiting for database to come online...')
  console.log('Make sure you\'ve unpaused it in Supabase dashboard!')
  
  let attempts = 0
  const maxAttempts = 60 // Try for 5 minutes
  
  while (attempts < maxAttempts) {
    try {
      await prisma.$queryRaw`SELECT 1`
      console.log('\n✅ Database is now online!')
      console.log('You can now run: npm run dev')
      break
    } catch (error) {
      process.stdout.write('.')
      attempts++
      await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds
    }
  }
  
  if (attempts >= maxAttempts) {
    console.log('\n❌ Database still offline after 5 minutes.')
    console.log('Please check your Supabase dashboard.')
  }
  
  await prisma.$disconnect()
}

waitForDatabase()