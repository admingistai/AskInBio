# Link Anything™ - System Architecture

## Overview

Link Anything™ is a modern link-in-bio platform built with a focus on performance, aesthetics, and user experience. The architecture leverages Next.js 15's App Router for optimal performance while maintaining a beautiful Apple-inspired glass morphism design system throughout.

## Technology Stack

### Core Technologies

#### Frontend
- **Next.js 15.4.4** - React meta-framework with App Router
  - Server Components for optimal performance
  - Server Actions for mutations
  - Streaming and Suspense for progressive enhancement
- **React 18** - UI library with concurrent features
- **TypeScript** - Type-safe development with strict mode
- **Tailwind CSS v3** - Utility-first styling
- **Framer Motion** - Advanced animations and transitions

#### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication (email + OAuth)
  - Real-time subscriptions
  - Row Level Security (RLS)
- **Prisma ORM** - Type-safe database client
  - Schema management
  - Migrations
  - Type generation

#### Infrastructure
- **Vercel** - Deployment platform (recommended)
- **Edge Runtime** - For optimal performance
- **CDN** - Static asset delivery

### Supporting Technologies
- **Playwright** - E2E testing framework
- **ESLint** - Code quality enforcement
- **Prettier** - Code formatting
- **Zustand** - Client state management

## Architecture Principles

### 1. **Server-First Approach**
- Leverage Server Components for data fetching
- Use Server Actions for mutations
- Minimize client bundle size
- Progressive enhancement

### 2. **Type Safety**
- End-to-end type safety with TypeScript
- Prisma for database type generation
- Zod for runtime validation
- Strict TypeScript configuration

### 3. **Performance Optimization**
- Static generation where possible
- Dynamic rendering for personalized content
- Edge caching strategies
- Optimized glass blur effects

### 4. **Security by Design**
- Authentication at the edge (middleware)
- Row Level Security in database
- Input validation and sanitization
- Rate limiting on sensitive operations

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
├─────────────────────────────────────────────────────────────┤
│                    Next.js App Router                       │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Static    │  │   Dynamic    │  │     API         │  │
│  │   Pages     │  │   Routes     │  │   Routes        │  │
│  └─────────────┘  └──────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                      Middleware                             │
│              (Auth, Redirects, Headers)                     │
├─────────────────────────────────────────────────────────────┤
│                   Server Actions                            │
│          (Mutations, Form Handling)                         │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                               │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Prisma    │  │   Supabase   │  │     Cache       │  │
│  │    ORM      │  │    Client    │  │   (Memory)      │  │
│  └─────────────┘  └──────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    External Services                        │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  Supabase   │  │   Google     │  │    Vercel       │  │
│  │  Database   │  │   OAuth      │  │   Analytics     │  │
│  └─────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
/app                    # Next.js App Router
├── (auth)             # Authentication group
│   ├── login          # Login page
│   ├── register       # Registration page
│   └── reset-password # Password reset flow
├── (dashboard)        # Protected dashboard
│   ├── dashboard      # Main dashboard
│   ├── analytics      # Analytics view
│   └── settings       # User settings
├── [username]         # Dynamic profile routes
├── actions/           # Server Actions
├── api/              # API routes
├── landingpagev1/    # Marketing page
└── page.tsx          # Root landing

/components            # React components
├── auth/             # Auth components
├── dashboard/        # Dashboard components
├── ui/              # Base UI components
└── *.tsx            # Feature components

/lib                  # Utilities
├── supabase/        # Supabase clients
├── db/              # Database utilities
├── hooks/           # Custom hooks
└── utils.ts         # Helpers

/prisma              # Database
├── schema.prisma    # Schema definition
└── seed.ts         # Seed data

/tests              # Test suites
└── *.spec.ts       # E2E tests
```

## Data Flow Architecture

### 1. **Authentication Flow**
```
User Login Request
    ↓
Middleware Check
    ↓
Server Action (auth.ts)
    ↓
Supabase Auth
    ↓
Session Creation
    ↓
Cookie Setting
    ↓
Redirect to Dashboard
```

### 2. **Profile Rendering Flow**
```
Username URL Access
    ↓
Server Component Fetch
    ↓
Prisma Query (with relations)
    ↓
Static Generation (ISR)
    ↓
Glass Component Rendering
    ↓
