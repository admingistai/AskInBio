# Link Anything™ - Developer Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Development Workflow](#development-workflow)
5. [Testing](#testing)
6. [Common Tasks](#common-tasks)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

## Getting Started

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** or **bun** package manager
- **Git** for version control
- **Supabase account** (free tier works)
- **Code editor** (VS Code recommended)

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd Ask_in_Bio

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Set up environment variables (see below)

# Run database migrations
npm run db:push

# Seed test data
npm run db:seed

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database URL (from Supabase dashboard)
DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true
DATABASE_URL_DIRECT=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-us-east-2.pooler.supabase.com:5432/postgres

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OAuth (optional for Google login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Getting Supabase Credentials

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY`
4. Go to Settings → Database
5. Copy the connection string → `DATABASE_URL`

⚠️ **Important**: Use the **Session Pooler** connection (port 6543) for `DATABASE_URL`

## Database Setup

### Initial Setup

1. **Push Prisma schema to database**:
   ```bash
   npm run db:push
   ```

2. **Generate Prisma client**:
   ```bash
   npm run db:generate
   ```

3. **Seed with test data**:
   ```bash
   npm run db:seed
   ```

4. **Open Prisma Studio** (database GUI):
   ```bash
   npm run db:studio
   ```

### Database Commands

```bash
# Push schema changes (development)
npm run db:push

# Create migration (production)
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Generate types
npm run db:generate

# Pull schema from database
npm run db:pull
```

### Schema Overview

The database includes these models:
- **User**: User profiles extending Supabase auth
- **Link**: User's bio links with click tracking
- **Theme**: Customizable themes for profiles
- **ClickEvent**: Analytics data for link clicks

## Development Workflow

### Starting Development

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **In another terminal, run tests**:
   ```bash
   npm run test:ui
   ```

3. **Open Prisma Studio**:
   ```bash
   npm run db:studio
   ```

### Project Structure

```
app/                    # Next.js App Router
├── (auth)/            # Auth pages (public)
├── (dashboard)/       # Dashboard (protected)
├── [username]/        # Public profiles
├── actions/           # Server actions
├── api/              # API routes
└── page.tsx          # Landing page

components/            # React components
├── auth/             # Auth forms
├── dashboard/        # Dashboard UI
├── ui/              # Base components
└── *.tsx            # Feature components

lib/                  # Utilities
├── supabase/        # Database clients
├── hooks/           # Custom hooks
└── utils.ts         # Helpers

tests/               # Test files
└── *.spec.ts       # E2E tests
```

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make your changes**

3. **Run tests**:
   ```bash
   npm run test
   ```

4. **Lint your code**:
   ```bash
   npm run lint
   ```

5. **Commit with semantic message**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### Code Style

- Use **TypeScript** for all new files
- Follow **ESLint** rules (auto-fixable)
- Use **Tailwind CSS** for styling
- Implement **glass morphism** for UI components

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in UI mode
npm run test:ui

# Run specific test file
npm run test tests/auth.spec.ts

# Run tests in debug mode
npm run test:debug

# View test report
npm run test:report
```

### Test Structure

- **E2E Tests**: Full user flows (`tests/*.spec.ts`)
- **Unit Tests**: Database operations (`tests/*.test.ts`)
- **Visual Tests**: Screenshot comparisons

### Writing Tests

Example test structure:
```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Link Anything/)
    // Add test steps
  })
})
```

## Common Tasks

### Adding a New Page

1. Create file in `app/` directory:
   ```tsx
   // app/new-page/page.tsx
   export default function NewPage() {
     return <div>New Page</div>
   }
   ```

2. Add navigation link if needed

3. Test the route at `/new-page`

### Creating a Component

1. Create component file:
   ```tsx
   // components/MyComponent.tsx
   'use client'  // Only if client-side features needed
   
   export default function MyComponent() {
     return <div className="glass-card">Content</div>
   }
   ```

2. Import and use in pages

### Adding Server Action

1. Create action file:
   ```typescript
   // app/actions/my-action.ts
   'use server'
   
   export async function myAction(data: FormData) {
     // Validate input
     // Perform database operation
     // Return result
   }
   ```

2. Use in client components

### Modifying Database Schema

1. Edit `prisma/schema.prisma`

2. Push changes:
   ```bash
   npm run db:push
   ```

3. Generate types:
   ```bash
   npm run db:generate
   ```

### Working with Glass Components

Use the glass utilities in `app/globals.css`:
```tsx
<div className="glass-card">
  <h2 className="text-white">Glass Card</h2>
</div>

<button className="glass-button">
  Click Me
</button>
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

#### Database Connection Failed
- Check `DATABASE_URL` uses port 6543 (pooler)
- Verify Supabase project is active
- Check network connection

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### Test Failures
- Ensure dev server is running
- Check for console errors
- View screenshots in test results

### Debug Mode

Enable debug logging:
```typescript
// Add to any file
console.log('DEBUG:', variable)

// Or use the debugger
debugger
```

### Getting Help

1. Check existing issues on GitHub
2. Search error messages
3. Ask in discussions
4. Create detailed bug report

## Best Practices

### Code Quality

1. **Type Safety**
   - Use TypeScript strictly
   - Define interfaces for data
   - Avoid `any` type

2. **Component Design**
   - Keep components small
   - Use composition
   - Extract reusable logic

3. **Performance**
   - Use Server Components by default
   - Lazy load heavy components
   - Optimize images

### Security

1. **Authentication**
   - Always check auth in middleware
   - Use Server Actions for mutations
   - Validate all inputs

2. **Data Access**
   - Use Prisma for queries
   - Never expose service keys
   - Implement proper RBAC

### Git Workflow

1. **Branching**
   - `main` - production ready
   - `develop` - integration branch
   - `feature/*` - new features
   - `fix/*` - bug fixes

2. **Commits**
   - Use semantic commit messages
   - Keep commits focused
   - Write clear descriptions

### Documentation

1. **Code Comments**
   - Document complex logic
   - Add JSDoc for functions
   - Explain "why" not "what"

2. **README Updates**
   - Document new features
   - Update setup steps
   - Add screenshots

## Advanced Topics

### Custom Themes

Create new theme preset:
```typescript
// In schema.prisma
enum ThemePreset {
  DEFAULT
  DARK
  NEON
  MINIMAL
  CUSTOM  // Add new
}
```

### Performance Optimization

1. **Use ISR for profiles**:
   ```typescript
   export const revalidate = 3600 // 1 hour
   ```

2. **Implement caching**:
   ```typescript
   import { unstable_cache } from 'next/cache'
   ```

3. **Optimize queries**:
   ```typescript
   // Include relations in single query
   const user = await prisma.user.findUnique({
     where: { username },
     include: { links: true, theme: true }
   })
   ```

### Deployment Preparation

1. Run production build:
   ```bash
   npm run build
   ```

2. Test production locally:
   ```bash
   npm run start
   ```

3. Check for errors:
   - No TypeScript errors
   - All tests pass
   - Environment vars set

---

*Happy coding! 🚀*
*Last Updated: Current Session*