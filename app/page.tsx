'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import OnboardingContainer from './components/onboarding/OnboardingContainer'
import OnboardingFlow from './components/onboarding/OnboardingFlow'

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isButtonVisible, setIsButtonVisible] = useState(true)
  const [isButtonFading, setIsButtonFading] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isContentFading, setIsContentFading] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    setIsLoaded(true)
    
    // Delay button appearance
    const buttonTimer = setTimeout(() => {
      setShowButton(true)
    }, 1200)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(buttonTimer)
    }
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
        className="relative z-10 flex px-6 pt-16 md:pt-20 lg:pt-24 transition-all duration-700 opacity-100 translate-y-0"
        style={{ minHeight: '100vh' }}
      >
        <div className="max-w-4xl w-full mx-auto">
          {/* Content container */}
          <div className="max-w-2xl mx-auto px-4 md:px-8">
            {/* Main Title with floating animation - Centered */}
            <h1 
              className={`font-extrabold tracking-tight mb-8 text-center transition-all duration-1000 ${
                isContentFading ? 'opacity-0 translate-y-4' : isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
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
              <p className={`text-lg md:text-xl lg:text-2xl text-white/60 text-left transition-all duration-1000 delay-300 ${
                isContentFading ? 'opacity-0 translate-y-4' : isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                Add Link Anything™, the AI companion that drives engagement, grows traffic, and unlocks new revenue-- free, customizable to your brand, your look, your content. Create and install in 45 seconds.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Get Started Button - z-20 */}
      {isButtonVisible && (
        <button
          onClick={() => {
            // First fade out content
            setIsContentFading(true)
            
            // Then fade out button after a short delay
            setTimeout(() => {
              setIsButtonFading(true)
            }, 300)
            
            // Finally show onboarding after everything fades
            setTimeout(() => {
              setIsButtonVisible(false)
              setShowOnboarding(true)
            }, 1100)
          }}
          className={`
            fixed bottom-[10vh] left-1/2 -translate-x-1/2 z-20
            flex items-center justify-center gap-[10.178px]
            text-white font-medium text-base
            transition-all ease-out
            hover:scale-[1.02] active:scale-[0.98]
            group
            ${isButtonFading ? 'opacity-0 scale-95 duration-800' : showButton ? 'opacity-100 scale-100 duration-800' : 'opacity-0 scale-95'}
          `}
          style={{
            // Figma exact specifications
            width: '353px',
            maxWidth: '90vw', // Responsive on mobile
            height: '51px',
            padding: '7.634px 10px',
            borderRadius: '23px',
            background: 'rgba(255, 255, 255, 0.06)',
            boxShadow: '0 1.272px 15.267px 0 rgba(0, 0, 0, 0.05)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: !isButtonFading ? 'pulse 4s ease-in-out infinite' : 'none',
          }}
          onMouseEnter={(e) => {
            if (!isButtonFading) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.boxShadow = '0 2px 20px 0 rgba(255, 255, 255, 0.1), 0 1.272px 15.267px 0 rgba(0, 0, 0, 0.05)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isButtonFading) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
              e.currentTarget.style.boxShadow = '0 1.272px 15.267px 0 rgba(0, 0, 0, 0.05)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Get Started
        </button>
      )}

      {/* Onboarding Container */}
      <OnboardingContainer
        isVisible={showOnboarding}
        debugMode={false}
        onClose={() => {
          setShowOnboarding(false)
          setIsContentFading(false)
          setIsButtonVisible(true)
          setIsButtonFading(false)
        }}
        onKeyboardShow={(height) => {
          console.log('Keyboard shown, height:', height)
        }}
        onKeyboardHide={() => {
          console.log('Keyboard hidden')
        }}
      >
        <OnboardingFlow 
          isVisible={showOnboarding}
          onComplete={(data) => {
            console.log('Onboarding completed:', data)
            // Store onboarding data in sessionStorage for the signup process
            sessionStorage.setItem('onboardingData', JSON.stringify(data))
            
            // Navigate to register page to complete account creation
            router.push('/register')
          }}
        />
      </OnboardingContainer>
    </div>
  )
}