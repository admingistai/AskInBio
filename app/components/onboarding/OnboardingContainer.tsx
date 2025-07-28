'use client'

import { useEffect, useRef, useCallback, useReducer, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

interface OnboardingContainerProps {
  children: React.ReactNode
  onKeyboardShow?: (height: number) => void
  onKeyboardHide?: () => void
  debugMode?: boolean
  isVisible: boolean
  onClose?: () => void
}

// Viewport state management
type ViewportState = {
  keyboardHeight: number
  isKeyboardVisible: boolean
  isFocused: boolean
  widgetHeight: number
  viewportHeight: number
  windowHeight: number
  offsetTop: number
}

type ViewportAction = 
  | { type: 'UPDATE_VIEWPORT'; payload: Partial<ViewportState> }
  | { type: 'SET_KEYBOARD_VISIBLE'; payload: boolean }
  | { type: 'SET_FOCUSED'; payload: boolean }
  | { type: 'SET_WIDGET_HEIGHT'; payload: number }
  | { type: 'RESET' }

const initialViewportState: ViewportState = {
  keyboardHeight: 0,
  isKeyboardVisible: false,
  isFocused: false,
  widgetHeight: 520,
  viewportHeight: 0,
  windowHeight: 0,
  offsetTop: 0
}

const viewportReducer = (state: ViewportState, action: ViewportAction): ViewportState => {
  switch (action.type) {
    case 'UPDATE_VIEWPORT':
      return { ...state, ...action.payload }
    case 'SET_KEYBOARD_VISIBLE':
      return { ...state, isKeyboardVisible: action.payload }
    case 'SET_FOCUSED':
      return { ...state, isFocused: action.payload }
    case 'SET_WIDGET_HEIGHT':
      return { ...state, widgetHeight: action.payload }
    case 'RESET':
      return initialViewportState
    default:
      return state
  }
}

// Debounce utility
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Browser detection utility
const detectBrowser = () => {
  if (typeof window === 'undefined') return { isSafari: false, isIOS: false, isIOSChrome: false }
  
  const ua = navigator.userAgent
  const isChrome = ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1
  const isSafariUA = ua.indexOf('Safari') > -1 && !isChrome
  const isIOS = /iPhone|iPad|iPod/.test(ua) && !(window as any).MSStream
  
  return {
    isSafari: isSafariUA && !isChrome,
    isIOS,
    isIOSChrome: isIOS && ua.indexOf('CriOS') > -1
  }
}

export default function OnboardingContainer({
  children,
  onKeyboardShow,
  onKeyboardHide,
  debugMode = false,
  isVisible,
  onClose
}: OnboardingContainerProps) {
  const [state, dispatch] = useReducer(viewportReducer, initialViewportState)
  const containerRef = useRef<HTMLDivElement>(null)
  const originalMetaViewportRef = useRef<string | null>(null)
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isClient, setIsClient] = useState(false)
  
  // Memoize browser detection
  const browserInfo = useMemo(() => detectBrowser(), [])
  const { isSafari, isIOS } = browserInfo
  
  // Set client flag after mount to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Force re-render on window resize for responsive updates
  useEffect(() => {
    if (!isClient) return
    
    const handleResize = () => {
      // Force a re-render by updating isClient (already true, but triggers render)
      setIsClient(true)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isClient])

  // Prevent body scrolling when keyboard is visible
  useEffect(() => {
    if (state.isKeyboardVisible && isVisible) {
      // Add keyboard-lock class to body
      document.body.classList.add('keyboard-lock')
      
      // Store current scroll position
      const scrollY = window.scrollY
      
      // Update meta viewport to prevent zooming and scrolling
      const metaViewport = document.querySelector('meta[name="viewport"]')
      if (metaViewport) {
        originalMetaViewportRef.current = metaViewport.getAttribute('content')
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
      }
      
      // Event handlers
      const preventScroll = (e: TouchEvent) => {
        if (!containerRef.current?.contains(e.target as Node)) {
          e.preventDefault()
        }
      }
      
      const preventWheel = (e: WheelEvent) => {
        if (!containerRef.current?.contains(e.target as Node)) {
          e.preventDefault()
        }
      }
      
      const preventGesture = (e: Event) => {
        e.preventDefault()
      }
      
      document.addEventListener('touchmove', preventScroll, { passive: false })
      document.addEventListener('wheel', preventWheel, { passive: false })
      document.addEventListener('gesturestart', preventGesture)
      document.addEventListener('gesturechange', preventGesture)
      document.addEventListener('gestureend', preventGesture)
      
      return () => {
        // Cleanup
        document.body.classList.remove('keyboard-lock')
        
        const metaViewport = document.querySelector('meta[name="viewport"]')
        if (originalMetaViewportRef.current && metaViewport) {
          metaViewport.setAttribute('content', originalMetaViewportRef.current)
        }
        
        window.scrollTo(0, scrollY)
        
        document.removeEventListener('touchmove', preventScroll)
        document.removeEventListener('wheel', preventWheel)
        document.removeEventListener('gesturestart', preventGesture)
        document.removeEventListener('gesturechange', preventGesture)
        document.removeEventListener('gestureend', preventGesture)
      }
    }
  }, [state.isKeyboardVisible, isVisible])

  // Handle viewport changes with proper browser detection
  const handleViewportChange = useCallback(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return
    
    const winHeight = window.innerHeight
    const vpHeight = window.visualViewport.height
    const vpOffsetTop = window.visualViewport.offsetTop || 0
    const keyboardHeight = winHeight - vpHeight
    
    // Unified keyboard detection logic
    const threshold = isIOS ? 30 : 50
    const keyboardVisible = keyboardHeight > threshold || (state.isFocused && isIOS && vpHeight < winHeight * 0.9)
    
    // Debug logging
    console.log('🔍 Viewport Debug:', {
      browser: { isSafari, isIOS },
      heights: { window: winHeight, viewport: vpHeight, keyboard: keyboardHeight },
      focused: state.isFocused,
      vpRatio: vpHeight / winHeight,
      positioning: keyboardVisible ? 'bottom-locked' : 'centered'
    })
    
    // Keep widget at fixed height - don't shrink when keyboard appears
    const widgetHeight = 467
    
    // Batch update all viewport-related state
    dispatch({
      type: 'UPDATE_VIEWPORT',
      payload: {
        keyboardHeight,
        isKeyboardVisible: keyboardVisible,
        widgetHeight,
        viewportHeight: vpHeight,
        windowHeight: winHeight,
        offsetTop: vpOffsetTop
      }
    })
    
    // Notify callbacks
    if (keyboardVisible && !state.isKeyboardVisible) {
      onKeyboardShow?.(keyboardHeight)
    } else if (!keyboardVisible && state.isKeyboardVisible) {
      onKeyboardHide?.()
    }
  }, [state.isFocused, state.isKeyboardVisible, isIOS, isSafari, onKeyboardShow, onKeyboardHide])

  // Debounced viewport handler - use shorter delay for better responsiveness
  const debouncedViewportChange = useMemo(
    () => debounce(handleViewportChange, 50),
    [handleViewportChange]
  )

  // Visual Viewport API setup
  useEffect(() => {
    // Initial setup
    handleViewportChange()
    
    if (typeof window !== 'undefined') {
      dispatch({
        type: 'UPDATE_VIEWPORT',
        payload: {
          viewportHeight: window.visualViewport?.height || window.innerHeight,
          windowHeight: window.innerHeight,
          offsetTop: window.visualViewport?.offsetTop || 0
        }
      })
    }

    // Add listeners - use immediate handler for resize, debounced for scroll
    if (typeof window !== 'undefined' && window.visualViewport) {
      // Use immediate handler for resize events (keyboard show/hide)
      window.visualViewport.addEventListener('resize', handleViewportChange)
      // Use debounced handler for scroll events
      window.visualViewport.addEventListener('scroll', debouncedViewportChange)
    }
    
    // Fallback for older browsers
    window.addEventListener('resize', handleViewportChange)
    
    return () => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange)
        window.visualViewport.removeEventListener('scroll', debouncedViewportChange)
      }
      window.removeEventListener('resize', handleViewportChange)
    }
  }, [handleViewportChange, debouncedViewportChange])

  // Track focus with improved iOS handling
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        dispatch({ type: 'SET_FOCUSED', payload: true })
        
        // For iOS, immediately show keyboard UI
        if (isIOS) {
          dispatch({ type: 'SET_KEYBOARD_VISIBLE', payload: true })
          // Also update viewport height immediately for iOS
          const estimatedKbHeight = 300
          dispatch({
            type: 'UPDATE_VIEWPORT',
            payload: {
              viewportHeight: window.innerHeight - estimatedKbHeight,
              keyboardHeight: estimatedKbHeight,
              isKeyboardVisible: true
            }
          })
        }
        // Always trigger viewport check
        handleViewportChange()
      }
    }

    const handleFocusOut = (e: FocusEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement
      if (!container.contains(relatedTarget)) {
        dispatch({ type: 'SET_FOCUSED', payload: false })
        
        // Clear any existing timeout
        if (focusTimeoutRef.current) {
          clearTimeout(focusTimeoutRef.current)
        }
        
        // Delay keyboard hide to prevent flicker
        focusTimeoutRef.current = setTimeout(() => {
          handleViewportChange()
        }, 300)
      }
    }

    container.addEventListener('focusin', handleFocusIn)
    container.addEventListener('focusout', handleFocusOut)

    return () => {
      container.removeEventListener('focusin', handleFocusIn)
      container.removeEventListener('focusout', handleFocusOut)
      
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current)
      }
    }
  }, [handleViewportChange, isIOS])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!state.isFocused && isVisible) {
          onClose?.()
        }
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, state.isFocused, onClose])

  // Memoize styles for performance with enhanced mobile spacing
  const containerStyles = useMemo(() => {
    // Enhanced safe area and device-specific adjustments
    const safariBuffer = isSafari && state.isKeyboardVisible ? 8 : 0;
    const keyboardBuffer = state.isKeyboardVisible ? 20 : 0;
    
    // Use consistent values during SSR and hydration
    let width = '480px';
    let maxHeight = '600px';
    let horizontalPadding = '16px';
    let verticalOffset = '80px';
    
    // Only apply responsive values after client mount
    if (isClient && typeof window !== 'undefined') {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      // Enhanced responsive width with proper safe area handling
      if (vw <= 375) { // iPhone SE/mini
        width = 'calc(100vw - max(20px, env(safe-area-inset-left) + env(safe-area-inset-right) + 16px))';
        horizontalPadding = 'max(10px, env(safe-area-inset-left) + 8px)';
      } else if (vw <= 414) { // Standard phones
        width = 'calc(100vw - max(24px, env(safe-area-inset-left) + env(safe-area-inset-right) + 20px))';
        horizontalPadding = 'max(12px, env(safe-area-inset-left) + 10px)';
      } else if (vw <= 640) { // Large phones
        width = 'calc(100vw - max(32px, env(safe-area-inset-left) + env(safe-area-inset-right) + 24px))';
        horizontalPadding = 'max(16px, env(safe-area-inset-left) + 12px)';
      } else if (vw <= 1024) { // Tablets
        width = 'min(480px, calc(100vw - 48px))';
        horizontalPadding = '24px';
      } else { // Desktop
        width = 'min(520px, calc(100vw - 64px))';
        horizontalPadding = '32px';
      }
      
      // Enhanced responsive height with safe area consideration
      if (vh <= 667) { // Small screens (iPhone SE)
        maxHeight = 'calc(100vh - max(60px, env(safe-area-inset-top) + env(safe-area-inset-bottom) + 40px))';
        verticalOffset = 'max(30px, env(safe-area-inset-top) + 20px)';
      } else if (vh <= 736) { // Medium screens
        maxHeight = 'calc(100vh - max(80px, env(safe-area-inset-top) + env(safe-area-inset-bottom) + 60px))';
        verticalOffset = 'max(40px, env(safe-area-inset-top) + 30px)';
      } else if (vh <= 896) { // Standard screens
        maxHeight = 'calc(100vh - max(100px, env(safe-area-inset-top) + env(safe-area-inset-bottom) + 80px))';
        verticalOffset = 'max(50px, env(safe-area-inset-top) + 40px)';
      } else { // Large screens
        maxHeight = '600px';
        verticalOffset = '60px';
      }
    }
    
    return {
      width,
      maxWidth: '520px',
      height: state.isKeyboardVisible ? 
        `min(${state.widgetHeight}px, calc(100vh - ${state.keyboardHeight + keyboardBuffer + 20}px))` : 
        `min(${state.widgetHeight}px, ${maxHeight})`,
      maxHeight,
      left: '50%',
      paddingLeft: horizontalPadding,
      paddingRight: horizontalPadding,
      ...(state.isKeyboardVisible ? {
        // Enhanced keyboard positioning with safe area support
        transform: 'translateX(-50%)',
        position: 'fixed' as const,
        bottom: `max(${state.keyboardHeight + safariBuffer + keyboardBuffer}px, env(safe-area-inset-bottom) + ${state.keyboardHeight + safariBuffer}px)`,
        top: 'auto',
        // Ensure content doesn't get cut off by safe areas
        marginLeft: 'max(0px, env(safe-area-inset-left))',
        marginRight: 'max(0px, env(safe-area-inset-right))'
      } : {
        // Enhanced centering with safe area consideration
        transform: 'translate(-50%, -50%)',
        position: 'fixed' as const,
        top: '50%',
        bottom: 'auto',
        // Add safe area margins for notched devices
        marginTop: `max(0px, env(safe-area-inset-top) / 2)`,
        marginLeft: 'max(0px, env(safe-area-inset-left))',
        marginRight: 'max(0px, env(safe-area-inset-right))'
      }),
      willChange: 'transform, height',
      background: 'transparent',
      // Enhanced performance and smooth transitions
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      contain: 'layout style paint' as 'layout style paint'
    }
  }, [state.isKeyboardVisible, state.widgetHeight, state.keyboardHeight, isSafari, isClient])

  const contentStyles = useMemo(() => ({
    overflow: state.isKeyboardVisible ? 'hidden' : 'auto',
    touchAction: state.isKeyboardVisible ? 'none' : 'auto',
    // Enhanced touch interactions
    WebkitOverflowScrolling: 'touch' as 'touch',
    overscrollBehavior: 'contain' as 'contain',
    // Improved spacing and layout
    padding: isClient && typeof window !== 'undefined' ? (
      window.innerWidth <= 414 ? 
        'clamp(16px, 4vw, 24px)' : // Small phones: responsive padding
        window.innerWidth <= 640 ? 
        'clamp(20px, 5vw, 32px)' : // Large phones: more generous
        '24px' // Tablets and up: fixed padding
    ) : '20px',
    // Enhanced content flow
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: isClient && typeof window !== 'undefined' ? (
      window.innerWidth <= 414 ? 
        'clamp(12px, 3vw, 16px)' : // Tighter spacing on small screens
        'clamp(16px, 4vw, 24px)' // More generous on larger screens
    ) : '16px',
    // Minimum touch target considerations
    minHeight: 'min-content',
    position: 'relative' as 'relative'
  }), [state.isKeyboardVisible, isClient])

  return (
    <div
      ref={containerRef}
      className={cn(
        'onboarding-widget',
        'fixed z-30',
        // Enhanced transitions with proper easing
        'transition-all duration-300 ease-out',
        // Better visibility handling
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
        // Keyboard state classes for CSS targeting
        state.isKeyboardVisible ? 'keyboard-visible' : 'keyboard-hidden',
        // Mobile-specific classes
        'supports-[height:100dvh]:h-[100dvh]', // Dynamic viewport support
        'supports-[env(safe-area-inset-top)]:pt-[env(safe-area-inset-top)]', // Safe area support
        // Performance optimizations
        'transform-gpu will-change-transform',
        // Debug mode
        debugMode && 'debug-border',
        // Enhanced mobile styling
        'rounded-xl sm:rounded-2xl', // Responsive border radius
        'shadow-2xl shadow-black/25', // Enhanced shadow for depth
        'backdrop-blur-xl', // Stronger blur for better separation
        'border border-white/10' // Subtle border for definition
      )}
      style={containerStyles}
    >
      {/* Debug overlay */}
      {debugMode && (
        <div className="absolute top-0 left-0 right-0 bg-black/50 text-white text-xs p-2 z-50">
          <div>KB: {state.keyboardHeight}px | VP: {state.viewportHeight}px | Win: {state.windowHeight}px</div>
          <div>Offset: {state.offsetTop}px | Position: {state.isKeyboardVisible ? `Bottom: ${state.keyboardHeight}px` : 'Centered'}</div>
          <div>Browser: {isSafari ? 'Safari' : (browserInfo.isIOSChrome ? 'Chrome iOS' : 'Other')} | Focused: {state.isFocused ? 'YES' : 'NO'}</div>
          <div>Visible: {state.isKeyboardVisible ? 'YES' : 'NO'} | Widget Height: {state.widgetHeight}px</div>
        </div>
      )}
      
      {/* Content container */}
      <div 
        className="onboarding-content"
        style={contentStyles}
      >
        {children}
      </div>
    </div>
  )
}