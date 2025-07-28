'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { GoogleButton } from '@/components/auth/GoogleButton'

interface OnboardingData {
  goal: string
  username: string
  displayName: string
  bio: string
  links: Array<{
    title: string
    url: string
    icon?: string
  }>
}

export default function OnboardingAwareRegister() {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check for onboarding data from sessionStorage
    const stored = sessionStorage.getItem('onboardingData')
    if (stored) {
      try {
        const data = JSON.parse(stored) as OnboardingData
        setOnboardingData(data)
        setShowWelcome(true)
        
        // Clear the data after reading it
        sessionStorage.removeItem('onboardingData')
      } catch (error) {
        console.error('Failed to parse onboarding data:', error)
      }
    }
    
    // Trigger fade-in animation
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  return (
    <div 
      className={`relative transition-all duration-700 ${
        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{
        borderRadius: '32px',
        background: 'rgba(20, 20, 23, 0.85)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.125)',
        boxShadow: `
          0 32px 64px rgba(0, 0, 0, 0.4),
          0 16px 32px rgba(0, 0, 0, 0.3),
          0 4px 16px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.15),
          inset 0 0 20px rgba(255, 255, 255, 0.05)
        `,
        willChange: 'backdrop-filter, transform'
      }}
    >
      {/* Glass Card Header */}
      <div className="p-8 pb-6">
        {showWelcome && onboardingData ? (
          <div className="text-center space-y-4">
            {/* Success Celebration */}
            <div className="flex justify-center mb-6">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(94, 234, 212, 0.2)',
                  border: '1px solid rgba(94, 234, 212, 0.3)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <span className="text-4xl">🎉</span>
              </div>
            </div>
            
            {/* Success Message */}
            <h1 className="text-3xl font-bold text-white leading-tight">
              You&apos;re almost there!
            </h1>
            
            {/* Value Proposition */}
            <div className="space-y-3">
              <p className="text-white/80 text-lg">
                Complete your account to start helping you{' '}
                <span 
                  className="font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #B8FFE3 0%, #C081FF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {onboardingData.goal.toLowerCase()}
                </span>
              </p>
              
              {/* URL Preview */}
              {onboardingData.username && (
                <div 
                  className="inline-block px-4 py-2 rounded-full text-sm font-mono"
                  style={{
                    background: 'rgba(94, 234, 212, 0.1)',
                    border: '1px solid rgba(94, 234, 212, 0.2)',
                    color: '#5EEAD4'
                  }}
                >
                  askinbio.com/{onboardingData.username}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-white leading-tight">
              Create your Ask in Bio
            </h1>
            <p className="text-white/70 text-lg">
              Complete your profile and start engaging with your audience
            </p>
          </div>
        )}
      </div>

      {/* Glass Card Content */}
      <div className="px-8 pb-8 space-y-6">
        {/* Google OAuth - Primary Option */}
        <div className="space-y-4">
          <GoogleButton />
          <p className="text-center text-sm text-white/60">
            {showWelcome ? 'Complete setup with Google - fastest way' : 'Quick setup with Google - recommended'}
          </p>
        </div>
        
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span 
              className="w-full h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)'
              }}
            />
          </div>
          <div className="relative flex justify-center">
            <span 
              className="px-4 text-xs uppercase tracking-wider text-white/50"
              style={{
                background: 'rgba(20, 20, 23, 0.85)'
              }}
            >
              Or create with email
            </span>
          </div>
        </div>
        
        {/* Email Registration Form */}
        <RegisterForm defaultUsername={onboardingData?.username} />
      </div>

      {/* Glass Card Footer */}
      <div 
        className="px-8 py-6 text-center border-t"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <p className="text-sm text-white/60">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-[#5EEAD4] hover:text-[#4FD1C7] transition-colors duration-200 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}