Client Hydration
```

### 3. **Link Click Tracking**
```
User Clicks Link
    ↓
Client-Side Handler
    ↓
Server Action Call
    ↓
Async Database Update
    ↓
Analytics Recording
    ↓
Redirect to Target
```

## Component Architecture

### Glass Design System Hierarchy
```
GlassCriticalStyles (CSS-in-JS)
    ↓
Layout Components
├── ProfileHeader (intense glass)
├── GlassBottomBar (navigation)
└── LinkButton (interactive glass)
    ↓
Feature Components
├── OnboardingFlow (morphing animations)
├── Dashboard (protected routes)
└── Analytics (data visualization)
```

### Component Patterns

#### 1. **Server Components (Default)**
- Data fetching at request time
- No client-side JavaScript
- SEO optimized
- Example: `app/[username]/page.tsx`

#### 2. **Client Components**
- Interactive features
- Browser APIs
- State management
- Example: `components/OnboardingFlow.tsx`

#### 3. **Server Actions**
- Form handling
- Database mutations
- Revalidation
- Example: `app/actions/auth.ts`

## Database Architecture

### Schema Design
```sql
-- Core Models
User (authentication + profile)
  ↓ 1:many
Link (user's links)
  ↓ 1:many
ClickEvent (analytics)
  ↑ many:1
Theme (customization)
```

### Key Design Decisions

1. **Separate Auth from Profile**
   - Supabase handles authentication
   - Prisma User model extends with profile data
   - Enables flexible auth providers

2. **Denormalized Click Counts**
   - Store click count on Link model
   - Async increment for performance
   - ClickEvent table for detailed analytics

3. **Theme Presets + Customization**
   - Enum for standard themes
   - JSON fields for custom values
   - CSS-in-JS for runtime theming

## Security Architecture

### Authentication Layers
1. **Edge Middleware** - Route protection
2. **Server Components** - Data access control
3. **Database RLS** - Row-level security
4. **API Rate Limiting** - Abuse prevention

### Security Measures
- CSRF protection via SameSite cookies
- Input validation with Zod
- SQL injection prevention (Prisma)
- XSS protection (React)
- Rate limiting (5/15min login)

## Performance Architecture

### Optimization Strategies

1. **Rendering Strategy**
   - Static: Marketing pages
   - Dynamic: Dashboard
   - ISR: Public profiles
   - Streaming: Complex pages

2. **Asset Optimization**
   - Next.js Image optimization
   - Font subsetting
   - CSS purging
   - JS code splitting

3. **Glass Effect Performance**
   ```css
   /* GPU-accelerated properties only */
   transform: translateZ(0);
   will-change: transform;
   backdrop-filter: blur(15px);
   ```

4. **Caching Strategy**
   - CDN: Static assets
   - Browser: Immutable resources
   - Server: Database queries
   - Edge: API responses

## Deployment Architecture

### Production Setup
```
Vercel (Recommended)
├── Edge Functions (middleware)
├── Serverless Functions (API)
├── Static Hosting (assets)
└── Image Optimization

Supabase Cloud
├── PostgreSQL Database
├── Authentication Service
├── Realtime Subscriptions
└── Storage (future)
```

### Environment Configuration
- Development: Local Supabase
- Staging: Supabase branch
- Production: Supabase main

## Monitoring & Observability

### Key Metrics
- Core Web Vitals (LCP, FID, CLS)
- Server response times
- Database query performance
- Error rates and types

### Monitoring Stack
- Vercel Analytics (performance)
- Supabase Dashboard (database)
- Playwright Reports (testing)
- Browser DevTools (development)

## Scalability Considerations

### Horizontal Scaling
- Stateless application design
- Database connection pooling
- CDN for global distribution
- Edge computing capabilities

### Vertical Scaling
- Supabase plan upgrades
- Vercel compute resources
- Database optimization
- Caching layer expansion

## Future Architecture Considerations

### Planned Enhancements
1. **Redis Cache Layer** - Session and data caching
2. **Queue System** - Background job processing
3. **Webhook Support** - Third-party integrations
4. **Mobile Apps** - React Native implementation
5. **GraphQL API** - Advanced querying

### Architecture Evolution
- Microservices consideration
- Event-driven architecture
- Real-time collaboration
- AI/ML integration points

---

*Last Updated: Current Session*
*Architecture Version: 1.0.0*