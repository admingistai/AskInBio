'use client'

import { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { User, Link, Theme } from '@prisma/client'
import QuickStats from '@/components/dashboard/QuickStats'
import LinkList from '@/components/dashboard/LinkList'
import LinkEditor from '@/components/dashboard/LinkEditor'
import PreviewPanel from '@/components/dashboard/PreviewPanel'
import ThemeToggle from '@/components/dashboard/ThemeToggle'
import { getUserLinksAction } from '@/app/actions/links'
import { toast } from 'sonner'

interface DashboardClientProps {
  user: User & { links: Link[] }
  initialLinks: Link[]
  theme?: Theme | null
}

export default function DashboardClient({ user, initialLinks, theme }: DashboardClientProps) {
  const [links, setLinks] = useState(initialLinks)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | undefined>()
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile')
  const [currentTheme, setCurrentTheme] = useState(theme)
  
  const refreshLinks = useCallback(async () => {
    try {
      const result = await getUserLinksAction()
      if (result.success && result.data) {
        setLinks(result.data)
      }
    } catch (error) {
      toast.error('Failed to refresh links')
    }
  }, [])
  
  const handleAddLink = () => {
    setEditingLink(undefined)
    setIsEditorOpen(true)
  }
  
  const handleEditLink = (link: Link) => {
    setEditingLink(link)
    setIsEditorOpen(true)
  }
  
  const handleEditorClose = () => {
    setIsEditorOpen(false)
    setEditingLink(undefined)
  }
  
  const handleEditorSuccess = () => {
    refreshLinks()
  }
  
  // Create a user object with updated links for preview
  const userWithLinks = {
    ...user,
    links: links
  }
  
  return (
    <>
      {/* Analytics Overview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <ThemeToggle onThemeChange={(isDarkMode) => {
            setCurrentTheme(prev => prev ? { ...prev, isDarkMode } : null)
          }} />
        </div>
        <QuickStats links={links} profileViews={0} />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Links Panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Your Links</h2>
            <button
              onClick={handleAddLink}
              className="glass-pill glass-pulse-hover flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              Add Link
            </button>
          </div>
          
          {/* Links List */}
          <div className="dashboard-panel p-6">
            {links.length > 0 ? (
              <LinkList 
                links={links} 
                onEdit={handleEditLink}
                onRefresh={refreshLinks}
              />
            ) : (
              <div className="text-center py-12">
                <div className="glass-card inline-flex p-4 rounded-2xl mb-4">
                  <Plus className="h-8 w-8 text-white/40" />
                </div>
                <p className="text-white/60 mb-4">No links yet</p>
                <button
                  onClick={handleAddLink}
                  className="glass-success px-6 py-2 rounded-lg font-medium hover:scale-105 transition-transform"
                >
                  Add your first link
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Live Preview</h2>
          </div>
          <div className="dashboard-panel p-0 h-[600px] lg:h-[calc(100vh-16rem)] sticky top-6">
            <PreviewPanel 
              user={userWithLinks}
              theme={currentTheme}
              deviceMode={deviceMode}
              onDeviceModeChange={setDeviceMode}
            />
          </div>
        </div>
      </div>
      
      {/* Link Editor Modal */}
      <LinkEditor
        isOpen={isEditorOpen}
        onClose={handleEditorClose}
        onSuccess={handleEditorSuccess}
        editingLink={editingLink}
      />
    </>
  )
}