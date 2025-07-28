/**
 * Glass Input Component for Auth Forms
 * 
 * Purpose:
 * - Glass morphism styled input fields
 * - iOS-style frosted glass aesthetic
 * - Enhanced focus states and interactions
 * - Consistent with premium design language
 * 
 * Features:
 * - Backdrop blur and transparency
 * - Subtle borders and shadows
 * - Smooth focus transitions
 * - Error state styling
 */

import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, type, hasError = false, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-full px-6 py-3 text-white placeholder:text-white/50 text-sm transition-all duration-200",
          "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{
          background: isFocused 
            ? 'rgba(255, 255, 255, 0.15)' 
            : 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: hasError 
            ? '1px solid rgba(239, 68, 68, 0.5)'
            : isFocused
              ? '1px solid rgba(94, 234, 212, 0.6)'
              : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: hasError
            ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
            : isFocused
              ? '0 0 0 3px rgba(94, 234, 212, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : 'inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          willChange: 'border-color, box-shadow, background'
        }}
        onFocus={(e) => {
          setIsFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          props.onBlur?.(e)
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
GlassInput.displayName = "GlassInput"

export { GlassInput }