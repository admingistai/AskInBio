# Vercel Deployment Guide for AskInBio

## 🚀 Deployment Status

The AskInBio project has been successfully prepared for Vercel deployment. However, the deployment requires environment variables to be configured before it can run successfully.

## 📋 Required Environment Variables

You need to add the following environment variables in Vercel:

### 1. Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (keep this secret!)

### 2. Database Configuration
- `DATABASE_URL` - PostgreSQL connection string from Supabase

### 3. App Configuration
- `NEXT_PUBLIC_APP_URL` - Set to your production URL (e.g., https://askinbio.vercel.app)

## 🔧 Setting Environment Variables

### Option 1: Using Vercel Dashboard (Recommended)

1. Go to your Vercel project: https://vercel.com/pro-rata/askinbio
2. Navigate to Settings → Environment Variables
3. Add each variable with the following settings:
   - Environment: Production (and optionally Preview/Development)
   - Name: The variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Value: Your actual value from Supabase

### Option 2: Using Vercel CLI

```bash
# For each variable, run:
vercel env add VARIABLE_NAME production

# Example:
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# (You'll be prompted to enter the value)
```

### Option 3: Using the Setup Script

```bash
# Run the provided setup script
./vercel-env-setup.sh
```

## 🔍 Finding Your Supabase Values

1. **Log in to Supabase**: https://app.supabase.com
2. **Select your project**
3. **Navigate to Project Settings → API**
   - `NEXT_PUBLIC_SUPABASE_URL`: Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon public key
   - `SUPABASE_SERVICE_ROLE_KEY`: service_role key (keep secret!)
4. **Navigate to Project Settings → Database**
   - `DATABASE_URL`: Connection string → URI (use the "Transaction" mode)

## 🚀 Deploying After Configuration

Once all environment variables are set:

```bash
# Deploy to production
vercel --prod

# Or push to GitHub (auto-deploys if connected)
git push origin main
```

## ✅ Post-Deployment Checklist

1. **Verify the deployment**: Visit your production URL
2. **Test authentication**: Try logging in/registering
3. **Check database connection**: Create a test user
4. **Monitor logs**: Check Vercel logs for any errors

## 🔍 Monitoring Your Deployment

### Vercel Dashboard
- **URL**: https://vercel.com/pro-rata/askinbio
- **Logs**: Functions tab → View runtime logs
- **Analytics**: Analytics tab for performance metrics

### Using Vercel CLI
```bash
# View deployment logs
vercel logs askinbio.vercel.app

# View build logs
vercel inspect askinbio.vercel.app --logs

# List all deployments
vercel list
```

## 🚨 Common Issues

### Build Failures
- Ensure all environment variables are set
- Check that `DATABASE_URL` is correctly formatted
- Verify Supabase project is active

### Runtime Errors
- Check function logs in Vercel dashboard
- Ensure CORS is configured in Supabase
- Verify API keys are correct

### Database Connection Issues
- Ensure DATABASE_URL uses the correct connection pooler
- Check if Supabase allows connections from Vercel IPs
- Verify the database password is correct

## 🎉 Success!

Once deployed with proper environment variables, your app will be available at:
- **Production**: https://askinbio.vercel.app (or your custom domain)
- **Preview**: Created for each pull request

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs