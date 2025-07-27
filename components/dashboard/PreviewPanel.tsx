'use client'

import { useEffect, useRef } from 'react'
import { Smartphone, Monitor, RefreshCw } from 'lucide-react'
import { Link, User } from '@prisma/client'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PreviewPanelProps {
  user: User & { links: Link[] }
  deviceMode?: 'mobile' | 'desktop'
  onDeviceModeChange?: (mode: 'mobile' | 'desktop') => void
}

export default function PreviewPanel({ 
  user, 
  deviceMode = 'mobile',
  onDeviceModeChange 
}: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  // Refresh preview when links change
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }, [user.links])
  
  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }
  
  return (
    <div className="preview-frame rounded-2xl flex flex-col h-full">
      {/* Browser Chrome */}
      <div className="relative h-10 flex items-center justify-between px-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
        </div>
        
        {/* URL Bar */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="glass-pill px-4 py-1 text-xs text-white/60">
            askinbio.com/{user.username}
          </div>
        </div>
        
        {/* Device Toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDeviceModeChange?.('mobile')}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              deviceMode === 'mobile' 
                ? "glass-card text-white" 
                : "text-white/40 hover:text-white/60"
            )}
            title="Mobile view"
          >
            <Smartphone className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDeviceModeChange?.('desktop')}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              deviceMode === 'desktop' 
                ? "glass-card text-white" 
                : "text-white/40 hover:text-white/60"
            )}
            title="Desktop view"
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg text-white/40 hover:text-white/60 transition-colors ml-2"
            title="Refresh preview"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Preview Content */}
      <div className="flex-1 relative overflow-hidden bg-black/20">
        {/* Device Frame */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center p-6",
          deviceMode === 'mobile' && "max-w-[375px] mx-auto"
        )}>
          <div className={cn(
            "relative w-full h-full rounded-2xl overflow-hidden",
            "ring-1 ring-white/20"
          )}>
            {/* Fake Profile Preview - we'll use iframe in production */}
            <div className="h-full overflow-y-auto bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20">
              {/* Profile Header */}
              <div className="glass-surface-strong backdrop-blur-2xl px-6 py-8 text-center">
                <div className="relative h-24 w-24 mx-auto mb-4">
                  <div className="absolute inset-0 glass-ring rounded-full" />
                  <Image
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                    alt={user.displayName || user.username}
                    width={96}
                    height={96}
                    className="rounded-full"
                  />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {user.displayName || user.username}
                </h1>
                {user.bio && (
                  <p className="text-white/80 text-sm">{user.bio}</p>
                )}
              </div>
              
              {/* Links */}
              <div className="px-4 py-6 space-y-3">
                {user.links.filter(link => link.active).map((link) => (
                  <div
                    key={link.id}
                    className="glass-link flex items-center gap-4 p-4 rounded-2xl"
                  >
                    {link.thumbnail && (
                      <div className="h-10 w-10 glass-card flex items-center justify-center text-xl flex-shrink-0">
                        {link.thumbnail}
                      </div>
                    )}
                    <span className="flex-1 text-white font-medium">
                      {link.title}
                    </span>
                  </div>
                ))}
                
                {user.links.filter(link => link.active).length === 0 && (
                  <div className="glass-card p-8 text-center">
                    <p className="text-white/60 text-sm">
                      No active links yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Live Preview Label */}
        <div className="absolute top-4 left-4 glass-badge">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-white/80">Live Preview</span>
        </div>
      </div>
    </div>
  )
}