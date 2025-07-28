# Google OAuth Configuration Guide

## 🚨 Issue: OAuth Redirecting to Localhost

The Google OAuth flow is redirecting to localhost instead of the production domain. This requires configuration updates in external systems.

## 🔧 Required Configuration Updates

### 1. Supabase OAuth Provider Configuration

**Steps:**
1. Login to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project → **Authentication** → **Providers**
3. Find **Google** provider and click **Edit**
4. In **Authorized redirect URLs**, ensure you have:
   ```
   https://askinbio-fsu9aic1r-pro-rata.vercel.app/api/auth/callback
   http://localhost:3000/api/auth/callback (for development)
   ```
5. Click **Save**

### 2. Google Cloud Console OAuth Client

**Steps:**
1. Login to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 client ID and click **Edit**
4. In **Authorized redirect URIs**, add:
   ```
   https://askinbio-fsu9aic1r-pro-rata.vercel.app/api/auth/callback
   ```
5. Keep existing localhost URI for development:
   ```
   http://localhost:3000/api/auth/callback
   ```
6. Click **Save**

### 3. Environment Variables

Ensure your production environment (Vercel) has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://askinbio-fsu9aic1r-pro-rata.vercel.app
```

## 🔍 Debugging OAuth Issues

The improved OAuth implementation now includes debug logging:

1. Check **Vercel Function Logs** for OAuth redirect URLs
2. Monitor **Browser Network Tab** for OAuth flow
3. Verify **Supabase Auth Logs** in dashboard

**Debug Log Examples:**
```
OAuth redirect URL: https://askinbio-fsu9aic1r-pro-rata.vercel.app/api/auth/callback
Redirecting to Google OAuth URL: https://accounts.google.com/oauth/authorize?...
OAuth callback received: { origin: "https://...", code: "present", ... }
```

## 🎯 Expected Flow

1. User clicks "Continue with Google"
2. Redirects to Google OAuth (accounts.google.com)
3. User authorizes application
4. Google redirects to: `https://askinbio-fsu9aic1r-pro-rata.vercel.app/api/auth/callback`
5. Callback exchanges code for session
6. User redirected to dashboard

## ⚠️ Common Issues

- **"redirect_uri_mismatch"**: OAuth client doesn't have production URL
- **"Invalid redirect URI"**: Supabase provider missing production URL  
- **"Origin header missing"**: Environment configuration issue

## 🧪 Testing

After configuration updates:
1. Clear browser cache/cookies
2. Test OAuth flow on production domain
3. Check Vercel function logs for any errors
4. Verify successful authentication and dashboard redirect

## 📝 Code Changes Made

### Enhanced OAuth Function (`app/actions/auth.ts`)
- Added fallback origin detection
- Improved error handling and logging
- Added offline access and consent prompt

### Enhanced Callback Handler (`app/api/auth/callback/route.ts`)
- Added comprehensive logging
- Better error messages
- Success confirmation logging

## 🎉 Next Steps

1. Update Supabase OAuth provider settings
2. Update Google Cloud Console OAuth client
3. Deploy code changes to production
4. Test OAuth flow
5. Monitor logs for successful authentication