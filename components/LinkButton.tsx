'use client'

import { Link } from '@prisma/client'
import { useState } from 'react'
import Image from 'next/image'
import { trackClick } from '@/app/actions/track-click'

interface LinkButtonProps {
  link: Link
  username: string
}

export default function LinkButton({ link, username }: LinkButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  
  const handleClick = async () => {
    try {
      // Track the click
      await trackClick(link.id, {
        device: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop'
      })
      
      // Open the link
      window.open(link.url, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Failed to track click:', error)
      // Still open the link even if tracking fails
      window.open(link.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <button
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        glass-link glass-critical specular-highlight w-full glass-glow-subtle
        ${isPressed ? 'scale-95' : ''}
        transition-all duration-150 ease-out
        relative overflow-hidden group
        before:absolute before:inset-0 
        before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
        before:translate-x-[-100%] hover:before:translate-x-[100%]
        before:transition-transform before:duration-700
      `}
    >
      <div className="flex items-center justify-between">
        {/* Link Content */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          {/* Thumbnail */}
          <div className="w-12 h-12 rounded-xl glass-card flex-shrink-0 flex items-center justify-center">
            {link.thumbnail ? (
              <Image
                src={link.thumbnail}
                alt={link.title}
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            )}
          </div>
          
          {/* Link Info */}
          <div className="text-left min-w-0 flex-1">
            <h3 className="text-white font-medium text-base leading-tight truncate">
              {link.title}
            </h3>
            <p className="text-white/60 text-sm truncate">
              {new URL(link.url).hostname}
            </p>
          </div>
        </div>
        
        {/* Click Count & Arrow */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {link.clicks > 0 && (
            <div className="text-white/50 text-xs font-medium">
              {link.clicks}
            </div>
          )}
          
          {/* Chevron */}
          <svg
            className="w-5 h-5 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
      
      {/* Ripple effect on click */}
      {isPressed && (
        <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping" />
      )}
    </button>
  )
}