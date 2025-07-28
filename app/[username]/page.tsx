import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPublicProfile } from '@/lib/db'
import ProfileHeader from '@/components/ProfileHeader'
import LinkButton from '@/components/LinkButton'
import GlassBottomBar from '@/components/GlassBottomBar'
import GlassDebugger from '@/components/GlassDebugger'
import GlassShimmerLoader from '@/components/GlassShimmerLoader'
import GlassCriticalStyles from '@/components/GlassCriticalStyles'
import ThemeProvider from '@/components/ThemeProvider'
import { separateSocialLinks } from '@/lib/utils/social-detection'

interface ProfilePageProps {
  params: Promise<{
    username: string
  }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
  const profile = await getPublicProfile(username)
  
  if (!profile) {
    return {
      title: 'Profile Not Found',
    }
  }

  const { user } = profile
  const title = user.displayName ? `${user.displayName} (@${user.username})` : `@${user.username}`
  const description = user.bio || `Check out @${user.username}'s links`

  return {
    title: `${title} - AskInBio`,
    description,
    openGraph: {
      title,
      description,
      images: user.avatar ? [user.avatar] : undefined,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: user.avatar ? [user.avatar] : undefined,
    },
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params

  // Fetch user profile and links from database
  const profile = await getPublicProfile(username)
  
  if (!profile) {
    notFound()
  }

  const { user, theme } = profile

  // Separate social links from regular links
  const { socialLinks, regularLinks } = separateSocialLinks(user.links)

  return (
    <ThemeProvider isDarkMode={theme?.isDarkMode || false}>
      {/* Critical Glass Styles */}
      <GlassCriticalStyles />
      
      {/* Main Container with Safari-Compatible Grid Layout */}
      <div className="h-screen color-mesh-bg-dark grid grid-rows-[auto_1fr_auto] overflow-hidden safari-grid-container">
        {/* Compact Glass Header with Social Icons */}
        <ProfileHeader 
          user={user}
          theme={theme}
          socialLinks={socialLinks}
        />
        
        {/* Empty Scrollable Content Area - Safari Compatible */}
        <div className="overflow-y-auto safari-scroll-fix safari-grid-content min-h-0">
          <div className="px-4 pb-safe">
            <div className="mx-auto max-w-md py-8">
              {/* Placeholder Content for Future Generative UI */}
              <div className="glass-card-dark p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white/30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-white/80 text-lg font-medium">
                      Content Coming Soon
                    </h3>
                    <p className="text-white/50 text-sm max-w-xs mx-auto leading-relaxed">
                      This space is reserved for future generative UI experiences and interactive content.
                    </p>
                  </div>
                </div>
                
                {/* Subtle animated background effect */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01]" />
                  <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent animate-pulse" />
                  <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
              </div>
              
              {/* Development Note - Remove in production */}
              {process.env.NODE_ENV === 'development' && regularLinks.length > 0 && (
                <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="text-blue-300 text-xs font-medium mb-2">
                    Dev Note: {regularLinks.length} non-social links filtered out
                  </div>
                  <div className="space-y-1">
                    {regularLinks.slice(0, 3).map((link) => (
                      <div key={link.id} className="text-blue-200/60 text-xs truncate">
                        • {link.title}
                      </div>
                    ))}
                    {regularLinks.length > 3 && (
                      <div className="text-blue-200/40 text-xs">
                        ... and {regularLinks.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Fixed Glass Bottom Bar */}
        <GlassBottomBar username={username} />
        
        {/* Debug Component */}
        <GlassDebugger />
        
        {/* Shimmer Loader */}
        <GlassShimmerLoader />
      </div>
    </ThemeProvider>
  )
}