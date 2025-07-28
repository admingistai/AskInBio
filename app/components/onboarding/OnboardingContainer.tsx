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
  }, [state.isFocused, state.isKeyboardVisible, isIOS, onKeyboardShow, onKeyboardHide])

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

  // Memoize styles for performance
  const containerStyles = useMemo(() => {
    // Safari may need a small buffer to account for bottom bar
    const safariBuffer = isSafari && state.isKeyboardVisible ? 5 : 0;
    
    // Use consistent values during SSR and hydration
    let width = '480px';
    let maxHeight = '600px';
    
    // Only apply responsive values after client mount
    if (isClient && typeof window !== 'undefined') {
      // Responsive width with screen edge padding
      width = window.innerWidth < 640 ? 'calc(100vw - 32px)' : // Mobile: 16px padding each side
        window.innerWidth < 1024 ? 'min(480px, calc(100vw - 40px))' : // Tablet: 480px max
        'min(520px, calc(100vw - 48px))'; // Desktop: 520px max
      
      // Responsive height
      maxHeight = window.innerHeight < 700 ? 'calc(100vh - 80px)' : // Small screens
        window.innerHeight < 900 ? 'calc(100vh - 120px)' : // Medium screens
        '600px'; // Large screens
    }
    
    return {
      width,
      maxWidth: '520px',
      height: state.isKeyboardVisible ? 
        `min(${state.widgetHeight}px, calc(100vh - ${state.keyboardHeight + 40}px))` : 
        `min(${state.widgetHeight}px, ${maxHeight})`,
      maxHeight,
      left: '50%',
      ...(state.isKeyboardVisible ? {
        // Lock widget bottom to keyboard top by using keyboard height
        transform: 'translateX(-50%)',
        position: 'fixed' as const,
        bottom: `${state.keyboardHeight + safariBuffer}px`, // Position above keyboard with optional Safari buffer
        top: 'auto'
        // Removed safe area padding as we're positioning relative to keyboard
      } : {
        // Center when keyboard is hidden
        transform: 'translate(-50%, -50%)',
        position: 'fixed' as const,
        top: '50%',
        bottom: 'auto'
      }),
      willChange: 'transform',
      background: 'transparent'
    }
  }, [state.isKeyboardVisible, state.widgetHeight, state.keyboardHeight, isSafari, isClient])

  const contentStyles = useMemo(() => ({
    overflow: state.isKeyboardVisible ? 'hidden' : 'auto',
    touchAction: state.isKeyboardVisible ? 'none' : 'auto'
  }), [state.isKeyboardVisible])

  return (
    <div
      ref={containerRef}
      className={cn(
        'onboarding-widget',
        'fixed z-30',
        'transition-all duration-300 ease-out',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
        state.isKeyboardVisible ? 'keyboard-visible' : '',
        debugMode && 'debug-border'
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