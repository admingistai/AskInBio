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
  const [windowHeight, setWindowHeight] = useState(0)
  const [vpOffsetTop, setVpOffsetTop] = useState(0) // Track visual viewport scroll offset
  const [debugInfo, setDebugInfo] = useState({ kb: 0, vp: 0, wh: 0, offset: 0, visible: false })
  const containerRef = useRef<HTMLDivElement>(null)
  const originalMetaViewportRef = useRef<string | null>(null)

  // Prevent body scrolling when keyboard is visible
  useEffect(() => {
    if (isKeyboardVisible && isVisible) {
      // Add keyboard-lock class to body
      document.body.classList.add('keyboard-lock');
      
      // Store current scroll position
      const scrollY = window.scrollY;
      
      // Update meta viewport to prevent zooming and scrolling
      const metaViewport = document.querySelector('meta[name="viewport"]');
      if (metaViewport) {
        originalMetaViewportRef.current = metaViewport.getAttribute('content');
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
      
      // Prevent touchmove on document
      const preventScroll = (e: TouchEvent) => {
        // Allow scrolling within the widget content
        if (!containerRef.current?.contains(e.target as Node)) {
          e.preventDefault();
        }
      };
      
      // Prevent wheel events
      const preventWheel = (e: WheelEvent) => {
        if (!containerRef.current?.contains(e.target as Node)) {
          e.preventDefault();
        }
      };
      
      // Prevent gesture events on iOS
      const preventGesture = (e: Event) => {
        e.preventDefault();
      };
      
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('wheel', preventWheel, { passive: false });
      document.addEventListener('gesturestart', preventGesture);
      document.addEventListener('gesturechange', preventGesture);
      document.addEventListener('gestureend', preventGesture);
      
      return () => {
        // Remove keyboard-lock class
        document.body.classList.remove('keyboard-lock');
        
        // Restore original meta viewport
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (originalMetaViewportRef.current && metaViewport) {
          metaViewport.setAttribute('content', originalMetaViewportRef.current);
        }
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
        
        document.removeEventListener('touchmove', preventScroll);
        document.removeEventListener('wheel', preventWheel);
        document.removeEventListener('gesturestart', preventGesture);
        document.removeEventListener('gesturechange', preventGesture);
        document.removeEventListener('gestureend', preventGesture);
      };
    }
  }, [isKeyboardVisible, isVisible]);

  // Visual Viewport API for iOS keyboard detection
  useEffect(() => {
    const handleViewportChange = () => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        const winHeight = window.innerHeight
        const vpHeight = window.visualViewport.height
        const vpOffsetTop = window.visualViewport.offsetTop || 0
        const newKeyboardHeight = winHeight - vpHeight - vpOffsetTop
        
        // Debug logging
        console.log('🔍 Viewport change:', {
          windowHeight: winHeight,
          visualViewportHeight: vpHeight,
          visualViewportOffsetTop: vpOffsetTop,
          keyboardHeight: newKeyboardHeight,
          calculatedTopPosition: vpOffsetTop + vpHeight - 467, // Include offset in calculation
          isKeyboardVisible: newKeyboardHeight > 30
        })
        
        setKeyboardHeight(newKeyboardHeight)
        setWindowHeight(winHeight)
        setViewportHeight(vpHeight)
        setVpOffsetTop(vpOffsetTop) // Track the offset
        setIsKeyboardVisible(newKeyboardHeight > 30) // iOS keyboard is typically > 200px
        setDebugInfo({ kb: newKeyboardHeight, vp: vpHeight, wh: winHeight, offset: vpOffsetTop, visible: newKeyboardHeight > 30 })
        
        if (newKeyboardHeight > 30) {
          // Keyboard is visible
          // Calculate available height accounting for keyboard
          const availableHeight = vpHeight - 20 // Small margin from top
          
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
      setViewportHeight(window.visualViewport?.height || window.innerHeight)
      setWindowHeight(window.innerHeight)
      setVpOffsetTop(window.visualViewport?.offsetTop || 0)
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
        ...(isKeyboardVisible ? {
          // When keyboard is visible, position from top to lock bottom to keyboard
          // Viewport is locked, so we don't need offset anymore
          transform: 'translateX(-50%)',
          position: 'fixed',
          top: `${viewportHeight - widgetHeight}px`, // Simple calculation without offset
          bottom: 'auto'
        } : {
          // When keyboard is hidden, center the widget
          transform: 'translate(-50%, -50%)',
          position: 'fixed',
          top: '50%',
          bottom: 'auto'
        }),
        willChange: 'transform'
      } as React.CSSProperties}
    >
      {/* Debug overlay */}
      {debugMode && (
        <div className="absolute top-0 left-0 right-0 bg-black/50 text-white text-xs p-2 z-50">
          <div>KB: {debugInfo.kb}px | VP: {debugInfo.vp}px | Win: {debugInfo.wh}px</div>
          <div>Offset: {debugInfo.offset}px | Top: {isKeyboardVisible ? viewportHeight - widgetHeight : 'centered'}px</div>
          <div>Scroll Lock: {isKeyboardVisible ? 'ACTIVE' : 'INACTIVE'}</div>
          <div>Visible: {debugInfo.visible ? 'YES' : 'NO'} | Widget Height: {widgetHeight}px</div>
        </div>
      )}
      
      {/* Content container - prevent scrolling when keyboard visible */}
      <div 
        className="onboarding-content"
        style={{
          overflow: isKeyboardVisible ? 'hidden' : 'auto',
          touchAction: isKeyboardVisible ? 'none' : 'auto'
        }}
      >
        {children}
      </div>
    </div>
  )
}