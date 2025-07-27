# Link Anything™

<div align="center">
  <img src="public/logo.png" alt="Link Anything Logo" width="120" />
  <h3>The AI companion that drives engagement, grows traffic, and unlocks new revenue</h3>
  <p>Create and install in 45 seconds • Free forever • Premium Apple-inspired design</p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
</div>

## ✨ Overview

Link Anything™ (formerly AskInBio) is a modern link-in-bio platform that combines beautiful Apple-inspired glass morphism design with powerful features. Built with Next.js 15 and featuring a stunning glass design system throughout.

### 🎯 Key Features

- 🔐 **Secure Authentication** - Email + Google OAuth with session management
- 🔗 **Custom URLs** - Personalized username-based profiles (`/yourname`)
- 📊 **Real-time Analytics** - Track clicks, engagement, and visitor insights
- 🎨 **Glass Morphism Design** - Premium Apple-inspired aesthetic throughout
- 📱 **Mobile First** - Responsive design optimized for all devices
- ⚡ **Lightning Fast** - Server-side rendering and edge optimization
- 🎭 **Customizable Themes** - Multiple presets + custom styling options
- 🚀 **45-Second Setup** - Quick onboarding with AI-powered assistance

## 🖼️ Screenshots

<div align="center">
  <img src="docs/images/landing.png" alt="Landing Page" width="800" />
  <p><em>Minimalist landing page with gradient text and glass effects</em></p>
  
  <img src="docs/images/onboarding.png" alt="Onboarding Flow" width="800" />
  <p><em>Smooth onboarding experience with morphing animations</em></p>
  
  <img src="docs/images/profile.png" alt="Public Profile" width="800" />
  <p><em>Beautiful public profiles with glass design</em></p>
</div>

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm or bun package manager
- Supabase account (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/link-anything.git
cd link-anything

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Set up your environment variables (see below)

# Push database schema
npm run db:push

# Seed with test data (optional)
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your app!

### Environment Setup

Create a `.env` file with these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database
DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-us-east-2.pooler.supabase.com:6543/postgres

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🏗️ Tech Stack

### Frontend
- **[Next.js 15.4.4](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** - Animations

### Backend
- **[Supabase](https://supabase.com/)** - Database & Authentication
- **[Prisma](https://www.prisma.io/)** - Type-safe ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Database

### Infrastructure
- **[Vercel](https://vercel.com/)** - Deployment platform
- **[Playwright](https://playwright.dev/)** - E2E testing

## 📁 Project Structure

```
link-anything/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard
│   ├── [username]/        # Public profiles
│   ├── actions/           # Server actions
│   ├── api/              # API routes
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── auth/             # Auth components
│   ├── dashboard/        # Dashboard UI
│   ├── ui/              # Base components
│   └── OnboardingFlow.tsx # Onboarding wizard
├── lib/                  # Utilities
│   ├── supabase/        # Database clients
│   └── hooks/           # Custom hooks
├── prisma/              # Database schema
├── tests/               # Test suites
└── docs/                # Documentation
```

## 🎨 Glass Design System

Our glass morphism design system features:

- **Subtle Transparency** - 5-8% opacity for authentic glass
- **Smooth Animations** - GPU-accelerated transitions
- **Specular Highlights** - Interactive hover effects
- **Gradient Accents** - Mint (#B8FFE3) to Purple (#C081FF)
- **Depth Layering** - Multiple glass layers for hierarchy

Learn more in our [Design System Documentation](docs/DESIGN_SYSTEM.md).

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in UI mode
npm run test:ui

# Run specific test
npm run test auth.spec.ts

# View test report
npm run test:report
```

## 📚 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md) - System design and decisions
- [Development Guide](docs/DEVELOPMENT.md) - Setup and workflow
- [API Reference](docs/API.md) - Endpoints and server actions
- [Design System](docs/DESIGN_SYSTEM.md) - Glass components and utilities
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/link-anything)

1. Click the button above
2. Connect your GitHub repository
3. Add environment variables
4. Deploy!

See our [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Lint code
npm run test         # Run tests
npm run db:push      # Push schema changes
npm run db:studio    # Open Prisma Studio
```

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please follow our commit convention:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Maintenance tasks

## 🤝 Community

- **Discussions** - [GitHub Discussions](https://github.com/yourusername/link-anything/discussions)
- **Issues** - [Report bugs](https://github.com/yourusername/link-anything/issues)
- **Twitter** - [@linkanything](https://twitter.com/linkanything)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspired by Apple's glass morphism aesthetic
- Built with amazing open source technologies
- Special thanks to all contributors

---

<div align="center">
  <p>Built with ❤️ by the Link Anything team</p>
  <p>
    <a href="https://linkany.bio">Website</a> •
    <a href="https://github.com/yourusername/link-anything">GitHub</a> •
    <a href="https://twitter.com/linkanything">Twitter</a>
  </p>
</div>