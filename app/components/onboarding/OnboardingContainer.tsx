'use client'

import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface OnboardingContainerProps {
  children: React.ReactNode
  onKeyboardShow?: (height: number) => void
  onKeyboardHide?: () => void
  debugMode?: boolean
  isVisible: boolean
  onClose?: () => void
}

export default function OnboardingContainer({
  children,
  onKeyboardShow,
  onKeyboardHide,
  debugMode = false,
  isVisible,
  onClose
}: OnboardingContainerProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Visual Viewport API for iOS keyboard detection
  useEffect(() => {
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const newKeyboardHeight = window.innerHeight - window.visualViewport.height
        setKeyboardHeight(newKeyboardHeight)
        
        if (newKeyboardHeight > 0) {
          onKeyboardShow?.(newKeyboardHeight)
        } else {
          onKeyboardHide?.()
        }
      }
    }

    // Initial check
    handleViewportChange()

    // Add listeners
    window.visualViewport?.addEventListener('resize', handleViewportChange)
    window.visualViewport?.addEventListener('scroll', handleViewportChange)
    
    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange)
      window.visualViewport?.removeEventListener('scroll', handleViewportChange)
    }
  }, [onKeyboardShow, onKeyboardHide])

  // Track focus on any input within the container
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setIsFocused(true)
      }
    }

    const handleFocusOut = (e: FocusEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement
      if (!container.contains(relatedTarget)) {
        setIsFocused(false)
      }
    }

    container.addEventListener('focusin', handleFocusIn)
    container.addEventListener('focusout', handleFocusOut)

    return () => {
      container.removeEventListener('focusin', handleFocusIn)
      container.removeEventListener('focusout', handleFocusOut)
    }
  }, [])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!isFocused && isVisible) {
          onClose?.()
        }
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, isFocused, onClose])

  return (
    <div
      ref={containerRef}
      className={cn(
        'onboarding-container',
        'fixed left-0 right-0 top-0 z-30',
        'flex flex-col overflow-hidden',
        'transition-all duration-300 ease-out',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
        debugMode && 'debug-border'
      )}
      style={{
        bottom: `${keyboardHeight}px`,
        '--keyboard-height': `${keyboardHeight}px`
      } as React.CSSProperties}
    >
      {/* Safe area spacer for iOS */}
      <div className="flex-1 min-h-0">
        {children}
      </div>
      
      {/* Bottom safe area for iPhone home indicator */}
      <div 
        className="shrink-0"
        style={{ 
          height: keyboardHeight > 0 ? '0' : 'env(safe-area-inset-bottom)'
        }}
      />
    </div>
  )
}