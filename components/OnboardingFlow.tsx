'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Mic } from 'lucide-react'
import { useRouter } from 'next/navigation'


// Types
interface OnboardingState {
  isActive: boolean
  currentPhase: 0 | 1 | 2 | 3
  selections: {
    goal?: string
    tone?: string
    customGoal?: string
  }
  animationStage: 'idle' | 'morphing' | 'active' | 'complete'
}

// Phase configurations
const phases = {
  1: {
    question: "What is the primary goal for your Ask Anything?",
    options: [
      "Increase Subscription Value",
      "Boost General Engagement", 
      "Drive Newsletter Signups"
    ],
    hasMore: true,
    hasInput: true
  },
  2: {
    question: "What tone should it answer in?",
    options: [
      "Strictly Journalistic",
      "Engaging Explainer",
      "Archival Researcher"
    ],
    hasMore: false,
    hasInput: true
  },
  3: {
    question: "Ready to launch.",
    summary: {
      title: "Newsroom Integrity Guardrails",
      description: "We've enabled your pre-configured safety protocols to prohibit speculation, block paywall bypass, and ensure proper attribution for all content, including Opinion pieces.",
      score: 98
    }
  }
}

// Animation variants
const containerVariants = {
  idle: {
    width: '400px',
    height: '56px',
    borderRadius: '28px',
    scale: 1,
    opacity: 1
  },
  morphing: {
    width: '500px',
    height: '60px',
    borderRadius: '24px',
    scale: 1.02,
    opacity: 0.95,
    transition: {
      duration: 0.4,
      ease: [0.32, 0.72, 0, 1] as const
    }
  },
  active: {
    width: '480px',
    height: 'auto',
    maxHeight: '75vh',
    minHeight: '400px',
    borderRadius: '20px',
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.32, 0.72, 0, 1] as const,
      delay: 0.05,
      height: {
        duration: 0.4,
        ease: [0.32, 0.72, 0, 1] as const
      }
    }
  }
}

const contentVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(10px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: 'blur(5px)',
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  }
}

const optionVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
    filter: 'blur(5px)'
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      delay: 0.3 + (i * 0.1),
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  })
}

// Sub-components
const ProgressIndicator = ({ currentPhase }: { currentPhase: number }) => (
  <div className="flex items-center gap-3 mb-8">
    {[1, 2, 3].map((phase) => (
      <div
        key={phase}
        className={`h-1 flex-1 rounded-full transition-all duration-500 ${
          phase <= currentPhase
            ? 'bg-gradient-to-r from-[#B8FFE3] to-[#C081FF]'
            : 'bg-white/10'
        }`}
      />
    ))}
  </div>
)

const QuestionHeader = ({ question }: { question: string }) => (
  <motion.h2
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={contentVariants}
    className="text-2xl font-medium text-white mb-8"
  >
    {question}
  </motion.h2>
)

const InputField = ({ placeholder = "Enter goal" }: { placeholder?: string }) => (
  <motion.div
    initial={{ opacity: 0, scaleX: 0.8, y: 10 }}
    animate={{ opacity: 1, scaleX: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.3, ease: [0.32, 0.72, 0, 1] as const }}
    className="relative mb-8"
  >
    <input
      type="text"
      placeholder={placeholder}
      className="w-full px-6 py-4 pr-12 bg-white/[0.05] backdrop-blur-[15px] backdrop-saturate-[180%] 
                 border border-white/10 rounded-full text-white placeholder-white/40
                 focus:outline-none focus:border-white/20 focus:bg-white/[0.08]
                 transition-all duration-300"
      style={{ WebkitBackdropFilter: 'blur(15px) saturate(180%)' }}
      // Prevent iOS from zooming when focusing on input
      onFocus={(e) => {
        if (window.visualViewport && window.visualViewport.scale !== 1) {
          e.currentTarget.blur()
          setTimeout(() => e.currentTarget.focus(), 100)
        }
      }}
    />
    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors">
      <Mic className="w-5 h-5" />
    </button>
  </motion.div>
)

const OptionButton = ({ 
  label, 
  onClick, 
  index,
  isMore = false 
}: { 
  label: string
  onClick: () => void
  index: number
  isMore?: boolean
}) => (
  <motion.button
    custom={index}
    initial="hidden"
    animate="visible"
    exit="hidden"
    variants={optionVariants}
    onClick={onClick}
    className={`w-full px-6 py-4 bg-white/[0.05] backdrop-blur-[15px] backdrop-saturate-[180%]
                border border-white/10 rounded-full text-white
                hover:bg-white/[0.08] hover:scale-[1.01]
                active:scale-[0.99] active:bg-white/[0.04]
                transition-all duration-300 ${isMore ? 'text-white/60' : ''}`}
    style={{ WebkitBackdropFilter: 'blur(15px) saturate(180%)' }}
  >
    {isMore && '✦ '}{label}
  </motion.button>
)

const ContinueButton = ({ onClick, label = "Continue" }: { onClick: () => void, label?: string }) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.6, ease: [0.32, 0.72, 0, 1] }}
    onClick={onClick}
    className="mt-8 px-10 py-3.5 bg-white/[0.08] backdrop-blur-[15px] backdrop-saturate-[180%]
               border border-white/10 rounded-full text-white font-medium
               hover:bg-white/[0.12] hover:scale-[1.02] hover:border-white/20
               active:scale-[0.98] active:bg-white/[0.06]
               transition-all duration-200 ease-out"
    style={{ WebkitBackdropFilter: 'blur(15px) saturate(180%)' }}
  >
    {label}
  </motion.button>
)

