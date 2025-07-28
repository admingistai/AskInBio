/**
 * Glass Button Component for Auth Forms
 * 
 * Purpose:
 * - Premium glass morphism button styling
 * - iOS-style interactive feedback
 * - Primary and secondary variants
 * - Loading state support
 * 
 * Features:
 * - Backdrop blur effects
 * - Hover and active state animations
 * - Gradient accent colors
 * - Hardware-accelerated transitions
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  isLoading?: boolean
  children: React.ReactNode
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = 'primary', isLoading = false, children, ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false)

    const isPrimary = variant === 'primary'

    return (
      <button
        className={cn(
          "flex items-center justify-center h-12 w-full rounded-full font-medium text-sm transition-all duration-200",
          "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          "hover:scale-[1.02] active:scale-[0.98]",
          className
        )}
        style={{
          background: isPrimary 
            ? isPressed
              ? '#4FD1C7'
              : '#5EEAD4'
            : isPressed
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(255, 255, 255, 0.1)',
          backdropFilter: isPrimary ? 'none' : 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: isPrimary ? 'none' : 'blur(20px) saturate(180%)',
          border: isPrimary 
            ? 'none'
            : '1px solid rgba(255, 255, 255, 0.2)',
          color: isPrimary ? '#000' : '#fff',
          boxShadow: isPrimary
            ? '0 4px 16px rgba(94, 234, 212, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)'
            : 'inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          willChange: 'transform, background-color, box-shadow'
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        disabled={isLoading || props.disabled}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)
GlassButton.displayName = "GlassButton"

export { GlassButton }