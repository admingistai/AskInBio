'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Loader2, Mic, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AISearchBarProps {
  onSearch: (query: string) => void
  isLoading?: boolean
  error?: string | null
  placeholder?: string
  username?: string
  className?: string
}

export default function AISearchBar({
  onSearch,
  isLoading = false,
  error = null,
  placeholder,
  username = 'user',
  className
}: AISearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const defaultPlaceholder = `Ask anything about @${username}...`

  // Focus search with "/" key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isFocused && e.target === document.body) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFocused])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && !isLoading) {
      onSearch(query.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleVoiceInput = () => {
    // TODO: Implement voice input functionality
    console.log('Voice input clicked - to be implemented')
  }

  const handleRetry = () => {
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <div className={cn("w-full space-y-2", className)}>
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div 
          className={cn(
            "relative glass-card-dark rounded-2xl transition-all duration-300",
            isFocused && "ring-2 ring-white/20",
            error && "ring-2 ring-red-500/50"
          )}
          style={{
            background: 'rgba(15, 15, 20, 0.8)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: `
              0 8px 32px 0 rgba(0, 0, 0, 0.4),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1),
              0 0 0 1px rgba(0, 0, 0, 0.1)
            `
          }}
        >
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-white/40 animate-spin" />
            ) : (
              <Search className="h-5 w-5 text-white/40" />
            )}
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder || defaultPlaceholder}
            disabled={isLoading}
            className={cn(
              "w-full bg-transparent border-0 outline-none",
              "text-white placeholder-white/50",
              "px-12 py-4 text-base",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2",
              "p-1.5 rounded-lg transition-all duration-200",
              "hover:bg-white/10 active:bg-white/5",
              "text-white/40 hover:text-white/60",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            disabled={isLoading}
            title="Voice input (coming soon)"
          >
            <Mic className="h-4 w-4" />
          </button>

          {/* Subtle animated background effect */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01]" />
            {isFocused && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 animate-pulse" />
            )}
          </div>
        </div>

        {/* Keyboard Shortcut Hint */}
        {!isFocused && !query && (
          <div className="absolute right-16 top-1/2 -translate-y-1/2">
            <div className="px-2 py-1 rounded-md bg-white/5 text-white/30 text-xs font-mono">
              /
            </div>
          </div>
        )}
      </form>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm flex-1">{error}</p>
          <button
            onClick={handleRetry}
            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center space-x-2 text-white/60">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        </div>
      )}
    </div>
  )
}