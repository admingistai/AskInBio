'use client'

import { useState, useEffect } from 'react'

export default function GlassDebugger() {
  const [isVisible, setIsVisible] = useState(false)
  const [browserSupport, setBrowserSupport] = useState({
    backdropFilter: false,
    webkitBackdropFilter: false,
    cssVariables: false,
  })

  useEffect(() => {
    // Check for debug mode in URL
    const params = new URLSearchParams(window.location.search)
    if (params.get('debug') === 'true') {
      setIsVisible(true)
    }

    // Check browser support
    const testEl = document.createElement('div')
    setBrowserSupport({
      backdropFilter: CSS.supports('backdrop-filter', 'blur(20px)'),
      webkitBackdropFilter: CSS.supports('-webkit-backdrop-filter', 'blur(20px)'),
      cssVariables: CSS.supports('color', 'var(--test)'),
    })
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed top-20 right-4 z-[100] glass-card p-4 max-w-xs">
      <h3 className="text-white font-bold mb-2">Glass Debug Info</h3>
      
      <div className="space-y-2 text-xs text-white/80">
        <div>
          <span className="font-semibold">Backdrop Filter:</span>{' '}
          <span className={browserSupport.backdropFilter ? 'text-green-400' : 'text-red-400'}>
            {browserSupport.backdropFilter ? '✓ Supported' : '✗ Not Supported'}
          </span>
        </div>
        
        <div>
          <span className="font-semibold">Webkit Backdrop:</span>{' '}
          <span className={browserSupport.webkitBackdropFilter ? 'text-green-400' : 'text-red-400'}>
            {browserSupport.webkitBackdropFilter ? '✓ Supported' : '✗ Not Supported'}
          </span>
        </div>
        
        <div>
          <span className="font-semibold">CSS Variables:</span>{' '}
          <span className={browserSupport.cssVariables ? 'text-green-400' : 'text-red-400'}>
            {browserSupport.cssVariables ? '✓ Supported' : '✗ Not Supported'}
          </span>
        </div>
        
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="font-semibold mb-1">Test Elements:</div>
          
          <div className="glass-surface p-2 mb-2 rounded">
            Glass Surface
          </div>
          
          <div className="glass-card p-2 mb-2">
            Glass Card
          </div>
          
          <div className="glass-critical p-2 rounded" style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            background: 'rgba(255,255,255,0.1)'
          }}>
            Direct Style Test
          </div>
        </div>
      </div>
      
      <button
        onClick={() => setIsVisible(false)}
        className="mt-3 text-white/60 hover:text-white text-xs"
      >
        Close Debug
      </button>
    </div>
  )
}