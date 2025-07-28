#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function applyMigration() {
  try {
    console.log('Applying dark mode migration...');
    
    // Run the SQL command to add the column
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "themes" 
      ADD COLUMN IF NOT EXISTS "is_dark_mode" BOOLEAN NOT NULL DEFAULT false;
    `);
    
    console.log('✅ Migration successful! The is_dark_mode column has been added.');
    
    // Verify the column exists
    const result = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'themes'
      AND column_name = 'is_dark_mode';
    `);
    
    if (result.length > 0) {
      console.log('✅ Verified: Column exists with properties:', result[0]);
    }
    
  } catch (error) {
    if (error.code === 'P2010' && error.message.includes('already exists')) {
      console.log('✅ Column already exists - migration not needed.');
    } else {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

applyMigration();