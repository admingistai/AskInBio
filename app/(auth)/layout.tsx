/**
 * Auth Layout Component with iOS Glassmorphism
 * 
 * Purpose:
 * - Premium glass authentication experience
 * - Dynamic color mesh background matching landing page
 * - iOS-style floating glass orbs for depth
 * - Apple design language implementation
 * 
 * Features:
 * - Dynamic gradient background with animated orbs
 * - Glassmorphism container styling
 * - Responsive design for all devices
 * - Hardware-accelerated animations
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    setIsLoaded(true)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 z-0">
        {/* Animated gradient background */}
        <div 
          className="absolute inset-0 opacity-70"
          style={{
            background: `
              radial-gradient(circle at 30% 40%, rgba(184, 255, 227, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(192, 129, 255, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 70%)
            `,
            animation: 'gradientShift 20s ease infinite'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/95" />
      </div>
      
      {/* Floating Glass Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(184, 255, 227, 0.2), transparent)',
            filter: 'blur(60px)',
            transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
            left: '20%',
            top: '20%',
            transition: 'transform 0.5s ease-out'
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(192, 129, 255, 0.2), transparent)',
            filter: 'blur(50px)',
            transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px)`,
            right: '20%',
            bottom: '30%',
            transition: 'transform 0.5s ease-out'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo with Apple Design Language */}
          <div 
            className={`text-center transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Link href="/" className="inline-block">
              <h1 
                className="font-extrabold tracking-tight mb-3"
                style={{
                  fontSize: 'clamp(42px, 8vw, 56px)',
                  lineHeight: '1.1',
                  fontFamily: 'var(--font-work-sans)'
                }}
              >
                <div className="text-white">Link</div>
                <div 
                  className="text-transparent bg-clip-text"
                  style={{
                    background: 'linear-gradient(135deg, #B8FFE3 0%, #C081FF 50%, #B8FFE3 100%)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'shimmer 3s ease-in-out infinite'
                  }}
                >
                  Anything.
                </div>
              </h1>
            </Link>
            <p className="text-white/60 text-sm mt-2">
              Your premium interactive bio experience
            </p>
          </div>
          
          {/* Content */}
          <div 
            className={`transition-all duration-1000 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}