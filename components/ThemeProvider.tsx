'use client'

import { useEffect } from 'react'

interface ThemeProviderProps {
  isDarkMode: boolean
  children: React.ReactNode
}

export default function ThemeProvider({ isDarkMode, children }: ThemeProviderProps) {
  useEffect(() => {
    // Apply theme to document root for proper Tailwind dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return <>{children}</>
}