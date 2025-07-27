import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPublicProfile } from '@/lib/db'
import ProfileHeader from '@/components/ProfileHeader'
import LinkButton from '@/components/LinkButton'
import GlassBottomBar from '@/components/GlassBottomBar'
import GlassDebugger from '@/components/GlassDebugger'
import GlassShimmerLoader from '@/components/GlassShimmerLoader'
import GlassCriticalStyles from '@/components/GlassCriticalStyles'

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

  return (
    <>
      {/* Critical Glass Styles */}
      <GlassCriticalStyles />
      
      <div className="min-h-screen color-mesh-bg color-mesh-animated relative overflow-hidden">
        {/* Fixed Glass Header */}
        <ProfileHeader 
          user={user}
          theme={theme}
        />
      
      {/* Scrollable Content Container */}
      <div className="min-h-screen grid grid-rows-[auto_1fr_auto]" style={{ minHeight: 'calc(100vh + 100px)' }}>
        {/* Header Spacer */}
        <div className="h-32" />
        
        {/* Main Content */}
        <div className="overflow-y-auto px-4 pb-safe">
          <div className="mx-auto max-w-md space-y-3">
            {user.links.length > 0 ? (
              user.links.map((link) => (
                <LinkButton
                  key={link.id}
                  link={link}
                  username={username}
                />
              ))
            ) : (
              <div className="glass-card p-8 text-center">
                <div className="text-white/60 text-sm">
                  No links available yet
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Fixed Glass Bottom Bar */}
        <GlassBottomBar username={username} />
      </div>
      
      {/* Debug Component */}
      <GlassDebugger />
      
      {/* Shimmer Loader */}
      <GlassShimmerLoader />
    </div>
    </>
  )
}