# Supabase Connection Fix Guide

## Steps to Get Correct Connection String:

1. **Go to your Supabase Dashboard**
   - You're already there based on the screenshot

2. **Navigate to Settings → Database**
   - Click on the "Settings" icon in the left sidebar (gear icon)
   - Then click on "Database" in the settings menu

3. **Find Connection String Section**
   - Look for "Connection string" or "Connection info"
   - You'll see several options:
     - Connection pooling (Transaction mode)
     - Connection pooling (Session mode)
     - Direct connection

4. **Copy the Correct String**
   - Try the "Direct connection" string
   - Make sure to reveal and copy the password
   - The format should be: `postgresql://postgres.[project-ref]:[password]@db.[project-ref].supabase.co:5432/postgres`

5. **Update Your .env File**
   Replace the DATABASE_URL in `/Users/tjmcgovern/Ask_in_Bio/.env` with the copied string

## Alternative: Reset Database Password

If the connection string still doesn't work:

1. In Supabase Dashboard → Settings → Database
2. Look for "Database password" section
3. Click "Reset database password"
4. Generate a new password
5. Update your connection string with the new password

## Quick Test Command

After updating the connection string, test with:
```bash
npx prisma db pull
```

If successful, then:
```bash
npx prisma generate
npm run dev
```

## Common Issues:

1. **Wrong Password**: The password in your current connection string might be incorrect
2. **IP Restrictions**: Check if there are any IP allowlist restrictions in Supabase
3. **Project Region**: Make sure the region in the URL matches your project's region

Please follow these steps and update your connection string with the correct one from your Supabase dashboard!