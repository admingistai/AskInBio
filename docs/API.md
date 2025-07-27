# Link Anything™ - API Reference

## Overview

Link Anything uses Next.js Server Actions and API Routes for backend functionality. This document covers all available endpoints, server actions, and their usage.

## Table of Contents
1. [Server Actions](#server-actions)
2. [API Routes](#api-routes)
3. [Database Utilities](#database-utilities)
4. [Type Definitions](#type-definitions)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)

## Server Actions

Server Actions are the primary way to mutate data in Link Anything. They run on the server and can be called directly from client components.

### Authentication Actions (`app/actions/auth.ts`)

#### `login(formData: FormData)`
Authenticates a user with email and password.

**Parameters:**
- `email` (string): User's email address
- `password` (string): User's password

**Returns:**
```typescript
{ error?: string }
```

**Example:**
```typescript
import { login } from '@/app/actions/auth'

const formData = new FormData()
formData.append('email', 'user@example.com')
formData.append('password', 'password123')

const result = await login(formData)
if (result?.error) {
  console.error(result.error)
}
```

#### `signup(formData: FormData)`
Creates a new user account.

**Parameters:**
- `email` (string): User's email address
- `password` (string): User's password (min 6 characters)

**Returns:**
```typescript
{ error?: string }
```

**Rate Limit:** 3 attempts per 15 minutes

#### `signOut()`
Signs out the current user.

**Returns:** `void`

**Example:**
```typescript
import { signOut } from '@/app/actions/auth'
await signOut()
```

#### `resetPassword(email: string)`
Sends a password reset email.

**Parameters:**
- `email` (string): User's email address

**Returns:**
```typescript
{ error?: string, success?: boolean }
```

**Rate Limit:** 2 attempts per 15 minutes

### Link Management Actions (`app/actions/links.ts`)

#### `createLink(data: CreateLinkData)`
Creates a new link for the authenticated user.

**Parameters:**
```typescript
interface CreateLinkData {
  title: string
  url: string
  thumbnail?: string
}
```

**Returns:**
```typescript
{ 
  success: boolean
  link?: Link
  error?: string 
}
```

**Example:**
```typescript
import { createLink } from '@/app/actions/links'

const result = await createLink({
  title: 'My Website',
  url: 'https://example.com',
  thumbnail: 'https://example.com/image.png'
})
```

#### `updateLink(id: string, data: UpdateLinkData)`
Updates an existing link.

**Parameters:**
```typescript
interface UpdateLinkData {
  title?: string
  url?: string
  thumbnail?: string
  isActive?: boolean
  order?: number
}
```

**Returns:**
```typescript
{ 
  success: boolean
  link?: Link
  error?: string 
}
```

#### `deleteLink(id: string)`
Deletes a link.

**Parameters:**
- `id` (string): Link ID

**Returns:**
```typescript
{ 
  success: boolean
  error?: string 
}
```

#### `reorderLinks(linkIds: string[])`
Updates the order of multiple links.

**Parameters:**
- `linkIds` (string[]): Array of link IDs in new order

**Returns:**
```typescript
{ 
  success: boolean
  error?: string 
}
```

### Analytics Actions (`app/actions/track-click.ts`)

#### `trackClick(linkId: string, userId: string)`
Records a click event for analytics.

**Parameters:**
- `linkId` (string): ID of the clicked link
- `userId` (string): ID of the profile owner

**Returns:**
```typescript
{ 
  success: boolean
  error?: string 
}
```

**Note:** This action runs asynchronously and doesn't block the redirect.

## API Routes

### Authentication Routes

#### `GET /api/auth/callback`
Handles OAuth callback from providers (Google).

**Query Parameters:**
- `code` (string): OAuth authorization code
- `state` (string): CSRF protection state

**Response:**
- Redirects to dashboard on success
- Redirects to login with error on failure

#### `GET /api/auth/session`
Returns the current user session.

**Response:**
```typescript
{
  user: {
    id: string
    email: string
    username?: string
    displayName?: string
    avatarUrl?: string
  } | null
}
```

**Example:**
```javascript
const response = await fetch('/api/auth/session')
const { user } = await response.json()
```

### User Routes

#### `GET /api/user/profile`
Fetches the current user's complete profile.

**Response:**
```typescript
{
  user: {
    id: string
    email: string
    username: string
    displayName?: string
    bio?: string
    avatarUrl?: string
    links: Link[]
    theme?: Theme
    _count: {
      links: number
      clickEvents: number
    }
  }
}
```

#### `PUT /api/user/profile`
Updates the current user's profile.

**Body:**
```typescript
{
  username?: string
  displayName?: string
  bio?: string
  avatarUrl?: string
}
```

**Response:**
```typescript
{
  success: boolean
  user?: User
  error?: string
}
```

### Public Routes

#### `GET /[username]`
Public profile page (Server Component, not API).

**Renders:**
- User profile with links
- Custom theme
- SEO metadata

### Maintenance Routes

#### `GET /api/cron/keep-alive`
Keeps database connections alive (called by external cron).

**Headers Required:**
- `Authorization: Bearer ${CRON_SECRET}`

**Response:**
```typescript
{ status: 'ok', timestamp: string }
```

## Database Utilities

### Prisma Client (`lib/prisma.ts`)

Singleton instance of Prisma client:

```typescript
import { prisma } from '@/lib/prisma'

// Example query
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  include: { links: true }
})
```

### Database Helpers (`lib/db/index.ts`)

#### `getUserByEmail(email: string)`
Fetches a user by email address.

**Returns:** `User | null`

#### `getUserByUsername(username: string)`
Fetches a user by username.

**Returns:** `User | null`

#### `getPublicProfile(username: string)`
Fetches public profile data with active links.

**Returns:**
```typescript
{
  user: User & {
    links: Link[]
    theme: Theme | null
  }
} | null
```

#### `createUserProfile(userId: string, email: string)`
Creates initial user profile after authentication.

**Returns:** `User`

#### `incrementLinkClicks(linkId: string)`
Increments click count for a link.

**Returns:** `void` (async)

## Type Definitions

### Core Types (`types/index.ts`)

```typescript
// User type from Prisma
interface User {
  id: string
  email: string
  username: string
  displayName?: string | null
  bio?: string | null
  avatarUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

// Link type
interface Link {
  id: string
  userId: string
  title: string
  url: string
  thumbnail?: string | null
  clicks: number
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Theme type
interface Theme {
  id: string
  userId: string
  preset: ThemePreset
  primaryColor?: string | null
  backgroundColor?: string | null
  customCss?: string | null
  createdAt: Date
  updatedAt: Date
}

// Theme presets
enum ThemePreset {
  DEFAULT = 'DEFAULT',
  DARK = 'DARK',
  NEON = 'NEON',
  MINIMAL = 'MINIMAL'
}

// Click event for analytics
interface ClickEvent {
  id: string
  linkId: string
  userId: string
  country?: string | null
  device?: string | null
  createdAt: Date
}
```

### Form Types

```typescript
// Login form data
interface LoginFormData {
  email: string
  password: string
}

// Register form data
interface RegisterFormData {
  email: string
  password: string
}

// Link form data
interface LinkFormData {
  title: string
  url: string
  thumbnail?: string
}
```

## Error Handling

### Error Response Format

All actions and API routes return errors in a consistent format:

```typescript
{
  error: string,  // Human-readable error message
  code?: string   // Error code for specific handling
}
```

### Common Error Codes

- `RATE_LIMIT_EXCEEDED` - Too many attempts
- `INVALID_CREDENTIALS` - Wrong email/password
- `USER_EXISTS` - Email already registered
- `INVALID_TOKEN` - Session expired
- `NOT_FOUND` - Resource doesn't exist
- `FORBIDDEN` - Insufficient permissions
- `VALIDATION_ERROR` - Invalid input data

### Error Handling Example

```typescript
try {
  const result = await createLink(data)
  if (result.error) {
    switch (result.code) {
      case 'RATE_LIMIT_EXCEEDED':
        showError('Too many attempts. Please try again later.')
        break
      case 'VALIDATION_ERROR':
        showError('Please check your input.')
        break
      default:
        showError(result.error)
    }
  }
} catch (error) {
  showError('An unexpected error occurred')
}
```

## Rate Limiting

### Current Limits

| Action | Limit | Window |
|--------|-------|--------|
| Login | 5 attempts | 15 minutes |
| Signup | 3 attempts | 15 minutes |
| Password Reset | 2 attempts | 15 minutes |
| Link Creation | 30 links | 1 hour |
| API Calls | 100 requests | 1 minute |

### Rate Limit Headers

API responses include rate limit information:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Handling Rate Limits

```typescript
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After')
  await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
  // Retry request
}
```

## Authentication

### Session Management

Sessions are managed using Supabase Auth with JWT tokens stored in cookies.

```typescript
// Check authentication in Server Components
import { createServerSupabaseClient } from '@/lib/supabase/server'

const supabase = createServerSupabaseClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  redirect('/login')
}
```

### Middleware Protection

Routes are protected at the edge:

```typescript
// middleware.ts
export const config = {
  matcher: ['/dashboard/:path*', '/api/user/:path*']
}
```

## Best Practices

1. **Always validate input** on the server
2. **Use Server Actions** for mutations
3. **Handle errors gracefully** with user-friendly messages
4. **Implement proper rate limiting** for sensitive operations
5. **Log errors** for debugging (not sensitive data)
6. **Use TypeScript** for type safety
7. **Test API endpoints** with Playwright

## Examples

### Complete Link Creation Flow

```typescript
// In a Client Component
'use client'

import { useState } from 'react'
import { createLink } from '@/app/actions/links'

export function CreateLinkForm() {
  const [error, setError] = useState('')
  
  async function handleSubmit(formData: FormData) {
    const result = await createLink({
      title: formData.get('title') as string,
      url: formData.get('url') as string,
    })
    
    if (result.error) {
      setError(result.error)
    } else {
      // Success - redirect or update UI
      window.location.href = '/dashboard'
    }
  }
  
  return (
    <form action={handleSubmit}>
      <input name="title" required />
      <input name="url" type="url" required />
      {error && <p className="error">{error}</p>}
      <button type="submit">Create Link</button>
    </form>
  )
}
```

### Fetching User Profile

```typescript
// In a Server Component
import { getPublicProfile } from '@/lib/db'
import { notFound } from 'next/navigation'

export default async function ProfilePage({ 
  params 
}: { 
  params: { username: string } 
}) {
  const profile = await getPublicProfile(params.username)
  
  if (!profile) {
    notFound()
  }
  
  return (
    <div>
      <h1>{profile.displayName}</h1>
      <p>{profile.bio}</p>
      {profile.links.map(link => (
        <a key={link.id} href={link.url}>
          {link.title}
        </a>
      ))}
    </div>
  )
}
```

---

*Last Updated: Current Session*
*API Version: 1.0.0*