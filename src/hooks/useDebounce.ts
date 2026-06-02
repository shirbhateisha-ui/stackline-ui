import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * useDebounce
 * ───────────
 * Returns a debounced snapshot of `value` that only updates after the user
 * has stopped changing it for `delay` ms. Ideal for search inputs so you
 * don't fire an API call on every keystroke.
 *
 * Hooks used:
 *   useState  — holds the debounced snapshot
 *   useEffect — schedules the delayed update and cancels the previous one
 *               on every new render (the cleanup return is the key pattern)
 *
 * Real usage in this project: the component search bar in the docs site
 * debounces the query before filtering the component list.
 *
 * @example
 *   const [query, setQuery] = useState('')
 *   const debounced = useDebounce(query, 400)
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    // Cleanup: cancel the scheduled update if value/delay changes before it fires
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

/**
 * useDebouncedCallback
 * ─────────────────────
 * Returns a stable debounced wrapper around any callback. Uses a ref to
 * always call the *latest* version of the function without it appearing in
 * the dependency array — preventing stale closures.
 *
 * Hooks used:
 *   useRef      — (1) stores latest fn without triggering re-renders
 *                 (2) holds the pending timer ID
 *   useEffect   — keeps fnRef in sync with latest fn after every render
 *   useCallback — returns a stable wrapper identity (never changes reference)
 *
 * @example
 *   const handleSearch = useDebouncedCallback((q: string) => {
 *     filterComponents(q)
 *   }, 400)
 */
export function useDebouncedCallback<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay = 300,
): (...args: Parameters<T>) => void {
  const fnRef = useRef<T>(fn)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync ref to latest fn without putting fn in useCallback deps
  useEffect(() => { fnRef.current = fn })

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => fnRef.current(...args), delay)
    },
    [delay],
  )
}
