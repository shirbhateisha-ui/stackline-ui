import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * AsyncState
 * ──────────
 * A discriminated union representing every possible state of an async operation.
 * This pattern (sometimes called a "loading state machine") is safer than three
 * separate booleans (isLoading, isError, isSuccess) because it's impossible to
 * represent invalid combinations like isLoading=true AND isError=true.
 */
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

/**
 * useAsync
 * ────────
 * Manages the full lifecycle of an async operation: idle → loading → success/error.
 * Handles the subtle "stale closure" problem: if the component unmounts or the
 * async function changes before the promise resolves, we discard the result
 * rather than calling setState on an unmounted component.
 *
 * Hooks used:
 *   useState    — the full AsyncState discriminated union
 *   useCallback — stable `execute` reference so callers can put it in
 *                 their own useEffect dependency arrays safely
 *   useRef      — tracks whether the component is still mounted to prevent
 *                 "Can't perform a React state update on an unmounted component"
 *   useEffect   — optionally auto-executes on mount when `immediate` is true
 *
 * TypeScript patterns:
 *   - Generic `T` inferred from the return type of `asyncFn`
 *   - Discriminated union narrowing (TS knows `data` only exists on 'success')
 *
 * Real usage in this project: the "Async Fetch" demo in the docs site
 * simulates an API call with random success/failure to show all states.
 *
 * @example
 *   const { state, execute } = useAsync(() => fetchUser(userId))
 *   if (state.status === 'loading') return <Spinner />
 *   if (state.status === 'error')   return <Alert>{state.error.message}</Alert>
 *   if (state.status === 'success') return <div>{state.data.name}</div>
 */
export function useAsync<T>(
  asyncFn: () => Promise<T>,
  /** If true, execute immediately on mount */
  immediate = false,
) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' })

  // Track mount status to avoid setState after unmount
  const isMountedRef = useRef(true)
  useEffect(() => {
    isMountedRef.current = true
    return () => { isMountedRef.current = false }
  }, [])

  // Stable execute function — safe to use in dependency arrays
  const execute = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const data = await asyncFn()
      // Guard: only update state if still mounted
      if (isMountedRef.current) setState({ status: 'success', data })
    } catch (err) {
      if (isMountedRef.current) {
        setState({
          status: 'error',
          error: err instanceof Error ? err : new Error(String(err)),
        })
      }
    }
  }, [asyncFn])

  // Auto-execute on mount when requested
  useEffect(() => {
    if (immediate) execute()
  }, [execute, immediate])

  const reset = useCallback(() => setState({ status: 'idle' }), [])

  return { state, execute, reset }
}
