'use client'

import { useState } from 'react'

interface GlassBottomBarProps {
  username: string
}

export default function GlassBottomBar({ username }: GlassBottomBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery)
    }
  }

  return (
    <div className="glass-footer glass-critical">
      {/* Glass overlay for extra effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
      
      {/* Main Content */}
      <div className="px-4 py-3 relative">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search links..."
              className="glass-search w-full text-white placeholder-white/50 text-sm"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <svg
                className="w-4 h-4 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-6">
          {/* Share Button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `@${username} - AskInBio`,
                  url: window.location.href
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
                // TODO: Show toast notification
              }
            }}
            className="
              inline-flex items-center space-x-2
              bg-white/10 backdrop-blur-[10px]
              border border-white/20 rounded-full
              shadow-[0_4px_24px_rgba(0,0,0,0.1)]
              hover:bg-white/15 hover:-translate-y-0.5
              active:translate-y-0 active:bg-white/[0.08]
              transition-all duration-300 ease-out
              px-3 py-2 text-white/80 hover:text-white
            "
            style={{
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 32px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            <span className="text-sm">Share</span>
          </button>
          
          {/* QR Code Button */}
          <button
            onClick={() => {
              // TODO: Show QR code modal
              console.log('Show QR code for:', window.location.href)
            }}
            className="
              inline-flex items-center space-x-2
              bg-white/10 backdrop-blur-[10px]
              border border-white/20 rounded-full
              shadow-[0_4px_24px_rgba(0,0,0,0.1)]
              hover:bg-white/15 hover:-translate-y-0.5
              active:translate-y-0 active:bg-white/[0.08]
              transition-all duration-300 ease-out
              px-3 py-2 text-white/80 hover:text-white
            "
            style={{
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 32px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
            <span className="text-sm">QR</span>
          </button>
        </div>
      </div>
      
      {/* iOS Safe Area */}
      <div className="h-safe" />
    </div>
  )
}