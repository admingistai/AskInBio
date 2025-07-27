'use client'

import { useEffect, useState } from 'react'

export default function GlassShimmerLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Add a slight delay to show the shimmer effect
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      {/* Full screen shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 animate-pulse" />
      
      {/* Glass shimmer waves */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-x-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer-load" />
      </div>
      
      {/* Loading indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="glass-card glass-critical p-8 flex items-center justify-center">
          <div className="space-y-2">
            <div className="flex space-x-1 justify-center">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-white/80 text-sm font-medium">Loading glass profile...</p>
          </div>
        </div>
      </div>
    </div>
  )
}