/**
 * Toaster Component
 * 
 * Purpose:
 * - Provides toast notifications using Sonner
 * - Global component added to root layout
 * - Shows success, error, and info messages
 * - Handles authentication feedback
 * 
 * Features:
 * - Auto-dismiss after timeout
 * - Stacking multiple toasts
 * - Dark mode support
 * - Customizable position
 */

"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
        },
      }}
    />
  )
}