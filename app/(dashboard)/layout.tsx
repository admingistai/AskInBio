'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BarChart3, Settings, LogOut, Share2, Copy, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { signOut } from '@/app/actions/auth'
import Image from 'next/image'
import { useProfile } from '@/lib/hooks/use-profile'

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

const quickActions = [
  {
    title: 'Share Profile',
    icon: Share2,
    action: async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'My AskInBio Profile',
            text: 'Check out my links!',
            url: window.location.origin + '/demo', // TODO: Replace with actual username
          })
        } catch (err) {
          console.error('Error sharing:', err)
        }
      } else {
        toast.error('Sharing is not supported on this device')
      }
    }
  },
  {
    title: 'Copy Link',
    icon: Copy,
    action: async () => {
      const profileUrl = window.location.origin + '/demo' // TODO: Replace with actual username
      await navigator.clipboard.writeText(profileUrl)
      toast.success('Profile link copied!')
    }
  },
  {
    title: 'View Profile',
    icon: ExternalLink,
    href: '/demo', // TODO: Replace with actual username
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { profile } = useProfile()

  const handleSignOut = async () => {
    await signOut()
  }
  
  // Update quick actions with actual username
  const profileUsername = profile?.username || 'user'
  const quickActionsWithProfile = quickActions.map(action => {
    if (action.title === 'Share Profile') {
      return {
        ...action,
        action: async () => {
          if (navigator.share) {
            try {
              await navigator.share({
                title: 'My AskInBio Profile',
                text: 'Check out my links!',
                url: window.location.origin + '/' + profileUsername,
              })
            } catch (err) {
              console.error('Error sharing:', err)
            }
          } else {
            toast.error('Sharing is not supported on this device')
          }
        }
      }
    }
    if (action.title === 'Copy Link') {
      return {
        ...action,
        action: async () => {
          const profileUrl = window.location.origin + '/' + profileUsername
          await navigator.clipboard.writeText(profileUrl)
          toast.success('Profile link copied!')
        }
      }
    }
    if (action.title === 'View Profile') {
      return {
        ...action,
        href: '/' + profileUsername,
      }
    }
    return action
  })

  return (
    <div className="flex min-h-screen color-mesh-bg color-mesh-animated">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 glass-surface border-r border-white/10">
        <div className="flex h-full flex-col p-4">
          {/* Logo */}
          <div className="p-4 mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              AskInBio
            </h2>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                    isActive
                      ? 'glass-card shadow-glass text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
          
          {/* User Section */}
          <div className="glass-card p-4 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-10 w-10">
                <div className="absolute inset-0 glass-ring rounded-full" />
                <Image
                  src={profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUsername}`}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {profile?.displayName || profileUsername}
                </p>
                <p className="text-xs text-white/60 truncate">@{profileUsername}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition-all hover:text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header with Quick Actions */}
        <header className="glass-surface-strong border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">Dashboard</h1>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {quickActionsWithProfile.map((action) => {
                const Icon = action.icon
                
                if (action.href) {
                  return (
                    <Link
                      key={action.title}
                      href={action.href}
                      className="glass-pill flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{action.title}</span>
                    </Link>
                  )
                }
                
                return (
                  <button
                    key={action.title}
                    onClick={action.action}
                    className="glass-pill flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{action.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden glass-surface-strong border-t border-white/10">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-all',
                    isActive
                      ? 'text-white'
                      : 'text-white/60'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}