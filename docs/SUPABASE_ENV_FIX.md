# Supabase Connection Fix - Environment File Configuration

## Issue Identified

Multiple `.env` files causing configuration conflicts:
- `.env` - Used by Prisma CLI
- `.env.local` - Used by Next.js runtime
- `.env.local.direct` - Alternative connection string
- `.env.local.example` - Template file

## Root Cause

1. **Prisma** reads from `.env` file
2. **Next.js** reads from `.env.local` file
3. Different connection strings = connection failures

## Solution

### Option 1: Use Single Environment File (Recommended)

1. **Copy DATABASE_URL from .env.local to .env**:
   ```bash
   # Copy the working connection string
   echo "DATABASE_URL=postgresql://postgres.zakppynbragiympprdqb:O0pl1DJ5QksMoU4i@aws-0-us-east-2.pooler.supabase.com:5432/postgres?pgbouncer=true" > .env
   ```

2. **Remove duplicate env files**:
   ```bash
   # Backup first
   mv .env.local .env.local.backup
   mv .env.local.direct .env.local.direct.backup
   ```

3. **Consolidate all variables in .env**:
   ```bash
   # Add Next.js variables to .env
   cat >> .env << 'EOF'
   NEXT_PUBLIC_SUPABASE_URL=https://zakppynbragiympprdqb.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpha3BweW5icmFnaXltcHByZHFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NzIxOTYsImV4cCI6MjA2OTE0ODE5Nn0.IaHo3Q_oAIDFMDVuqIeMtKlFR4fbFSLjYP2jNFMPIRU
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpha3BweW5icmFnaXltcHByZHFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzU3MjE5NiwiZXhwIjoyMDY5MTQ4MTk2fQ.FhMoA1BFwcgQNAeFkHvdAuZe-cemz5ihvVpcH96uK9k
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   EOF
   ```

### Option 2: Keep Separate Files but Sync DATABASE_URL

If you need to keep separate files:

1. **Create a sync script**:
   ```bash
   # Create scripts/sync-env.js
   const fs = require('fs');
   const dotenv = require('dotenv');
   
   // Load .env.local
   const envLocal = dotenv.parse(fs.readFileSync('.env.local'));
   
   // Update .env with DATABASE_URL from .env.local
   let envContent = fs.readFileSync('.env', 'utf8');
   envContent = envContent.replace(
     /DATABASE_URL=.*/,
     `DATABASE_URL=${envLocal.DATABASE_URL}`
   );
   fs.writeFileSync('.env', envContent);
   ```

2. **Add to package.json**:
   ```json
   "scripts": {
     "sync-env": "node scripts/sync-env.js",
     "dev": "npm run sync-env && next dev",
     "db:push": "npm run sync-env && prisma db push"
   }
   ```

## Testing the Fix

1. **Test Prisma connection**:
   ```bash
   npx prisma db pull
   ```

2. **Test Next.js application**:
   ```bash
   npm run dev
   ```

3. **Verify with Prisma Studio**:
   ```bash
   npx prisma studio
   ```

## Connection String Formats

### Pooler Connection (Recommended for Apps)
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-2.pooler.supabase.com:5432/postgres?pgbouncer=true
```

### Direct Connection (For Migrations)
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

## Important Notes

1. **Project Reference**: Your project ref is `zakppynbragiympprdqb`
2. **Password**: Make sure to use the correct password from Supabase dashboard
3. **DNS Issues**: If `db.zakppynbragiympprdqb.supabase.co` doesn't resolve, your project might be paused or the reference might be incorrect
4. **Port**: Always use 5432 for standard connections (not 6543)

## Quick Fix Commands

```bash
# Option 1: Quick consolidation
cp .env.local .env

# Option 2: Just fix DATABASE_URL in .env
sed -i '' 's|DATABASE_URL=.*|DATABASE_URL=postgresql://postgres.zakppynbragiympprdqb:O0pl1DJ5QksMoU4i@aws-0-us-east-2.pooler.supabase.com:5432/postgres?pgbouncer=true|' .env

# Test connection
npx prisma db pull
```