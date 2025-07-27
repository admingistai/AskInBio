/**
 * Skip Navigation Component
 * 
 * Purpose:
 * - Provides keyboard navigation shortcuts
 * - Improves accessibility for screen reader users
 * - Allows skipping repetitive navigation
 * - Hidden visually but accessible to assistive tech
 * 
 * Features:
 * - Skip to main content link
 * - Keyboard accessible
 * - Screen reader friendly
 * - Focus visible styling
 */

export function SkipNav() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary z-50"
    >
      Skip to main content
    </a>
  )
}