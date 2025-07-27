/**
 * Debounce Hook
 * 
 * Purpose:
 * - Delays execution of a value update
 * - Prevents excessive API calls
 * - Improves performance for search/validation
 * - Reduces server load
 * 
 * Features:
 * - Configurable delay
 * - TypeScript support
 * - Cleanup on unmount
 * - Memory efficient
 */

import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}