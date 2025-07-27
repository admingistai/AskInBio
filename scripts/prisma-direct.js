#!/usr/bin/env node

/**
 * Workaround for Prisma connection issues with Supabase
 * This script temporarily uses a direct connection for Prisma operations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the command to run
const command = process.argv.slice(2).join(' ');
if (!command) {
  console.error('Usage: node scripts/prisma-direct.js <prisma command>');
  process.exit(1);
}

// Read current .env
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Try different connection approaches
const connectionStrings = [
  // Direct connection (if DNS works)
  'postgresql://postgres:O0pl1DJ5QksMoU4i@db.zakppynbragiympprdqb.supabase.co:5432/postgres',
  // Pooler without pgbouncer flag
  'postgresql://postgres.zakppynbragiympprdqb:O0pl1DJ5QksMoU4i@aws-0-us-east-2.pooler.supabase.com:6543/postgres',
  // Current connection
  'postgresql://postgres.zakppynbragiympprdqb:O0pl1DJ5QksMoU4i@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
];

let success = false;
let lastError = null;

for (const connStr of connectionStrings) {
  console.log(`Trying connection: ${connStr.replace(/:[^:@]+@/, ':****@')}`);
  
  // Create temporary env with this connection string
  const tempEnv = envContent.replace(/DATABASE_URL=.*/, `DATABASE_URL=${connStr}`);
  fs.writeFileSync(envPath, tempEnv);
  
  try {
    // Run the Prisma command
    execSync(`npx prisma ${command}`, { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: connStr }
    });
    success = true;
    console.log('✅ Command succeeded!');
    break;
  } catch (error) {
    lastError = error;
    console.log('❌ Failed with this connection, trying next...\n');
  }
}

// Restore original .env
fs.writeFileSync(envPath, envContent);

if (!success) {
  console.error('\n❌ All connection attempts failed.');
  console.error('Last error:', lastError?.message);
  process.exit(1);
}