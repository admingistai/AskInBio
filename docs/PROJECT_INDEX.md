# Link Anything™ - Comprehensive Project Index

## Project Overview

**Link Anything™** (formerly AskInBio) is a premium link-in-bio platform featuring Apple Liquid Glass design throughout. The application allows users to create beautiful, customizable bio pages with powerful analytics, all wrapped in a stunning glassmorphism aesthetic.

### Key Features
- 🔐 **Authentication**: Email + Google OAuth with secure session management
- 🔗 **Custom URLs**: Personalized username-based profile pages
- 📊 **Analytics**: Real-time click tracking and engagement metrics
- 🎨 **Themes**: Customizable themes with glassmorphism design
- 📱 **Responsive**: Mobile-first design with iOS-style aesthetics
- ⚡ **Performance**: Optimized with Next.js 15 App Router

## Technology Stack

### Core Framework
- **Next.js 15.4.4**: React framework with App Router
- **React 18**: UI library with hooks and server components
- **TypeScript**: Type-safe development

### Styling & Design
- **Tailwind CSS v3**: Utility-first CSS framework
- **Framer Motion**: Advanced animations and transitions
- **Custom Glass Utilities**: Proprietary glassmorphism system

### Database & Backend
- **Supabase**: PostgreSQL database and authentication
- **Prisma ORM**: Type-safe database client
- **Server Actions**: Next.js server-side mutations

### Testing & Quality
- **Playwright**: E2E testing framework
- **ESLint**: Code quality and consistency
- **TypeScript Strict Mode**: Type safety enforcement

## Project Structure

```
/Users/tjmcgovern/Ask_in_Bio/
├── 📁 app/                     # Next.js App Router
│   ├── 📁 (auth)/             # Authentication pages
│   │   ├── 📄 login/          # Login page with OAuth
│   │   ├── 📄 register/       # Registration with validation
│   │   ├── 📄 forgot-password/# Password reset initiation
│   │   └── 📄 reset-password/ # Password reset completion
│   ├── 📁 (dashboard)/        # Protected dashboard routes
│   │   ├── 📄 dashboard/      # Main dashboard with link management
│   │   ├── 📄 analytics/      # Click analytics and insights
│   │   └── 📄 settings/       # Profile and theme settings
│   ├── 📁 [username]/         # Dynamic public profile pages
│   ├── 📁 actions/            # Server actions
│   │   ├── 📄 auth.ts         # Authentication actions
│   │   ├── 📄 links.ts        # Link CRUD operations
│   │   └── 📄 track-click.ts  # Analytics tracking
│   ├── 📁 api/                # API routes
│   │   ├── 📁 auth/           # Auth endpoints
│   │   ├── 📁 user/           # User management
│   │   └── 📁 cron/           # Scheduled tasks
│   ├── 📄 page.tsx            # New "Link Anything" landing
│   ├── 📄 landingpagev1/      # Original marketing page
│   └── 📄 layout.tsx          # Root layout with providers
│
├── 📁 components/             # React components
│   ├── 📁 auth/              # Authentication components
│   │   ├── 📄 LoginForm.tsx  # Email/password login
│   │   ├── 📄 RegisterForm.tsx# User registration
│   │   ├── 📄 GoogleButton.tsx# OAuth integration
│   │   └── 📄 ResetPasswordForm.tsx
│   ├── 📁 dashboard/         # Dashboard components
│   │   ├── 📄 LinkEditor.tsx # Link creation/editing
│   │   ├── 📄 LinkList.tsx   # Drag-and-drop link management
│   │   ├── 📄 PreviewPanel.tsx# Live profile preview
│   │   └── 📄 QuickStats.tsx # Analytics summary
│   ├── 📁 ui/                # Base UI components
│   │   ├── 📄 button.tsx     # Styled button component
│   │   ├── 📄 input.tsx      # Form input with validation
│   │   ├── 📄 card.tsx       # Glass card container
│   │   └── 📄 textarea.tsx   # Multi-line input
│   ├── 📄 OnboardingFlow.tsx # New user onboarding wizard
│   ├── 📄 ProfileHeader.tsx  # Public profile header
│   ├── 📄 LinkButton.tsx     # Clickable link component
│   └── 📄 GlassBottomBar.tsx # Profile footer navigation
│
├── 📁 lib/                   # Utilities and helpers
│   ├── 📁 supabase/         # Supabase clients
│   │   ├── 📄 client.ts     # Browser client
│   │   └── 📄 server.ts     # Server-side client
│   ├── 📁 db/               # Database utilities
│   ├── 📁 hooks/            # Custom React hooks
│   ├── 📄 prisma.ts         # Prisma client singleton
│   └── 📄 utils.ts          # General utilities
│
├── 📁 tests/                # Test suites
│   ├── 📄 onboarding-flow.spec.ts # Onboarding E2E tests
│   ├── 📄 landing-page.spec.ts    # Landing page tests
│   ├── 📄 auth.spec.ts            # Authentication flows
│   ├── 📄 public-profile.spec.ts  # Profile page tests
│   └── 📄 db.test.ts              # Database unit tests
│
├── 📁 docs/                 # Documentation
│   └── 📁 context/         # Project context files
│       ├── 📄 CURRENT.md   # Current project status
│       └── 📄 progress.md  # Development progress log
│
├── 📁 prisma/              # Database schema
│   ├── 📄 schema.prisma   # Database models
│   └── 📄 seed.ts         # Test data seeding
│
├── 📁 public/              # Static assets
│   └── 📄 ...             # Images, fonts, etc.
│
└── 📄 Configuration Files
    ├── 📄 next.config.js   # Next.js configuration
    ├── 📄 tailwind.config.ts # Tailwind + glass utilities
    ├── 📄 tsconfig.json    # TypeScript configuration
    ├── 📄 playwright.config.ts # Test configuration
    ├── 📄 package.json     # Dependencies and scripts
    └── 📄 .env.example     # Environment template
```

