'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OnboardingFlowProps {
  isVisible: boolean
  onComplete?: (data: OnboardingData) => void
}

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

const SUGGESTED_GOALS = [
  'Increase Subscription Value',
  'Boost General Engagement',
  'Drive Newsletter Signups'
]

const MORE_GOALS = [
  'Improve Content Quality',
  'Build Community',
  'Monetize Audience',
  'Increase Brand Awareness'
]

export default function OnboardingFlow({ isVisible, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedGoal, setSelectedGoal] = useState('')
  const [customGoal, setCustomGoal] = useState('')
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Data for subsequent steps
  const [data, setData] = useState<OnboardingData>({
    goal: '',
    username: '',
    displayName: '',
    bio: '',
    links: []
  })

  // Reset when becoming visible
  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0)
      setSelectedGoal('')
      setCustomGoal('')
      setShowMoreOptions(false)
    }
  }, [isVisible])

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal)
    setCustomGoal('')
    // Auto-advance after selection
    setTimeout(() => {
      handleNext()
    }, 300)
  }

  const handleNext = () => {
    setIsAnimating(true)
    
    // Update goal in data
    const finalGoal = customGoal || selectedGoal
    setData(prev => ({ ...prev, goal: finalGoal }))
    
    setTimeout(() => {
      if (currentStep === 2) { // Last step
        onComplete?.({ ...data, goal: finalGoal })
      } else {
        setCurrentStep(prev => prev + 1)
      }
      setIsAnimating(false)
    }, 300)
  }

  const handleVoiceInput = () => {
    // Placeholder for voice input functionality
    console.log('Voice input clicked')
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Goal Selection
        return (
          <>
            {/* Question Header */}
            <div className="mb-8 text-center px-4">
              <h2 className="text-[26px] font-normal text-white leading-[1.2]">
                What is the primary goal<br />for your Ask Anything?
              </h2>
            </div>

            {/* Suggested Goals */}
            <div className="space-y-3 mb-8">
              {SUGGESTED_GOALS.map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleGoalSelect(goal)}
                  className={cn(
                    "w-full min-h-[52px] py-4 px-6 rounded-full text-white font-normal text-[16px]",
                    "bg-[#1a1a1a] border border-[#2a2a2a]",
                    "hover:bg-[#242424] hover:border-[#3a3a3a] active:scale-[0.98]",
                    "transition-all duration-200",
                    selectedGoal === goal && "bg-[#242424] border-[#3a3a3a]"
                  )}
                >
                  {goal}
                </button>
              ))}
            </div>

            {/* More Options Accordion */}
            <button
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="w-full py-3 px-6 text-white/60 font-light text-[14px] flex items-center justify-center gap-2 hover:text-white/80 transition-colors duration-200"
            >
              <span className="text-sm">✨</span>
              <span>{showMoreOptions ? '−' : '+'}</span>
              <span>More</span>
            </button>

            {/* Expanded More Options */}
            <div className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              showMoreOptions ? "max-h-[300px] opacity-100 mt-4" : "max-h-0 opacity-0"
            )}>
              <div className="space-y-3">
                {MORE_GOALS.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => handleGoalSelect(goal)}
                    className={cn(
                      "w-full min-h-[52px] py-4 px-6 rounded-full text-white font-normal text-[16px]",
                      "bg-[#1a1a1a] border border-[#2a2a2a]",
                      "hover:bg-[#242424] hover:border-[#3a3a3a] active:scale-[0.98]",
                      "transition-all duration-200",
                      selectedGoal === goal && "bg-[#242424] border-[#3a3a3a]"
                    )}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          </>
        )
        
      case 1: // Profile Setup (simplified for demo)
        return (
          <div className="space-y-8">
            <div className="text-center mb-8 px-4">
              <h2 className="text-[28px] font-normal text-white leading-[1.3]">
                Let&apos;s set up your profile
              </h2>
              <p className="text-[#999999] mt-3 text-[16px]">
                Choose a username for your Ask in Bio page
              </p>
            </div>
            
            <div className="space-y-3">
              <input
                type="text"
                value={data.username}
                onChange={(e) => setData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="username"
                className="w-full py-5 px-6 rounded-full text-[16px] bg-[#1a1a1a] text-white placeholder-[#666666] focus:outline-none focus:bg-[#242424] transition-all duration-200 min-h-[56px]"
              />
              <p className="text-[14px] text-[#666666] px-2 text-center">
                Your page will be: askinbio.com/{data.username || 'username'}
              </p>
            </div>
            
            <button
              onClick={handleNext}
              disabled={!data.username.trim()}
              className={cn(
                "w-full min-h-[56px] py-4 rounded-full font-normal text-[17px] transition-all duration-200",
                data.username.trim()
                  ? "bg-[#5EEAD4] text-black hover:bg-[#4FD1C7]"
                  : "bg-[#333333] text-[#666666] cursor-not-allowed"
              )}
            >
              Continue
            </button>
          </div>
        )
        
      case 2: // Complete
        return (
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-[#5EEAD4] bg-opacity-20 flex items-center justify-center">
                <span className="text-4xl">✨</span>
              </div>
            </div>
            
            <div className="px-4">
              <h2 className="text-[28px] font-normal text-white mb-3 leading-[1.3]">
                You&apos;re all set!
              </h2>
              <p className="text-[#999999] text-[16px]">
                Your Ask in Bio page is ready to help you {data.goal.toLowerCase()}
              </p>
            </div>
            
            <button
              onClick={handleNext}
              className="w-full min-h-[56px] py-4 rounded-full font-normal text-[17px] bg-[#5EEAD4] text-black hover:bg-[#4FD1C7] transition-all duration-200"
            >
              Create Account
            </button>
          </div>
        )
        
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden"
         style={{
           borderRadius: '24px',
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
           willChange: 'backdrop-filter'
         }}>
      {/* Progress Indicator - Fixed at top */}
      <div className="px-6 pt-6 pb-6">
        <div className="flex gap-2">
          {[0, 1, 2].map((step) => (
            <div
              key={step}
              className={cn(
                "h-1 flex-1 rounded-full transition-all duration-300",
                step <= currentStep
                  ? "bg-[#5EEAD4]"
                  : "bg-[#333333]"
              )}
            />
          ))}
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        <div className={cn(
          "transition-all duration-300",
          isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}>
          {renderStepContent()}
        </div>
      </div>

      {/* Fixed Input Field - Only show on goal selection step */}
      {currentStep === 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="relative">
            <input
              type="text"
              value={customGoal}
              onChange={(e) => {
                setCustomGoal(e.target.value)
                setSelectedGoal('')
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && customGoal.trim()) {
                  handleNext()
                }
              }}
              placeholder="Enter goal"
              className="w-full py-4 pl-6 pr-14 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-[#666666] focus:outline-none focus:bg-[#242424] focus:border-[#3a3a3a] transition-all duration-200 text-[16px] min-h-[52px]"
            />
            <button
              onClick={handleVoiceInput}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#666666] hover:text-white/80 transition-colors"
              aria-label="Voice input"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="8" y1="22" x2="16" y2="22" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}