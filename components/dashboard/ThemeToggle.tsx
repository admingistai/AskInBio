'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon, Loader2 } from 'lucide-react'
import { updateThemeMode, getUserTheme } from '@/app/actions/theme'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  onThemeChange?: (isDarkMode: boolean) => void
}

export default function ThemeToggle({ onThemeChange }: ThemeToggleProps = {}) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Load current theme preference
  useEffect(() => {
    async function loadTheme() {
      try {
        const result = await getUserTheme()
        if (result.success && result.data) {
          setIsDarkMode(result.data.isDarkMode)
        }
      } catch (error) {
        console.error('Failed to load theme:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadTheme()
  }, [])

  const handleToggle = async () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    setIsSaving(true)

    try {
      const result = await updateThemeMode(newMode)
      if (result.success) {
        toast.success(newMode ? 'Dark mode enabled' : 'Light mode enabled')
        // Call the callback if provided
        onThemeChange?.(newMode)
      } else {
        // Revert on error
        setIsDarkMode(!newMode)
        toast.error(result.error || 'Failed to update theme')
      }
    } catch (error) {
      // Revert on error
      setIsDarkMode(!newMode)
      toast.error('Failed to update theme')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="glass-pill flex items-center gap-2 px-3 py-1.5">
        <Loader2 className="h-4 w-4 animate-spin text-white/60" />
      </div>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isSaving}
      className={cn(
        "glass-pill flex items-center gap-2 px-3 py-1.5",
        "transition-all duration-300 hover:scale-105",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isSaving && "pointer-events-none"
      )}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Icon Container with smooth transitions */}
      <div className="relative h-4 w-4">
        {/* Sun Icon - visible in light mode */}
        <Sun 
          className={cn(
            "absolute inset-0 h-4 w-4 transition-all duration-300",
            isDarkMode 
              ? "opacity-0 rotate-90 scale-0" 
              : "opacity-100 rotate-0 scale-100 text-yellow-400"
          )}
        />
        
        {/* Moon Icon - visible in dark mode */}
        <Moon 
          className={cn(
            "absolute inset-0 h-4 w-4 transition-all duration-300",
            isDarkMode 
              ? "opacity-100 rotate-0 scale-100 text-blue-400" 
              : "opacity-0 -rotate-90 scale-0"
          )}
        />

        {/* Loading spinner overlay */}
        {isSaving && (
          <Loader2 className="absolute inset-0 h-4 w-4 animate-spin text-white/60" />
        )}
      </div>

      {/* Text label */}
      <span className="text-xs font-medium text-white/80">
        {isDarkMode ? 'Dark' : 'Light'}
      </span>

      {/* Toggle indicator */}
      <div className="relative h-4 w-8 rounded-full bg-white/20">
        <div 
          className={cn(
            "absolute top-0.5 h-3 w-3 rounded-full bg-white",
            "transition-all duration-300 ease-out",
            isDarkMode ? "translate-x-4" : "translate-x-0.5"
          )}
        />
      </div>
    </button>
  )
}