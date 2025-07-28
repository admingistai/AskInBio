'use client'

import { 
  Twitter, 
  Linkedin, 
  Github, 
  Instagram, 
  Youtube,
  Music
} from 'lucide-react'
import { SocialPlatform, getSocialPlatformColors } from '@/lib/utils/social-detection'
import { trackClick } from '@/app/actions/track-click'
import { useState } from 'react'

interface SocialIconProps {
  social: SocialPlatform & { id: string; title: string }
  username: string
}

export default function SocialIcon({ social, username }: SocialIconProps) {
  const [isPressed, setIsPressed] = useState(false)
  const colors = getSocialPlatformColors(social.platform)
  
  const handleClick = async () => {
    try {
      // Track the click
      await trackClick(social.id, {
        device: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop'
      })
      
      // Open the social link
      window.open(social.url, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Failed to track social click:', error)
      // Still open the link even if tracking fails
      window.open(social.url, '_blank', 'noopener,noreferrer')
    }
  }

  const getIcon = () => {
    const iconProps = {
      className: "w-5 h-5",
      style: { color: colors.text }
    }
    
    switch (social.platform) {
      case 'twitter':
        return <Twitter {...iconProps} />
      case 'linkedin':
        return <Linkedin {...iconProps} />
      case 'github':
        return <Github {...iconProps} />
      case 'instagram':
        return <Instagram {...iconProps} />
      case 'youtube':
        return <Youtube {...iconProps} />
      case 'tiktok':
        return <Music {...iconProps} />
      default:
        return <Github {...iconProps} />
    }
  }

  return (
    <button
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        relative w-10 h-10 max-[374px]:w-9 max-[374px]:h-9 rounded-xl
        backdrop-blur-md transition-all duration-200
        flex items-center justify-center flex-shrink-0
        ${isPressed ? 'scale-90' : 'hover:scale-105'}
        group overflow-hidden
      `}
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        boxShadow: `
          0 4px 16px 0 rgba(0, 0, 0, 0.1),
          inset 0 0 0 1px rgba(255, 255, 255, 0.05)
        `
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = colors.hover
        e.currentTarget.style.borderColor = colors.border
        e.currentTarget.style.boxShadow = `
          0 6px 20px 0 rgba(0, 0, 0, 0.15),
          inset 0 0 0 1px rgba(255, 255, 255, 0.1)
        `
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = colors.bg
        e.currentTarget.style.borderColor = colors.border
        e.currentTarget.style.boxShadow = `
          0 4px 16px 0 rgba(0, 0, 0, 0.1),
          inset 0 0 0 1px rgba(255, 255, 255, 0.05)
        `
      }}
      title={`Visit ${social.displayName}`}
      aria-label={`Visit ${social.displayName} profile`}
    >
      {getIcon()}
      
      {/* Ripple effect on click */}
      {isPressed && (
        <div 
          className="absolute inset-0 rounded-xl animate-ping"
          style={{ background: colors.hover }}
        />
      )}
      
      {/* Subtle glow effect */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${colors.text}20 0%, transparent 70%)`
        }}
      />
    </button>
  )
}