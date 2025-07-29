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
import AISearchInterface from '@/components/profile/AISearchInterface'

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
              {/* AI-Powered Search Interface */}
              <AISearchInterface
                user={user}
                theme={theme}
                socialLinks={socialLinks}
              />
              
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