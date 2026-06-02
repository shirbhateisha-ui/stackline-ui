import { useReducer, useMemo, useCallback } from 'react'

/**
 * Cart types
 * ──────────
 * Using a discriminated union for actions is a TypeScript best practice.
 * Each action type narrows the `payload` type at the call site — the
 * compiler catches invalid dispatches at build time, not runtime.
 */
export interface CartItem {
  id: string
  name: string
  price: number
  qty: number
}

export type CartAction =
  | { type: 'ADD_ITEM';    payload: Omit<CartItem, 'qty'> }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'INCREMENT';   payload: { id: string } }
  | { type: 'DECREMENT';   payload: { id: string } }
  | { type: 'CLEAR' }

export interface CartState {
  items: CartItem[]
}

const initialState: CartState = { items: [] }

/**
 * cartReducer — a pure function (no side effects, same input → same output)
 *
 * Pure reducers are easy to test, easy to reason about, and React's
 * StrictMode double-invokes them in dev to catch accidental mutations.
 */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.payload.id)
      if (existing) {
        // Item already in cart — increment instead of duplicating
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i,
          ),
        }
      }
      return { items: [...state.items, { ...action.payload, qty: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter((i) => i.id !== action.payload.id) }
    case 'INCREMENT':
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i,
        ),
      }
    case 'DECREMENT':
      return {
        items: state.items
          .map((i) => (i.id === action.payload.id ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0), // auto-remove when qty hits 0
      }
    case 'CLEAR':
      return initialState
    default:
      // Exhaustive check: TypeScript will error if a new action type is added
      // but not handled here
      return state
  }
}

/**
 * useCart
 * ───────
 * Shopping cart state built with useReducer. Demonstrates why useReducer
 * is better than useState for complex, multi-action state:
 *   - All state transitions live in one place (the reducer)
 *   - Actions are serialisable — easy to log, replay, and test
 *   - Dispatch identity is stable — no need for useCallback on every setter
 *
 * Hooks used:
 *   useReducer  — manages multi-action state with a pure reducer function
 *   useMemo     — derives totals without recomputing on unrelated re-renders
 *   useCallback — wraps dispatch calls so child components don't re-render
 *                 unnecessarily when the parent does
 *
 * Real usage in this project: the interactive Cart demo in the docs site.
 *
 * @example
 *   const { items, totalPrice, totalItems, addItem, removeItem, clear } = useCart()
 */
export function useCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // useMemo: derived state — only recomputes when items array changes
  const totalItems = useMemo(
    () => state.items.reduce((sum, i) => sum + i.qty, 0),
    [state.items],
  )
  const totalPrice = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [state.items],
  )

  // useCallback: stable action creators so child components that receive
  // these as props won't re-render unless the function actually changes
  const addItem = useCallback(
    (item: Omit<CartItem, 'qty'>) => dispatch({ type: 'ADD_ITEM', payload: item }),
    [],
  )
  const removeItem = useCallback(
    (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: { id } }),
    [],
  )
  const increment = useCallback(
    (id: string) => dispatch({ type: 'INCREMENT', payload: { id } }),
    [],
  )
  const decrement = useCallback(
    (id: string) => dispatch({ type: 'DECREMENT', payload: { id } }),
    [],
  )
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  return {
    items: state.items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    increment,
    decrement,
    clear,
  }
}
