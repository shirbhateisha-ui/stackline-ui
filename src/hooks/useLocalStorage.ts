import { useState, useEffect, useCallback } from 'react'

/**
 * useLocalStorage
 * ───────────────
 * Persists state to localStorage with JSON serialization. Falls back
 * gracefully when storage is unavailable (SSR, private browsing).
 *
 * Hooks used:
 *   useState   — in-memory state that mirrors the stored value
 *   useEffect  — (1) writes to localStorage on change
 *                (2) syncs across tabs via StorageEvent
 *   useCallback — stable setter so consumers don't re-render needlessly
 *
 * Real usage in this project: persisting dark/light theme preference
 * so the user's choice survives a page reload.
 *
 * @example
 *   const [theme, setTheme, clearTheme] = useLocalStorage('theme', 'light')
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Lazy initialiser: read from storage once at mount, never again
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw !== null) return JSON.parse(raw) as T
    } catch {
      // Silently ignore — e.g. Safari private mode throws on access
    }
    return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue
  })

  // Write to storage every time the in-memory value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      console.warn(`[useLocalStorage] Could not persist "${key}"`)
    }
  }, [key, storedValue])

  // Keep multiple tabs in sync — when another tab writes the same key,
  // update our local state to match
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== window.localStorage) return
      try {
        if (e.newValue !== null) setStoredValue(JSON.parse(e.newValue) as T)
      } catch {
        console.warn(`[useLocalStorage] Ignoring invalid storage event for "${key}"`)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  // Stable setter — function identity never changes, so components that
  // receive it as a prop don't re-render when the parent does
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) =>
      typeof value === 'function' ? (value as (p: T) => T)(prev) : value,
    )
  }, [])

  // Remove from storage and reset to the original initial value
  const removeValue = useCallback(() => {
    try { window.localStorage.removeItem(key) } catch { /* ignore */ }
    setStoredValue(
      typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue,
    )
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
