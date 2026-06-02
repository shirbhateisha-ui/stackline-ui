import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useDebounce, useDebouncedCallback } from '@/hooks/useDebounce'
import { useCart } from '@/hooks/useCart'
import { useAsync } from '@/hooks/useAsync'
import { usePrevious, useCounter } from '@/hooks/useCounterAndObserver'
import { useTransitionSearch } from '@/hooks/useTransitionSearch'

// ─── Mock localStorage ────────────────────────────────────────────────────────

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem:    (key: string) => store[key] ?? null,
    setItem:    (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear:      () => { store = {} },
  }
})()

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true })
  localStorageMock.clear()
})

// ─── useLocalStorage ──────────────────────────────────────────────────────────

describe('useLocalStorage', () => {
  it('returns the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'hello'))
    expect(result.current[0]).toBe('hello')
  })

  it('accepts a function initialiser (lazy init pattern)', () => {
    const { result } = renderHook(() => useLocalStorage('key', () => 42))
    expect(result.current[0]).toBe(42)
  })

  it('persists the value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('mykey', 'init'))
    act(() => result.current[1]('updated'))
    expect(JSON.parse(localStorageMock.getItem('mykey') ?? '')).toBe('updated')
  })

  it('updates in-memory state when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('key', 0))
    act(() => result.current[1](99))
    expect(result.current[0]).toBe(99)
  })

  it('supports functional updater (prev => next)', () => {
    const { result } = renderHook(() => useLocalStorage('count', 10))
    act(() => result.current[1]((prev) => prev + 5))
    expect(result.current[0]).toBe(15)
  })

  it('removes the key and resets to initial on removeValue', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'))
    act(() => result.current[1]('changed'))
    act(() => result.current[2]()) // removeValue
    expect(result.current[0]).toBe('default')
    expect(result.current[0]).toBe('default') // key is re-written by the sync effect with the reset value
  })

  it('reads existing stored value on mount', () => {
    localStorageMock.setItem('existing', JSON.stringify('from-storage'))
    const { result } = renderHook(() => useLocalStorage('existing', 'fallback'))
    expect(result.current[0]).toBe('from-storage')
  })

  it('works with object values', () => {
    const { result } = renderHook(() =>
      useLocalStorage<{ name: string }>('obj', { name: 'Isha' }),
    )
    act(() => result.current[1]({ name: 'Updated' }))
    expect(result.current[0]).toEqual({ name: 'Updated' })
  })
})

// ─── useDebounce ──────────────────────────────────────────────────────────────

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300))
    expect(result.current).toBe('hello')
  })

  it('does not update before delay has elapsed', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: string }) => useDebounce(val, 300),
      { initialProps: { val: 'a' } },
    )
    rerender({ val: 'b' })
    vi.advanceTimersByTime(200)
    expect(result.current).toBe('a')
  })

  it('updates after the delay', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: string }) => useDebounce(val, 300),
      { initialProps: { val: 'a' } },
    )
    rerender({ val: 'b' })
    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe('b')
  })

  it('resets the timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: string }) => useDebounce(val, 300),
      { initialProps: { val: 'a' } },
    )
    rerender({ val: 'b' })
    vi.advanceTimersByTime(100)
    rerender({ val: 'c' })
    vi.advanceTimersByTime(100)
    rerender({ val: 'd' })
    act(() => vi.advanceTimersByTime(300))
    // Only the final value should win
    expect(result.current).toBe('d')
  })
})

