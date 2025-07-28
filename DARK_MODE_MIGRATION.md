# Dark Mode Migration Instructions

## Issue
The application is expecting a `is_dark_mode` column in the `themes` table, but it doesn't exist in the database yet.

## Solution

### Option 1: Using Prisma CLI (Recommended)
Try running the migration with a longer timeout:

```bash
npx prisma db push --accept-data-loss
```

If this times out, try:

```bash
npx prisma migrate deploy
```

### Option 2: Manual SQL Migration
If the Prisma commands time out, you can run the SQL migration manually:

1. Connect to your Supabase database:
   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Run the following SQL command:

```sql
-- Add is_dark_mode column to themes table
ALTER TABLE "themes" 
ADD COLUMN IF NOT EXISTS "is_dark_mode" BOOLEAN NOT NULL DEFAULT false;
```

### Option 3: Using Supabase CLI
If you have the Supabase CLI installed:

```bash
supabase db push < prisma/migrations/manual_add_dark_mode.sql
```

## Temporary Fix Applied
The code has been temporarily modified to handle the missing column gracefully:

1. The dashboard page now fetches user data without including themes in the relation
2. Theme data is fetched separately with error handling
3. If the isDarkMode field is missing, it defaults to `false`

## After Migration
Once the migration is applied successfully:

1. The temporary code fixes will continue to work
2. Dark mode functionality will be fully operational
3. You can test by clicking the theme toggle in the dashboard

## Testing
After applying the migration, test the dark mode feature:

1. Go to `/dashboard`
2. Click the sun/moon toggle in the top right
3. The preview should update to show dark mode
4. Navigate to your public profile to see the dark theme applied