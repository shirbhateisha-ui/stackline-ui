import { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } from 'react'

// ─── usePrevious ──────────────────────────────────────────────────────────────

/**
 * usePrevious
 * ───────────
 * Returns the value from the *previous* render. Useful for diff displays,
 * animation direction (did value go up or down?), and avoiding redundant effects.
 *
 * Hooks used:
 *   useRef    — holds the previous value WITHOUT causing a re-render when updated
 *   useEffect — runs after the render, so we capture the *current* value as the
 *               *previous* for the next render. The ordering is intentional:
 *               on render N, ref.current holds value from render N-1
 *
 * Why not useState? Because updating state causes another render, creating
 * an infinite loop. useRef updates are side-effect-free.
 *
 * Real usage in this project: the counter demo shows whether the value went
 * up (green) or down (red) compared to the last render.
 *
 * @example
 *   const prev = usePrevious(count) // always one render behind
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)

  // After each render, store the current value so it becomes "previous" next time
  useEffect(() => {
    ref.current = value
  }) // No dependency array — runs after every single render

  return ref.current
}

// ─── useCounter ───────────────────────────────────────────────────────────────

/**
 * useCounter
 * ──────────
 * Feature-rich counter demonstrating how useMemo and useCallback work together
 * to give you computed values and stable action functions at minimal cost.
 *
 * Hooks used:
 *   useState    — the canonical counter value
 *   useMemo     — derives isMin, isMax, isEven without re-computing unnecessarily
 *   useCallback — stable increment/decrement/reset functions; if passed to child
 *                 components wrapped in React.memo, those children won't re-render
 *                 unless the count actually changes
 *
 * Real usage in this project: the interactive counter widget in the docs.
 *
 * @example
 *   const { count, increment, decrement, reset, isMin, isMax } =
 *     useCounter({ initial: 0, min: 0, max: 10, step: 1 })
 */
interface UseCounterOptions {
  initial?: number
  min?: number
  max?: number
  step?: number
}

export function useCounter({
  initial = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
}: UseCounterOptions = {}) {
  const [count, setCount] = useState(initial)

  // useMemo: these are cheap derivations but show the pattern clearly.
  // In real code with expensive computations this avoids recalculating on
  // every render — only recomputes when `count`, `min`, or `max` changes.
  const isMin  = useMemo(() => count <= min, [count, min])
  const isMax  = useMemo(() => count >= max, [count, max])
  const isEven = useMemo(() => count % 2 === 0, [count])

  const increment = useCallback(
    () => setCount((c) => Math.min(max, c + step)),
    [max, step],
  )
  const decrement = useCallback(
    () => setCount((c) => Math.max(min, c - step)),
    [min, step],
  )
  const reset = useCallback(() => setCount(initial), [initial])
  const set   = useCallback(
    (val: number) => setCount(Math.min(max, Math.max(min, val))),
    [min, max],
  )

  return { count, increment, decrement, reset, set, isMin, isMax, isEven }
}

// ─── useIntersectionObserver ──────────────────────────────────────────────────

/**
 * useIntersectionObserver
 * ───────────────────────
 * Tracks whether a DOM element is visible within the viewport using the
 * native IntersectionObserver API. Fires once when visible (for entrance
 * animations) or continuously for infinite scroll / lazy loading.
 *
 * Hooks used:
 *   useState      — whether the element is currently intersecting
 *   useRef        — holds the DOM reference and the observer instance
 *   useEffect     — creates the observer on mount, cleans up on unmount
 *   useLayoutEffect (via useRef) — we attach to the DOM before the browser
 *     paints, which matters for elements already in the viewport on mount
 *
 * Real usage in this project: component cards in the docs animate in
 * (fade + slide up) as they scroll into view.
 *
 * @example
 *   const { ref, isVisible, hasBeenVisible } = useIntersectionObserver({
 *     threshold: 0.1,
 *     freezeOnceVisible: true, // stops observing after first intersection
 *   })
 *   return <div ref={ref} className={isVisible ? 'animate-fade-in' : 'opacity-0'} />
 */
interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  /** Stop observing once visible (good for entrance animations) */
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver<T extends HTMLElement = HTMLElement>({
  threshold = 0.1,
  root = null,
  rootMargin = '0px',
  freezeOnceVisible = false,
}: UseIntersectionObserverOptions = {}) {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        setIsVisible(visible)
        if (visible) {
          setHasBeenVisible(true)
          // Once visible and freeze mode: stop observing to avoid future callbacks
          if (freezeOnceVisible) observer.unobserve(el)
        }
      },
      { threshold, root, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, root, rootMargin, freezeOnceVisible])

  return { ref, isVisible, hasBeenVisible }
}

// ─── useLayoutEffect demo ─────────────────────────────────────────────────────

/**
 * useMeasure
 * ──────────
 * Measures a DOM element's dimensions synchronously after paint.
 * Shows the key difference between useLayoutEffect and useEffect:
 *
 *   useEffect     — runs AFTER the browser has painted. Fine for data fetching,
 *                   subscriptions, and anything the user doesn't see immediately.
 *
 *   useLayoutEffect — runs BEFORE the browser paints, synchronously after DOM
 *                   mutations. Essential when you need to read layout (getBoundingClientRect)
 *                   and then immediately update state to avoid a visual flicker.
 *
 * If you use useEffect for layout reads, you'll see a flash: the browser
 * paints with the old layout, then your effect fires and changes it, causing
 * a second paint. useLayoutEffect prevents this by reading + updating in one step.
 *
 * Real usage in this project: measuring the width of the docs sidebar panel.
 *
 * @example
 *   const { ref, width, height } = useMeasure<HTMLDivElement>()
 */
export function useMeasure<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // useLayoutEffect: reads layout synchronously — no flicker
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const { width, height } = el.getBoundingClientRect()
      setDimensions({ width: Math.round(width), height: Math.round(height) })
    }

    update() // measure immediately on mount

    // ResizeObserver fires when the element changes size
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, ...dimensions }
}
