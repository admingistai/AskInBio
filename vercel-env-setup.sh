#!/bin/bash

# Vercel Environment Variables Setup Script
# This script helps you set up the required environment variables for AskInBio

echo "Setting up Vercel environment variables for AskInBio..."
echo ""
echo "Please have the following values ready from your Supabase dashboard:"
echo "1. NEXT_PUBLIC_SUPABASE_URL"
echo "2. NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "3. SUPABASE_SERVICE_ROLE_KEY"
echo "4. DATABASE_URL (PostgreSQL connection string)"
echo ""
echo "You can find these in Supabase:"
echo "- Project Settings > API > Project URL & Keys"
echo "- Project Settings > Database > Connection string"
echo ""

# Add environment variables using Vercel CLI
echo "Adding environment variables to Vercel..."

# Public variables (available in browser)
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_APP_URL production

# Secret variables (server-side only)
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add DATABASE_URL production

echo ""
echo "Environment variables have been added!"
echo "You can verify them at: https://vercel.com/pro-rata/askinbio/settings/environment-variables"
echo ""
echo "Now deploy with: vercel --prod"