## Component Architecture

### Glass Design System Components

#### 1. **OnboardingFlow** (`/components/OnboardingFlow.tsx`)
- **Purpose**: Multi-phase user onboarding wizard
- **Features**: 
  - Morphing animation from button to full container
  - 3-phase flow: Goal → Tone → Setup Complete
  - Smooth transitions with Framer Motion
  - Centered positioning with viewport constraints
  - Links to registration on completion

#### 2. **ProfileHeader** (`/components/ProfileHeader.tsx`)
- **Purpose**: Display user info on public profiles
- **Features**: Avatar, name, bio, social links
- **Glass Style**: Intense glass with specular highlights

#### 3. **LinkButton** (`/components/LinkButton.tsx`)
- **Purpose**: Clickable link component for profiles
- **Features**: Click tracking, hover effects, custom thumbnails
- **Glass Style**: Subtle glass with hover animations

#### 4. **GlassBottomBar** (`/components/GlassBottomBar.tsx`)
- **Purpose**: Fixed footer navigation for profiles
- **Features**: Search, share functionality
- **Glass Style**: Blurred glass with iOS-style design

### Authentication Components

#### 1. **LoginForm** (`/components/auth/LoginForm.tsx`)
- Server action integration
- Rate limiting (5 attempts/15min)
- Accessibility compliant

#### 2. **RegisterForm** (`/components/auth/RegisterForm.tsx`)
- Email validation
- Password strength requirements
- Auto-profile creation

#### 3. **GoogleButton** (`/components/auth/GoogleButton.tsx`)
- OAuth flow integration
- Supabase Auth provider
- Session management

### Dashboard Components

#### 1. **LinkEditor** (`/components/dashboard/LinkEditor.tsx`)
- Create/edit links
- URL validation
- Thumbnail upload

#### 2. **LinkList** (`/components/dashboard/LinkList.tsx`)
- Drag-and-drop reordering
- Bulk operations
- Real-time updates

#### 3. **PreviewPanel** (`/components/dashboard/PreviewPanel.tsx`)
- Live profile preview
- Theme switching
- Mobile/desktop views

## Database Schema (Prisma)

### Models

