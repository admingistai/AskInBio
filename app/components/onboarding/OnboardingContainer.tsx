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
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Visual Viewport API for iOS keyboard detection
  useEffect(() => {
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const newKeyboardHeight = window.innerHeight - window.visualViewport.height
        setKeyboardHeight(newKeyboardHeight)
        setIsKeyboardVisible(newKeyboardHeight > 50) // Threshold to avoid false positives
        
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

  // Calculate dynamic height when keyboard is visible
  const containerHeight = isKeyboardVisible 
    ? `min(467px, calc(100vh - ${keyboardHeight}px - 20px))` 
    : '467px'

  return (
    <div
      ref={containerRef}
      className={cn(
        'onboarding-widget',
        'fixed z-30',
        'transition-all duration-300 ease-out',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
        isKeyboardVisible ? 'keyboard-visible' : '',
        debugMode && 'debug-border'
      )}
      style={{
        width: '303px',
        height: containerHeight,
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: isKeyboardVisible ? `${keyboardHeight}px` : '50%',
        marginBottom: isKeyboardVisible ? '0' : '-233.5px', // Half of 467px
        '--keyboard-height': `${keyboardHeight}px`
      } as React.CSSProperties}
    >
      {/* Scrollable content container */}
      <div className="h-full overflow-y-auto">
        {children}
      </div>
    </div>
  )
}