// Props interface
interface OnboardingFlowProps {
  onActiveChange?: (isActive: boolean) => void
}

// Main component
export default function OnboardingFlow({ onActiveChange }: OnboardingFlowProps = {}) {
  const [state, setState] = useState<OnboardingState>({
    isActive: false,
    currentPhase: 0,
    selections: {},
    animationStage: 'idle'
  })
  const [isLoaded, setIsLoaded] = useState(false)

  const controls = useAnimation()
  const router = useRouter()


  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Notify parent when onboarding becomes active
  useEffect(() => {
    onActiveChange?.(state.isActive)
  }, [state.isActive, onActiveChange])

  const handleStart = async () => {
    setState(prev => ({ ...prev, animationStage: 'morphing' }))
    await controls.start('morphing')
    
    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        isActive: true, 
        currentPhase: 1,
        animationStage: 'active'
      }))
      controls.start('active')
    }, 300)
  }

  const handleOptionSelect = (option: string, field: 'goal' | 'tone') => {
    setState(prev => ({
      ...prev,
      selections: { ...prev.selections, [field]: option }
    }))
    
    // Auto-advance from phase 1 to phase 2
    if (field === 'goal' && state.currentPhase === 1) {
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          currentPhase: 2
        }))
      }, 300)
    }
    
    // Auto-advance from phase 2 to phase 3
    if (field === 'tone' && state.currentPhase === 2) {
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          currentPhase: 3
        }))
      }, 300)
    }
  }

  const handleContinue = () => {
    if (state.currentPhase < 3) {
      setState(prev => ({
        ...prev,
        currentPhase: (prev.currentPhase + 1) as 1 | 2 | 3
      }))
    }
  }

  const handleClose = () => {
    setState({
      isActive: false,
      currentPhase: 0,
      selections: {},
      animationStage: 'idle'
    })
    controls.start('idle')
  }

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isActive) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [state.isActive])

  const currentPhaseConfig = state.currentPhase > 0 ? phases[state.currentPhase as keyof typeof phases] : null

  return (
    <motion.div
      animate={controls}
      initial="idle"
      variants={containerVariants}
      className={`fixed z-50
                  bg-white/[0.05] backdrop-blur-[15px] backdrop-saturate-[180%]
                  border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.1)]
                  cursor-pointer transition-all duration-300
                  ${state.isActive ? 'p-8 cursor-default top-[calc(50%-120px)] inset-x-0 mx-auto -translate-y-1/2 overflow-y-auto' : 'bottom-[max(60px,calc(env(safe-area-inset-bottom)+60px))] left-[calc(50%-200px)] flex items-center justify-center overflow-hidden'}
                  ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{ 
        WebkitBackdropFilter: 'blur(15px) saturate(180%)',
        transitionDelay: '600ms'
      }}
      onClick={!state.isActive ? handleStart : undefined}
    >
      <AnimatePresence mode="wait">
        {!state.isActive ? (
          <motion.span
            key="button-text"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="text-white text-center font-['Work_Sans'] text-base font-thin
                       leading-[140%] tracking-[-0.32px] select-none"
          >
            Get Started
          </motion.span>
        ) : (
          <motion.div
            key="onboarding-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {state.currentPhase > 0 && <ProgressIndicator currentPhase={state.currentPhase} />}
            
            <AnimatePresence mode="wait">
              {state.currentPhase === 1 && (
                <motion.div key="phase1">
                  <QuestionHeader question={phases[1].question} />
                  <InputField />
                  <div className="space-y-3">
                    {phases[1].options.map((option, index) => (
                      <OptionButton
                        key={option}
                        label={option}
                        onClick={() => handleOptionSelect(option, 'goal')}
                        index={index}
                      />
                    ))}
                    <OptionButton
                      label="More"
                      onClick={() => {}}
                      index={phases[1].options.length}
                      isMore
                    />
                  </div>
                </motion.div>
              )}

              {state.currentPhase === 2 && (
                <motion.div key="phase2">
                  <QuestionHeader question={phases[2].question} />
                  <InputField placeholder="Ask Anything" />
                  <div className="space-y-3">
                    {phases[2].options.map((option, index) => (
                      <OptionButton
                        key={option}
                        label={option}
                        onClick={() => handleOptionSelect(option, 'tone')}
                        index={index}
                      />
                    ))}
                  </div>
                  <div className="flex justify-center">
                    <ContinueButton onClick={handleContinue} />
                  </div>
                </motion.div>
              )}

              {state.currentPhase === 3 && (
                <motion.div key="phase3">
                  <QuestionHeader question={phases[3].question} />
                  <InputField placeholder="Ask Anything" />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="bg-white/[0.03] backdrop-blur-[10px] border border-white/10 rounded-2xl p-6 mb-6"
                  >
                    <h3 className="text-lg font-medium text-white mb-3">{phases[3].summary.title}</h3>
                    <p className="text-white/60 text-sm mb-4">{phases[3].summary.description}</p>
                    <div className="text-white/80">
                      Readiness Score: <span className="text-white font-medium">{phases[3].summary.score}/100</span>
                    </div>
                  </motion.div>
                  <div className="flex justify-center">
                    <ContinueButton 
                      onClick={() => {
                        // Save selections to sessionStorage for signup page
                        sessionStorage.setItem('onboardingSelections', JSON.stringify(state.selections))
                        router.push('/register')
                      }} 
                      label="Finish Setup" 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}