import { useEffect, useRef, useCallback } from 'react'

/**
 * useClickOutside
 * ───────────────
 * Fires a callback when the user clicks or touches outside a referenced element.
 * The classic pattern for closing dropdowns, modals, and popovers.
 *
 * Hooks used:
 *   useRef      — holds a stable DOM reference without triggering re-renders
 *   useEffect   — attaches/detaches the document-level listener
 *   useCallback — keeps the handler reference stable to avoid re-registering
 *                 the event listener on every render
 *
 * Real usage in this project: the "Click Outside" interactive demo in the
 * docs site shows a panel that dismisses when you click anywhere outside it.
 *
 * TypeScript patterns:
 *   - Generic constraint `T extends HTMLElement` so the ref is typed correctly
 *   - `RefObject<T>` return type for direct assignment to JSX `ref` props
 *
 * @example
 *   const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))
 *   return <div ref={ref}>...</div>
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: () => void,
  /** Which events to listen to — defaults to both mouse and touch */
  events: string[] = ['mousedown', 'touchstart'],
): React.RefObject<T> {
  const ref = useRef<T>(null)

  const stableHandler = useCallback(handler, [handler])

  useEffect(() => {
    const listener = (event: Event) => {
      // Do nothing if the click is inside the referenced element
      if (!ref.current || ref.current.contains(event.target as Node)) return
      stableHandler()
    }

    events.forEach((evt) => document.addEventListener(evt, listener, { passive: true }))
    return () => {
      events.forEach((evt) => document.removeEventListener(evt, listener))
    }
  }, [events, stableHandler])

  return ref
}
