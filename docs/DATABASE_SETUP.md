# Database Setup Guide

This guide will help you set up the database for AskInBio using Prisma and Supabase.

## Prerequisites

- Supabase account and project created
- Node.js and npm installed
- Environment variables configured

## Initial Setup

1. **Configure Environment Variables**
   
   Copy `.env.local.example` to `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-key
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

   Get the DATABASE_URL from Supabase:
   - Go to Settings > Database
   - Copy the Connection string (URI)

2. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

3. **Push Schema to Database**
   ```bash
   npm run db:push
   ```

   This will create all the tables defined in `prisma/schema.prisma`.

4. **Seed the Database** (Optional)
   ```bash
   npm run db:seed
   ```

   This will populate your database with test data including:
   - 2 test users (johndoe and demo)
   - Sample links
   - Theme configurations
   - Analytics data

## Database Schema

### Models

1. **User**
   - Extends Supabase auth.users
   - Fields: username, displayName, bio, avatar
   - Relations: links, themes

2. **Link**
   - User's links/buttons
   - Fields: title, url, thumbnail, clicks, order, active
   - Relations: user, clickEvents

3. **Theme**
   - Customization options
   - Fields: name, preset, colors, fontFamily
   - Presets: DEFAULT, DARK, NEON, MINIMAL

4. **ClickEvent**
   - Analytics tracking
   - Fields: linkId, clickedAt, country, device

## Available Scripts

- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:seed` - Seed database with test data
- `npm run db:studio` - Open Prisma Studio GUI

## Using Prisma Studio

Prisma Studio provides a GUI to view and edit your database:

```bash
npm run db:studio
```

This will open http://localhost:5555 where you can:
- View all tables and data
- Create, update, and delete records
- Test queries

## Database Utilities

We've created utility functions in `lib/db/index.ts`:

```typescript
import { getUserByUsername, createLink, trackClick } from '@/lib/db'

// Get user profile
const user = await getUserByUsername('johndoe')

// Create a new link
const link = await createLink({
  userId: user.id,
  title: 'My Website',
  url: 'https://example.com'
})

// Track click analytics
await trackClick(link.id, {
  country: 'US',
  device: 'mobile'
})
```

## Troubleshooting

1. **Connection Issues**
   - Verify DATABASE_URL is correct
   - Check Supabase project is running
   - Ensure IP is whitelisted in Supabase

2. **Migration Errors**
   - Run `npx prisma migrate reset` to reset database
   - Check for conflicting table names

3. **Type Errors**
   - Run `npm run db:generate` after schema changes
   - Restart TypeScript server in your IDE

## Next Steps

1. Connect authentication flow to create users
2. Implement link management UI
3. Add theme customization
4. Set up analytics dashboard