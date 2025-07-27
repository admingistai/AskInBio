# Link Anything™ - Deployment Guide

## Overview

This guide covers deploying Link Anything to production using Vercel (recommended) and alternative platforms. The application is optimized for serverless deployment with edge functions.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Vercel Deployment](#vercel-deployment)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [Custom Domain](#custom-domain)
6. [Post-Deployment](#post-deployment)
7. [Alternative Platforms](#alternative-platforms)
8. [Monitoring & Maintenance](#monitoring--maintenance)

## Pre-Deployment Checklist

### Code Preparation

- [ ] Run production build locally
  ```bash
  npm run build
  ```

- [ ] Fix any build errors or warnings

- [ ] Run all tests
  ```bash
  npm run test
  ```

- [ ] Update dependencies
  ```bash
  npm update
  npm audit fix
  ```

- [ ] Check TypeScript errors
  ```bash
  npx tsc --noEmit
  ```

- [ ] Lint code
  ```bash
  npm run lint
  ```

### Security Review

- [ ] Remove all console.logs from production code
- [ ] Ensure no secrets in codebase
- [ ] Check environment variable usage
- [ ] Review authentication flows
- [ ] Verify rate limiting is enabled

### Performance Check

- [ ] Test Lighthouse scores locally
- [ ] Optimize images and assets
- [ ] Check bundle sizes
- [ ] Verify lazy loading works

## Vercel Deployment

### Method 1: GitHub Integration (Recommended)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "chore: prepare for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add all required variables (see below)
   - Select appropriate environments

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Follow prompts**
   - Select project settings
   - Configure environment variables

## Environment Variables

### Required Variables

Set these in Vercel's dashboard under Settings → Environment Variables:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (Required)
DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true

# Application (Required)
NEXT_PUBLIC_APP_URL=https://your-domain.com

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cron Secret (Required for keep-alive)
CRON_SECRET=generate-random-secret-here
```

### Environment Configuration

Configure for different environments:

- **Production**: All variables
- **Preview**: Same as production (different Supabase project recommended)
- **Development**: Local values only

### Generating Secrets

```bash
# Generate CRON_SECRET
openssl rand -base64 32
```

## Database Setup

### Production Database

1. **Create Production Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project for production
   - Choose region closest to users

2. **Configure Database**
   ```bash
   # Push schema to production
   DATABASE_URL=your-prod-url npm run db:push
   
   # Run migrations if using
   DATABASE_URL=your-prod-url npm run db:migrate
   ```

3. **Enable Row Level Security**
   - Go to Authentication → Policies
   - Enable RLS on all tables
   - Add appropriate policies

4. **Set up Indexes**
   ```sql
   -- Improve query performance
   CREATE INDEX idx_links_user_id ON links(user_id);
   CREATE INDEX idx_links_username ON users(username);
   CREATE INDEX idx_clickevents_link_id ON click_events(link_id);
   ```

### Database Backups

1. **Enable Point-in-Time Recovery**
   - Supabase Dashboard → Settings → Database
   - Enable automatic backups

2. **Schedule Regular Backups**
   - Use Supabase's backup feature
   - Download backups periodically

## Custom Domain

### Adding Custom Domain to Vercel

1. **Add Domain**
   - Go to Project Settings → Domains
   - Add your domain: `linkany.bio`
   - Add www subdomain: `www.linkany.bio`

2. **Configure DNS**
   
   For root domain:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```
   
   For www:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **SSL Certificate**
   - Automatically provisioned by Vercel
   - Usually ready within minutes

### Update Environment

After domain is configured:
```env
NEXT_PUBLIC_APP_URL=https://linkany.bio
```

## Post-Deployment

### Verification Steps

1. **Test Critical Paths**
   - [ ] User registration
   - [ ] Login (email & OAuth)
   - [ ] Profile creation
   - [ ] Link management
   - [ ] Public profile viewing
   - [ ] Click tracking

2. **Check Performance**
   - Run Lighthouse audit
   - Test on slow 3G
   - Verify animations work
   - Check glass effects

3. **Monitor Logs**
   - Check Vercel Functions logs
   - Review Supabase logs
   - Set up error alerting

### Database Migrations

For schema changes after deployment:

1. **Create Migration**
   ```bash
   npm run db:migrate -- --name your_migration_name
   ```

2. **Test Locally**
   ```bash
   npm run db:migrate
   ```

3. **Apply to Production**
   ```bash
   DATABASE_URL=prod-url npm run db:migrate:deploy
   ```

### Keep-Alive Setup

Prevent Supabase from pausing:

1. **Set up External Cron**
   - Use cron-job.org or similar
   - Schedule every 5 minutes
   - URL: `https://your-domain.com/api/cron/keep-alive`
   - Headers: `Authorization: Bearer YOUR_CRON_SECRET`

2. **Verify Working**
   - Check Vercel logs
   - Monitor Supabase activity

## Alternative Platforms

### Netlify

1. **Build Settings**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **Environment Variables**
   - Add via Netlify UI
   - Same variables as Vercel

### Railway

1. **Deploy via GitHub**
   - Connect repository
   - Auto-deploys on push

2. **Configure**
   - Set Node version: 18
   - Add environment variables

### Self-Hosting

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Start Server**
   ```bash
   npm start
   ```

3. **Use Process Manager**
   ```bash
   npm install -g pm2
   pm2 start npm --name "linkany" -- start
   ```

4. **Nginx Configuration**
   ```nginx
   server {
     listen 80;
     server_name linkany.bio;
     
     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

## Monitoring & Maintenance

### Performance Monitoring

1. **Vercel Analytics**
   - Enable in project settings
   - Monitor Core Web Vitals
   - Track user experience

2. **Uptime Monitoring**
   - Use uptimerobot.com
   - Monitor critical endpoints
   - Set up alerts

### Error Tracking

1. **Browser Errors**
   ```tsx
   // app/layout.tsx
   if (process.env.NODE_ENV === 'production') {
     // Add error tracking service
   }
   ```

2. **Server Errors**
   - Check Vercel Functions logs
   - Set up log aggregation

### Security Updates

1. **Dependency Updates**
   ```bash
   # Check for updates
   npm outdated
   
   # Update dependencies
   npm update
   
   # Audit for vulnerabilities
   npm audit
   ```

2. **Security Headers**
   ```js
   // next.config.js
   module.exports = {
     async headers() {
       return [
         {
           source: '/:path*',
           headers: [
             {
               key: 'X-Frame-Options',
               value: 'DENY',
             },
             {
               key: 'X-Content-Type-Options',
               value: 'nosniff',
             },
             {
               key: 'X-XSS-Protection',
               value: '1; mode=block',
             },
           ],
         },
       ]
     },
   }
   ```

### Backup Strategy

1. **Database Backups**
   - Daily automatic backups (Supabase)
   - Weekly manual exports
   - Test restore process

2. **Code Backups**
   - Git repository (primary)
   - GitHub/GitLab mirrors
   - Local clones

## Scaling Considerations

### Performance Optimization

1. **Enable ISR**
   ```tsx
   // app/[username]/page.tsx
   export const revalidate = 3600 // 1 hour
   ```

2. **Edge Caching**
   - Vercel Edge Network
   - Static asset caching
   - API response caching

### Database Scaling

1. **Connection Pooling**
   - Use Supabase pooler
   - Limit concurrent connections

2. **Query Optimization**
   - Add indexes for common queries
   - Use database views
   - Implement caching

### Cost Management

1. **Monitor Usage**
   - Vercel dashboard
   - Supabase metrics
   - Set up billing alerts

2. **Optimize Resources**
   - Reduce function invocations
   - Optimize image delivery
   - Use efficient queries

## Rollback Procedures

### Code Rollback

1. **Via Vercel Dashboard**
   - Go to Deployments
   - Find previous working deployment
   - Click "Promote to Production"

2. **Via Git**
   ```bash
   git revert HEAD
   git push origin main
   ```

### Database Rollback

1. **Point-in-Time Recovery**
   - Supabase Dashboard → Database → Backups
   - Select recovery point
   - Restore to new database
   - Update connection string

2. **Manual Rollback**
   ```bash
   # Apply down migration
   npm run db:migrate:rollback
   ```

## Production Checklist

### Launch Day

- [ ] All tests passing
- [ ] Environment variables set
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Team access granted
- [ ] Documentation updated

### Post-Launch

- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify analytics working
- [ ] Test user flows
- [ ] Review security headers
- [ ] Update status page

---

*Last Updated: Current Session*
*Deployment Guide Version: 1.0.0*