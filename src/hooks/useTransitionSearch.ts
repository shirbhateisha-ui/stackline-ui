import { useState, useTransition, useDeferredValue, useMemo } from 'react'

/**
 * useTransitionSearch
 * ───────────────────
 * Demonstrates React 18's concurrent features for keeping the UI responsive
 * during expensive filtering/rendering operations.
 *
 * The problem this solves:
 *   If you have 500 items to filter and render, synchronous filtering blocks
 *   the main thread. The input feels laggy because React can't re-render
 *   the input until filtering is done.
 *
 * The solution — two complementary hooks:
 *
 *   useTransition
 *   ─────────────
 *   Marks a state update as "non-urgent". React will keep the UI responsive
 *   (e.g. the input stays snappy) while the expensive work happens in the
 *   background. The `isPending` flag lets you show a loading indicator.
 *   Use when YOU control the state update that causes the expensive render.
 *
 *   useDeferredValue
 *   ────────────────
 *   Gives you a "lagging" copy of a value. React renders with the old value
 *   first (keeping the UI stable), then re-renders with the new value when
 *   the browser is idle. Use when you receive a prop you don't control.
 *
 * When to use which:
 *   - You control the state setter → useTransition
 *   - You receive a prop/value    → useDeferredValue
 *
 * Real usage in this project: the component search in the docs site filters
 * 200+ items. Without concurrent features the input stutters; with them it
 * stays instant and shows a subtle pending indicator on the results list.
 *
 * @example
 *   const { query, setQuery, filteredItems, isPending } =
 *     useTransitionSearch(items, (item, q) => item.name.includes(q))
 */
export function useTransitionSearch<T>(
  items: T[],
  predicate: (item: T, query: string) => boolean,
) {
  const [query, setQueryRaw] = useState('')
  const [isPending, startTransition] = useTransition()

  // The query that drives the actual filter — updated inside a transition
  // so React treats it as low-priority work
  const [filterQuery, setFilterQuery] = useState('')

  const handleSetQuery = (q: string) => {
    // Update the input immediately (high priority — user is typing)
    setQueryRaw(q)
    // Update the filter query in a transition (low priority — can be interrupted)
    startTransition(() => {
      setFilterQuery(q)
    })
  }

  // useDeferredValue: an additional layer — even if filterQuery updates,
  // the actual filtering below uses the deferred copy, which React may delay
  // further if the user is still interacting
  const deferredQuery = useDeferredValue(filterQuery)

  // useMemo: don't recompute the filtered list unless deferredQuery or items change
  const filteredItems = useMemo(() => {
    if (!deferredQuery.trim()) return items
    return items.filter((item) => predicate(item, deferredQuery.toLowerCase()))
  }, [items, deferredQuery, predicate])

  // isStale: true when the displayed results don't yet reflect the latest query
  // Use this to dim the results list while pending
  const isStale = deferredQuery !== query

  return {
    query,
    setQuery: handleSetQuery,
    filteredItems,
    isPending,
    isStale,
    resultCount: filteredItems.length,
    totalCount: items.length,
  }
}
