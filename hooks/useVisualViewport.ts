'use client'

import { useState, useEffect } from 'react'

interface VisualViewportState {
  keyboardHeight: number
  isKeyboardVisible: boolean
  viewportHeight: number
}

export function useVisualViewport(): VisualViewportState {
  const [state, setState] = useState<VisualViewportState>({
    keyboardHeight: 0,
    isKeyboardVisible: false,
    viewportHeight: 0
  })

  useEffect(() => {
    // Check if visual viewport API is available (primarily iOS Safari)
    if (typeof window === 'undefined' || !window.visualViewport) {
      return
    }

    const updateViewport = () => {
      const visualViewport = window.visualViewport
      if (!visualViewport) return

      // Get the window height
      const windowHeight = window.innerHeight
      // Get the visual viewport height
      const viewportHeight = visualViewport.height

      // Calculate keyboard height
      // On iOS, when keyboard is shown, visual viewport height is reduced
      const keyboardHeight = windowHeight - viewportHeight
      
      // Consider keyboard visible if it takes more than 50px
      const isKeyboardVisible = keyboardHeight > 50

      setState({
        keyboardHeight,
        isKeyboardVisible,
        viewportHeight
      })
    }

    // Initial check
    updateViewport()

    // Listen for viewport changes
    const viewport = window.visualViewport
    if (viewport) {
      viewport.addEventListener('resize', updateViewport)
      viewport.addEventListener('scroll', updateViewport)
    }

    // Also listen for window resize (orientation changes)
    window.addEventListener('resize', updateViewport)

    // Cleanup
    return () => {
      if (viewport) {
        viewport.removeEventListener('resize', updateViewport)
        viewport.removeEventListener('scroll', updateViewport)
      }
      window.removeEventListener('resize', updateViewport)
    }
  }, [])

  return state
}

// Utility function to detect if device is iOS
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}