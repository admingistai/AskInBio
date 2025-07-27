'use client'

import { useState, useEffect } from 'react'
import { X, Link2, Type, Image as ImageIcon, Loader2 } from 'lucide-react'
import { createLink, updateLink } from '@/app/actions/links'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface LinkEditorProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  editingLink?: {
    id: string
    title: string
    url: string
    thumbnail?: string | null
  }
}

const defaultEmojis = ['🔗', '🌟', '💼', '📧', '🎨', '📱', '💻', '🎯', '🚀', '💡', '📸', '🎵', '🎮', '📚', '✨', '🔥']

export default function LinkEditor({ isOpen, onClose, onSuccess, editingLink }: LinkEditorProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  
  useEffect(() => {
    if (editingLink) {
      setTitle(editingLink.title)
      setUrl(editingLink.url)
      setThumbnail(editingLink.thumbnail || null)
    } else {
      setTitle('')
      setUrl('')
      setThumbnail(null)
    }
  }, [editingLink])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formData = {
        title: title.trim(),
        url: url.trim(),
        thumbnail,
      }
      
      const result = editingLink
        ? await updateLink(editingLink.id, formData)
        : await createLink(formData)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(result.message || 'Link saved successfully')
        onSuccess?.()
        handleClose()
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleClose = () => {
    setTitle('')
    setUrl('')
    setThumbnail(null)
    setShowEmojiPicker(false)
    onClose()
  }
  
  const selectEmoji = (emoji: string) => {
    setThumbnail(emoji)
    setShowEmojiPicker(false)
  }
  
  if (!isOpen) return null
  
  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 glass-overlay z-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-4 top-[50%] translate-y-[-50%] mx-auto max-w-md glass-modal rounded-2xl p-6 z-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {editingLink ? 'Edit Link' : 'Add New Link'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5 text-white/60" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
              <Type className="h-4 w-4" />
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My awesome link"
              className="glass-input-dashboard w-full"
              required
              disabled={isLoading}
              autoFocus
            />
          </div>
          
          {/* URL Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
              <Link2 className="h-4 w-4" />
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="glass-input-dashboard w-full"
              required
              disabled={isLoading}
            />
          </div>
          
          {/* Thumbnail/Emoji */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
              <ImageIcon className="h-4 w-4" />
              Icon or Emoji
            </label>
            <div className="flex items-center gap-3">
              {thumbnail ? (
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="h-12 w-12 glass-card flex items-center justify-center text-2xl hover:scale-110 transition-transform"
                >
                  {thumbnail}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="h-12 w-12 glass-card flex items-center justify-center text-white/40 hover:text-white/60 hover:scale-110 transition-all"
                >
                  <ImageIcon className="h-6 w-6" />
                </button>
              )}
              <span className="text-sm text-white/60">
                Click to {thumbnail ? 'change' : 'add'} emoji
              </span>
            </div>
            
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="mt-3 emoji-grid">
                {defaultEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => selectEmoji(emoji)}
                    className="emoji-button"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 font-medium transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={cn(
                "flex-1 px-4 py-2 rounded-lg font-medium transition-all",
                "glass-success hover:scale-105",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                <span>{editingLink ? 'Update' : 'Add'} Link</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}