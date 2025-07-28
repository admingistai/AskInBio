'use client'

import { User, Theme } from '@prisma/client'
import Image from 'next/image'
import SocialIcon from './SocialIcon'
import { SocialPlatform } from '@/lib/utils/social-detection'

interface ProfileHeaderProps {
  user: User
  theme: Theme | null
  socialLinks?: Array<SocialPlatform & { id: string; title: string }>
}

export default function ProfileHeader({ user, theme, socialLinks = [] }: ProfileHeaderProps) {
  return (
    <div className="glass-header glass-critical">
      {/* Glass overlay for extra effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      
      {/* Status Bar Spacer */}
      <div className="h-11" />
      
      {/* Compact Header Content */}
      <div className="px-4 py-2">
        <div className="flex items-start gap-3 min-h-[64px]">
          {/* Avatar - Left Side */}
          <div className="relative flex-shrink-0">
            {user.avatar ? (
              <div className="relative h-12 w-12 rounded-full overflow-hidden glass-card">
                <Image
                  src={user.avatar}
                  alt={user.displayName || user.username}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full glass-card flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  {(user.displayName || user.username)[0].toUpperCase()}
                </span>
              </div>
            )}
            
            {/* Subtle floating animation */}
            <div className="absolute inset-0 rounded-full bg-white/5 animate-pulse" />
          </div>
          
          {/* User Info - Center */}
          <div className="flex-1 min-w-0 pr-2">
            <div className="space-y-0.5">
              {user.displayName && (
                <h1 className="text-base font-semibold text-white truncate">
                  {user.displayName}
                </h1>
              )}
              <p className="text-white/70 text-sm font-medium">
                @{user.username}
              </p>
              {user.bio && (
                <p className="text-white/60 text-xs leading-relaxed line-clamp-2">
                  {user.bio}
                </p>
              )}
            </div>
          </div>
          
          {/* Social Icons - Right Side */}
          {socialLinks.length > 0 && (
            <div className="flex-shrink-0">
              <div className="social-icon-grid">
                {socialLinks.slice(0, 6).map((social) => (
                  <SocialIcon
                    key={social.id}
                    social={social}
                    username={user.username}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Subtle bottom border */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}