#### User
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  username      String    @unique
  displayName   String?
  bio           String?
  avatarUrl     String?
  links         Link[]
  theme         Theme?
  clickEvents   ClickEvent[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

#### Link
```prisma
model Link {
  id          String   @id @default(uuid())
  userId      String
  title       String
  url         String
  thumbnail   String?
  clicks      Int      @default(0)
  order       Int
  isActive    Boolean  @default(true)
  user        User     @relation(...)
  clickEvents ClickEvent[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### Theme
```prisma
model Theme {
  id            String   @id @default(uuid())
  userId        String   @unique
  preset        ThemePreset @default(DEFAULT)
  primaryColor  String?
  background    String?
  customCss     String?
  user          User     @relation(...)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

#### ClickEvent
```prisma
model ClickEvent {
  id        String   @id @default(uuid())
  linkId    String
  userId    String
  country   String?
  device    String?
  link      Link     @relation(...)
  user      User     @relation(...)
  createdAt DateTime @default(now())
}
```

## API Routes

### Authentication
- `POST /api/auth/callback` - OAuth callback handler
- `GET /api/auth/session` - Session validation
- `POST /app/actions/auth` - Login/register actions

### User Management
- `GET /api/user/profile` - Fetch user profile
- `PUT /api/user/profile` - Update profile

### Link Operations
- `POST /app/actions/links` - Create/update/delete links
- `POST /app/actions/track-click` - Record click events

### Maintenance
- `GET /api/cron/keep-alive` - Database connection keeper

## Glass Design System

### CSS Utilities (`app/globals.css`)

#### Glass Components
```css
.glass-surface      # Base glass effect
.glass-card         # Standard glass card
.glass-card-intense # Enhanced glass emphasis
.glass-button       # Interactive glass buttons
.glass-header       # Navigation glass
.glass-footer       # Footer glass
.glass-badge        # Small info badges
```

#### Animations
```css
@keyframes float        # Vertical movement (6s)
@keyframes shimmer      # Gradient position
@keyframes pulse        # Opacity breathing
@keyframes gradientShift # Background rotation
```

#### Color System
- **Primary Gradient**: `#B8FFE3` → `#C081FF`
- **Glass Base**: `rgba(255,255,255,0.05)`
- **Backdrop Blur**: `blur(15px)`
- **Border**: `rgba(255,255,255,0.1)`

## Landing Pages

### 1. Root Landing (`/app/page.tsx`)
- **Purpose**: Minimalist entry point for new users
- **Design**: Left-aligned "Link Anything" branding
- **Features**:
  - Animated gradient text
  - Floating animations
  - Get Started button with onboarding flow
  - Mouse-tracked orbs

### 2. Marketing Landing (`/app/landingpagev1/page.tsx`)
- **Purpose**: Full marketing page with features
- **Sections**:
  - Hero with CTAs
  - 6-feature grid
  - Interactive iPhone demo
  - Testimonials carousel
  - 3-tier pricing
  - Glass footer

## Testing Strategy

### E2E Test Coverage
1. **Onboarding Flow** (`tests/onboarding-flow.spec.ts`)
   - Button morphing animation
   - 3-phase navigation
   - Form interactions
   - Completion flow

2. **Landing Pages** (`tests/landing-page.spec.ts`)
   - Glass effects rendering
   - Animation performance
   - Responsive behavior
   - Interactive elements

3. **Authentication** (`tests/auth.spec.ts`)
   - Login/register flows
   - OAuth integration
   - Password reset
   - Session management

4. **Public Profiles** (`tests/public-profile.spec.ts`)
   - Profile rendering
   - Link clicks
   - Theme application
   - SEO metadata

### Database Tests
- Schema validation
- CRUD operations
- Relationship integrity
- Performance benchmarks

## Performance Metrics

### Target Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Cumulative Layout Shift**: < 0.1
- **Animation FPS**: 60fps maintained

### Optimization Strategies
- Server-side rendering for profiles
- Lazy loading for dashboard
- GPU-accelerated animations
- Optimized glass blur effects
- Edge caching for static assets

## Development Workflow

### Local Development
```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run test         # Run all tests
npm run test:e2e     # E2E tests only
npm run lint         # Code quality check
```

### Database Management
```bash
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
npm run db:seed      # Seed test data
npm run db:studio    # Prisma Studio GUI
```

### Testing Commands
```bash
npm run test:ui      # Playwright UI mode
npm run test:debug   # Debug mode
npm run test:report  # View test report
```

## Environment Configuration

### Required Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=postgresql://...

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Recent Updates

### Onboarding Flow Improvements (Latest)
- Centered widget positioning
- Smoother animations with refined easing
- Finish Setup → Register page integration
- Viewport overflow handling
- Enhanced animation timing

### Landing Page Transformation
- "Ask Anything" → "Link Anything" rebrand
- Left-aligned layout implementation
- Gradient text effects
- Fixed bottom positioning for CTA

### Glass Design System
- Comprehensive glassmorphism utilities
- Performance-optimized blur effects
- Consistent design language
- Mobile-responsive components

## Future Roadmap

### Immediate Priorities
1. Complete theme customizer
2. Analytics dashboard with charts
3. Link management improvements
4. Mobile app development

### Planned Features
- Custom domains
- Team collaboration
- API access for Pro tier
- Advanced analytics export
- Webhook integrations

---

*Generated: Current Session*
*Status: Active Development*
*Version: 1.0.0*