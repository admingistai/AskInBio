'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SuggestedQuestionsProps {
  questions: string[]
  onQuestionClick: (question: string) => void
  isLoading?: boolean
  className?: string
}

export default function SuggestedQuestions({
  questions,
  onQuestionClick,
  isLoading = false,
  className
}: SuggestedQuestionsProps) {
  if (questions.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn("space-y-3", className)}
    >
      {/* Header */}
      <div className="flex items-center space-x-2 text-white/70">
        <MessageCircle className="h-4 w-4" />
        <span className="text-sm font-medium">You might also ask:</span>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {questions.map((question, index) => (
          <motion.button
            key={`${question}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: 0.3 + index * 0.1,
              ease: "easeOut"
            }}
            onClick={() => !isLoading && onQuestionClick(question)}
            disabled={isLoading}
            className={cn(
              "glass-chip group relative overflow-hidden",
              "px-4 py-3 rounded-xl text-left",
              "transition-all duration-300 ease-out",
              "hover:scale-[1.02] hover:-translate-y-0.5",
              "active:scale-[0.98] active:translate-y-0",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "disabled:hover:scale-100 disabled:hover:translate-y-0"
            )}
            style={{
              background: 'rgba(15, 15, 20, 0.6)',
              backdropFilter: 'blur(12px) saturate(180%)',
              WebkitBackdropFilter: 'blur(12px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: `
                0 4px 16px 0 rgba(0, 0, 0, 0.3),
                inset 0 0 0 1px rgba(255, 255, 255, 0.05)
              `
            }}
          >
            {/* Question Text */}
            <span className="relative z-10 text-sm text-white/80 group-hover:text-white/95 transition-colors duration-200">
              {question}
            </span>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-white/[0.08]" />
            </div>

            {/* Subtle Border Glow */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 rounded-xl border border-white/10" />
            </div>

            {/* Loading Shimmer */}
            {isLoading && (
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  style={{
                    animation: 'shimmer 2s infinite',
                    transform: 'translateX(-100%)'
                  }}
                />
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-2"
        >
          <div className="flex items-center space-x-2 text-white/40">
            <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </motion.div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </motion.div>
  )
}

// Skeleton Loader for Suggested Questions
export function SuggestedQuestionsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="glass-card-dark p-4 rounded-xl animate-pulse"
            style={{
              background: 'rgba(15, 15, 20, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <div 
              className="h-4 bg-white/10 rounded"
              style={{ 
                width: `${Math.random() * 40 + 60}%` 
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}