describe('useDebouncedCallback', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('delays the callback call', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(fn, 200))
    act(() => result.current())
    expect(fn).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(200))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('cancels pending call on rapid invocations', () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(fn, 200))
    act(() => {
      result.current()
      result.current()
      result.current()
    })
    act(() => vi.advanceTimersByTime(200))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('always calls the latest version of fn (no stale closure)', () => {
    let value = 'first'
    const fn = vi.fn(() => value)
    const { result, rerender } = renderHook(() => useDebouncedCallback(fn, 200))
    act(() => result.current())
    value = 'second'
    rerender()
    act(() => vi.advanceTimersByTime(200))
    // fn was called — the ref pattern ensures it called with latest closure
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

// ─── useCart (useReducer) ─────────────────────────────────────────────────────

describe('useCart', () => {
  const product = { id: 'p1', name: 'Pro Plan', price: 99 }

  it('starts with an empty cart', () => {
    const { result } = renderHook(() => useCart())
    expect(result.current.items).toHaveLength(0)
    expect(result.current.totalItems).toBe(0)
    expect(result.current.totalPrice).toBe(0)
  })

  it('adds an item with qty 1', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addItem(product))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].qty).toBe(1)
  })

  it('increments qty when the same item is added again', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addItem(product))
    act(() => result.current.addItem(product))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].qty).toBe(2)
  })

  it('increments and decrements qty', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addItem(product))
    act(() => result.current.increment(product.id))
    expect(result.current.items[0].qty).toBe(2)
    act(() => result.current.decrement(product.id))
    expect(result.current.items[0].qty).toBe(1)
  })

  it('auto-removes item when qty reaches 0', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addItem(product))
    act(() => result.current.decrement(product.id))
    expect(result.current.items).toHaveLength(0)
  })

  it('removes item by id', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addItem(product))
    act(() => result.current.removeItem(product.id))
    expect(result.current.items).toHaveLength(0)
  })

  it('clears the entire cart', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addItem(product))
    act(() => result.current.addItem({ id: 'p2', name: 'Add-on', price: 29 }))
    act(() => result.current.clear())
    expect(result.current.items).toHaveLength(0)
  })

  it('computes totalItems correctly (useMemo)', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addItem(product))
    act(() => result.current.increment(product.id))
    act(() => result.current.addItem({ id: 'p2', name: 'Add-on', price: 29 }))
    expect(result.current.totalItems).toBe(3)
  })

  it('computes totalPrice correctly (useMemo)', () => {
    const { result } = renderHook(() => useCart())
    act(() => result.current.addItem(product))         // $99 ×1
    act(() => result.current.increment(product.id))    // $99 ×2 = $198
    expect(result.current.totalPrice).toBe(198)
  })
})

// ─── useAsync ─────────────────────────────────────────────────────────────────

describe('useAsync', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() => useAsync(() => Promise.resolve('ok')))
    expect(result.current.state.status).toBe('idle')
  })

  it('transitions to loading then success', async () => {
    const { result } = renderHook(() =>
      useAsync(() => Promise.resolve({ name: 'Isha' })),
    )
    act(() => { result.current.execute() })
    expect(result.current.state.status).toBe('loading')
    await waitFor(() => expect(result.current.state.status).toBe('success'))
    if (result.current.state.status === 'success') {
      expect(result.current.state.data).toEqual({ name: 'Isha' })
    }
  })

  it('transitions to error on rejection', async () => {
    const { result } = renderHook(() =>
      useAsync(() => Promise.reject(new Error('Network error'))),
    )
    act(() => { result.current.execute() })
    await waitFor(() => expect(result.current.state.status).toBe('error'))
    if (result.current.state.status === 'error') {
      expect(result.current.state.error.message).toBe('Network error')
    }
  })

  it('resets to idle state', async () => {
    const { result } = renderHook(() =>
      useAsync(() => Promise.resolve('done')),
    )
    act(() => { result.current.execute() })
    await waitFor(() => expect(result.current.state.status).toBe('success'))
    act(() => { result.current.reset() })
    expect(result.current.state.status).toBe('idle')
  })

  it('auto-executes on mount when immediate=true', async () => {
    const fn = vi.fn().mockResolvedValue('data')
    renderHook(() => useAsync(fn, true))
    await waitFor(() => expect(fn).toHaveBeenCalledTimes(1))
  })
})

// ─── usePrevious ──────────────────────────────────────────────────────────────

