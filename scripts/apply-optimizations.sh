#!/bin/bash

# Apply Optimizations Script for Ask in Bio Project

echo "🚀 Starting Ask in Bio Project Optimization..."

# Backup existing files
echo "📦 Creating backups..."
cp package.json package.json.backup
cp next.config.js next.config.js.backup
cp tsconfig.json tsconfig.json.backup

# Check if we should apply optimizations
read -p "Do you want to apply the optimizations? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Optimization cancelled."
    exit 1
fi

# Apply optimized configurations
echo "📝 Applying optimized configurations..."
cp package.optimized.json package.json
cp next.config.optimized.js next.config.js
cp tsconfig.optimized.json tsconfig.json

# Clean cache and reinstall dependencies
echo "🧹 Cleaning cache..."
rm -rf .next .tsbuildinfo node_modules package-lock.json

echo "📦 Installing optimized dependencies..."
npm install

# Install additional optimization tools
echo "🛠️  Installing optimization tools..."
npm install --save-dev @next/bundle-analyzer depcheck

# Replace date-fns with dayjs
echo "🔄 Replacing date-fns with dayjs..."
npm uninstall date-fns
npm install dayjs

# Remove unused dependencies based on depcheck results
echo "🗑️  Removing potentially unused dependencies..."
# Note: Review these before removing in production
# npm uninstall styled-jsx zustand

echo "✨ Optimization complete!"
echo ""
echo "📊 Next steps:"
echo "1. Run 'npm run build:analyze' to see bundle analysis"
echo "2. Run 'npm run typecheck' to check TypeScript"
echo "3. Run 'npm run test' to ensure everything works"
echo "4. Review the PROJECT_OPTIMIZATION_REPORT.md for detailed recommendations"
echo ""
echo "💡 To revert changes, run:"
echo "   mv package.json.backup package.json"
echo "   mv next.config.js.backup next.config.js"
echo "   mv tsconfig.json.backup tsconfig.json"
echo "   npm install"