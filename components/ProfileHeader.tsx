'use client'

import { User, Theme } from '@prisma/client'
import Image from 'next/image'

interface ProfileHeaderProps {
  user: User
  theme: Theme | null
}

export default function ProfileHeader({ user, theme }: ProfileHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 glass-header glass-critical">
      {/* Glass overlay for extra effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      
      {/* Status Bar Spacer */}
      <div className="h-11" />
      
      {/* Header Content */}
      <div className="px-6 py-4">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-3">
            {user.avatar ? (
              <div className="relative h-16 w-16 rounded-full overflow-hidden glass-card">
                <Image
                  src={user.avatar}
                  alt={user.displayName || user.username}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full glass-card flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  {(user.displayName || user.username)[0].toUpperCase()}
                </span>
              </div>
            )}
            
            {/* Floating animation */}
            <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
          </div>
          
          {/* User Info */}
          <div className="space-y-1">
            {user.displayName && (
              <h1 className="text-lg font-semibold text-white">
                {user.displayName}
              </h1>
            )}
            <p className="text-white/70 text-sm font-medium">
              @{user.username}
            </p>
            {user.bio && (
              <p className="text-white/60 text-sm max-w-xs leading-relaxed">
                {user.bio}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Subtle bottom border */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}