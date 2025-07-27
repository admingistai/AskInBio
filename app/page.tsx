'use client'

import { useState, useEffect } from 'react'
import OnboardingFlow from '@/components/OnboardingFlow'

export default function OnboardingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isOnboardingActive, setIsOnboardingActive] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    setIsLoaded(true)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Dynamic Gradient Background - z-0 */}
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
            top: '20%'
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(192, 129, 255, 0.2), transparent)',
            filter: 'blur(50px)',
            transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px)`,
            right: '20%',
            bottom: '30%'
          }}
        />
      </div>

      {/* Main Content - z-10 */}
      <div 
        className={`relative z-10 flex px-6 pt-16 md:pt-20 lg:pt-24 transition-all duration-700 ${
          isOnboardingActive ? 'opacity-0 translate-y-[-20px] pointer-events-none' : 'opacity-100 translate-y-0'
        }`} 
        style={{ minHeight: 'calc(100vh - 120px)' }}
      >
        <div className="max-w-4xl w-full mx-auto">
          {/* Content container */}
          <div className="max-w-2xl mx-auto px-4 md:px-8">
            {/* Main Title with floating animation - Centered */}
            <h1 
              className={`font-extrabold tracking-tight mb-8 text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{
                fontSize: 'clamp(58px, 11vw, 96px)', // Increased from clamp(52px, 10vw, 88px)
                lineHeight: '1.1',
                fontFamily: 'var(--font-work-sans)',
                animation: isLoaded ? 'float 6s ease-in-out infinite' : 'none',
                paddingBottom: '16px',
                paddingTop: '8px'
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
            
            {/* Description with fade in - left aligned */}
            <div className="mb-12">
              <p className={`text-lg md:text-xl lg:text-2xl text-white/60 text-left transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                Add Link Anything™, the AI companion that drives engagement, grows traffic, and unlocks new revenue-- free, customizable to your brand, your look, your content. Create and install in 45 seconds.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Get Started Button / Onboarding Flow */}
      <OnboardingFlow onActiveChange={setIsOnboardingActive} />

      {/* Future overlay will be z-20 */}
      {/* <div className="absolute inset-0 z-20">Onboarding overlay here</div> */}
    </div>
  )
}