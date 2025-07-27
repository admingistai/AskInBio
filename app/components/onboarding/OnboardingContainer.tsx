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
  const [widgetHeight, setWidgetHeight] = useState(467) // Default height
  const [viewportHeight, setViewportHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Visual Viewport API for iOS keyboard detection
  useEffect(() => {
    const handleViewportChange = () => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        const newKeyboardHeight = window.innerHeight - window.visualViewport.height
        setKeyboardHeight(newKeyboardHeight)
        setIsKeyboardVisible(newKeyboardHeight > 50) // Threshold to avoid false positives
        setViewportHeight(window.visualViewport.height || window.innerHeight)
        
        if (newKeyboardHeight > 0) {
          // Keyboard is visible
          // Calculate available space (visual viewport height minus safe margins)
          const availableHeight = window.visualViewport.height - 40 // 40px for margins
          
          // Set widget height to fit within available space
          const newHeight = Math.min(467, availableHeight)
          setWidgetHeight(newHeight)
          
          onKeyboardShow?.(newKeyboardHeight)
        } else {
          // Keyboard is hidden
          setWidgetHeight(467) // Reset to default
          onKeyboardHide?.()
        }
      }
    }

    // Initial check
    handleViewportChange()

    // Set initial viewport height on mount
    if (typeof window !== 'undefined') {
      setViewportHeight(window.innerHeight)
    }

    // Add listeners
    if (typeof window !== 'undefined') {
      window.visualViewport?.addEventListener('resize', handleViewportChange)
      window.visualViewport?.addEventListener('scroll', handleViewportChange)
      
      // Fallback for older browsers
      window.addEventListener('resize', handleViewportChange)
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.visualViewport?.removeEventListener('resize', handleViewportChange)
        window.visualViewport?.removeEventListener('scroll', handleViewportChange)
        window.removeEventListener('resize', handleViewportChange)
      }
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
        'onboarding-widget',
        'fixed z-30',
        'transition-all duration-300 ease-out',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
        isKeyboardVisible ? 'keyboard-visible' : '',
        debugMode && 'debug-border'
      )}
      style={{
        width: '303px',
        height: `${widgetHeight}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: isKeyboardVisible ? `${keyboardHeight + 20}px` : '50%',
        marginBottom: isKeyboardVisible ? '0' : `-${widgetHeight / 2}px`,
        '--keyboard-height': `${keyboardHeight}px`,
        '--widget-height': `${widgetHeight}px`,
        '--visual-viewport-height': `${viewportHeight}px`
      } as React.CSSProperties}
    >
      {/* Scrollable content container */}
      <div className="onboarding-content">
        {children}
      </div>
    </div>
  )
}