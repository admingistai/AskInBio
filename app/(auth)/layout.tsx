/**
 * Auth Layout Component
 * 
 * Purpose:
 * - Shared layout for all authentication pages
 * - Provides consistent styling and structure
 * - Centers content with maximum width constraint
 * - Handles dark mode styling
 * 
 * Features:
 * - Logo/brand display
 * - Responsive container
 * - Background gradient
 * - Consistent spacing
 * - Loading state support
 */

import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md space-y-8 px-6">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              AskInBio
            </h1>
          </Link>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Your modern link-in-bio solution
          </p>
        </div>
        
        {/* Content */}
        {children}
      </div>
    </div>
  )
}