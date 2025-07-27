import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getUserById, getUserLinks } from '@/lib/db'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  // Get authenticated user
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    redirect('/login')
  }
  
  // Get user data and links
  const user = await getUserById(authUser.id)
  
  if (!user) {
    // User exists in auth but not in database - create profile with default values
    const { data: { user: profile } } = await supabase.auth.getUser()
    
    if (profile?.email) {
      // Auto-create profile with email-based username
      const username = profile.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '')
      const displayName = profile.user_metadata?.full_name || profile.user_metadata?.name || username
      
      try {
        const newUser = await prisma.user.create({
          data: {
            id: profile.id,
            username: `${username}_${Date.now()}`, // Ensure uniqueness
            displayName,
            bio: null,
            avatar: profile.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${username}`
          }
        })
        
        const links = await getUserLinks(newUser.id)
        const userWithLinks = { ...newUser, links: [] }
        return <DashboardClient user={userWithLinks} initialLinks={links} />
      } catch (error) {
        console.error('Failed to create user profile:', error)
        redirect('/error')
      }
    }
    
    redirect('/error')
  }
  
  const links = await getUserLinks(authUser.id)
  
  return <DashboardClient user={user} initialLinks={links} />
}