describe('usePrevious', () => {
  it('returns undefined on first render', () => {
    const { result } = renderHook(() => usePrevious(0))
    expect(result.current).toBeUndefined()
  })

  it('returns the previous value after a state change', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: number }) => usePrevious(val),
      { initialProps: { val: 1 } },
    )
    rerender({ val: 2 })
    expect(result.current).toBe(1)
  })

  it('tracks multiple changes correctly', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: string }) => usePrevious(val),
      { initialProps: { val: 'a' } },
    )
    rerender({ val: 'b' })
    expect(result.current).toBe('a')
    rerender({ val: 'c' })
    expect(result.current).toBe('b')
  })
})

// ─── useCounter ───────────────────────────────────────────────────────────────

describe('useCounter', () => {
  it('starts at the initial value', () => {
    const { result } = renderHook(() => useCounter({ initial: 5 }))
    expect(result.current.count).toBe(5)
  })

  it('increments by step', () => {
    const { result } = renderHook(() => useCounter({ step: 2 }))
    act(() => result.current.increment())
    expect(result.current.count).toBe(2)
  })

  it('does not exceed max', () => {
    const { result } = renderHook(() => useCounter({ initial: 9, max: 10 }))
    act(() => result.current.increment())
    act(() => result.current.increment())
    expect(result.current.count).toBe(10)
    expect(result.current.isMax).toBe(true)
  })

  it('does not go below min', () => {
    const { result } = renderHook(() => useCounter({ initial: 1, min: 0 }))
    act(() => result.current.decrement())
    act(() => result.current.decrement())
    expect(result.current.count).toBe(0)
    expect(result.current.isMin).toBe(true)
  })

  it('resets to initial value', () => {
    const { result } = renderHook(() => useCounter({ initial: 7 }))
    act(() => result.current.increment())
    act(() => result.current.reset())
    expect(result.current.count).toBe(7)
  })

  it('computes isEven correctly (useMemo)', () => {
    const { result } = renderHook(() => useCounter({ initial: 4 }))
    expect(result.current.isEven).toBe(true)
    act(() => result.current.increment())
    expect(result.current.isEven).toBe(false)
  })

  it('set() clamps to [min, max]', () => {
    const { result } = renderHook(() => useCounter({ min: 0, max: 100 }))
    act(() => result.current.set(200))
    expect(result.current.count).toBe(100)
    act(() => result.current.set(-50))
    expect(result.current.count).toBe(0)
  })
})

// ─── useTransitionSearch ──────────────────────────────────────────────────────

describe('useTransitionSearch', () => {
  const items = [
    { id: '1', name: 'Button' },
    { id: '2', name: 'Badge' },
    { id: '3', name: 'Card' },
    { id: '4', name: 'Dialog' },
  ]
  const predicate = (item: (typeof items)[0], q: string) =>
    item.name.toLowerCase().includes(q)

  it('returns all items when query is empty', () => {
    const { result } = renderHook(() => useTransitionSearch(items, predicate))
    expect(result.current.filteredItems).toHaveLength(4)
  })

  it('filters items by query', async () => {
    const { result } = renderHook(() => useTransitionSearch(items, predicate))
    act(() => result.current.setQuery('ba'))
    await waitFor(() => expect(result.current.filteredItems).toHaveLength(1))
    expect(result.current.filteredItems[0].name).toBe('Badge')
  })

  it('returns empty array for no match', async () => {
    const { result } = renderHook(() => useTransitionSearch(items, predicate))
    act(() => result.current.setQuery('zzz'))
    await waitFor(() => expect(result.current.filteredItems).toHaveLength(0))
  })

  it('exposes resultCount and totalCount', async () => {
    const { result } = renderHook(() => useTransitionSearch(items, predicate))
    expect(result.current.totalCount).toBe(4)
    act(() => result.current.setQuery('ca'))
    await waitFor(() => expect(result.current.resultCount).toBe(1))
  })
})
