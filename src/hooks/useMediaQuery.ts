import { useSyncExternalStore, useCallback } from 'react'

/**
 * useMediaQuery
 * ─────────────
 * Reactively tracks a CSS media query. Returns true/false and re-renders
 * the component only when the match state actually changes.
 *
 * Hooks used:
 *   useSyncExternalStore — the modern React 18 hook for subscribing to any
 *     external store (here: the browser's MediaQueryList). Preferred over
 *     useState + useEffect because it correctly handles concurrent rendering
 *     and avoids "tearing" (where the UI shows inconsistent states).
 *   useCallback — stable subscribe/getSnapshot references required by
 *     useSyncExternalStore
 *
 * Why useSyncExternalStore over useState+useEffect?
 *   - Hydration-safe: the server snapshot prevents mismatches in SSR setups
 *   - Concurrent-safe: React can read the snapshot synchronously during render
 *   - Cleaner API: subscribe/getSnapshot separation is explicit about external data
 *
 * Real usage in this project: the docs header badge shows the current
 * breakpoint (mobile / tablet / desktop) updating in real time as you resize.
 *
 * @example
 *   const isMobile  = useMediaQuery('(max-width: 640px)')
 *   const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
 *   const isDark = useMediaQuery('(prefers-color-scheme: dark)')
 */
export function useMediaQuery(query: string): boolean {
  // subscribe: called by React to register/unregister a change listener
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', callback)
      return () => mql.removeEventListener('change', callback)
    },
    [query],
  )

  // getSnapshot: called synchronously by React during render to read current state
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  // getServerSnapshot: used during SSR — media queries can't run on the server
  const getServerSnapshot = useCallback(() => false, [])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/**
 * useBreakpoint
 * ─────────────
 * Convenience wrapper returning the active Tailwind-style breakpoint name.
 * Built entirely on top of useMediaQuery — a good example of composing hooks.
 *
 * @example
 *   const bp = useBreakpoint() // 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 */
export function useBreakpoint(): 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' {
  const is2xl = useMediaQuery('(min-width: 1536px)')
  const isXl  = useMediaQuery('(min-width: 1280px)')
  const isLg  = useMediaQuery('(min-width: 1024px)')
  const isMd  = useMediaQuery('(min-width: 768px)')
  const isSm  = useMediaQuery('(min-width: 640px)')

  if (is2xl) return '2xl'
  if (isXl)  return 'xl'
  if (isLg)  return 'lg'
  if (isMd)  return 'md'
  if (isSm)  return 'sm'
  return 'xs'
}
