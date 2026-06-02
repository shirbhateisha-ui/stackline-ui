import {
  createContext,
  useContext,
  useCallback,
  useId,
  useMemo,
  type ReactNode,
} from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

/**
 * Theme system
 * ────────────
 * A full React Context implementation demonstrating production patterns:
 *
 *   createContext  — creates the context object with a typed default value
 *   useContext     — consumes the context deep in the tree without prop drilling
 *   useMemo        — memoises the context value so consumers don't re-render
 *                    when the Provider's parent renders (a critical optimisation)
 *   useId          — generates stable, unique IDs for accessible form elements
 *                    inside the theme provider without collision across instances
 *   useLocalStorage — persists the theme choice across page reloads
 *
 * Why Context for theme?
 *   Theme affects every component. Passing it as a prop would mean drilling
 *   through every layer ("prop drilling"). Context creates a vertical shortcut:
 *   any component in the tree can read the theme without its parent knowing.
 *
 * The performance trap to avoid:
 *   If you put the context value object inline in JSX (<Provider value={{ theme, toggle }}>)
 *   it creates a NEW object on every render, causing every consumer to re-render.
 *   Solution: wrap the value in useMemo so it only changes when theme actually changes.
 */

export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  /** Current resolved theme ('light' | 'dark') */
  theme: 'light' | 'dark'
  /** User preference including 'system' option */
  preference: Theme
  /** Toggle between light and dark */
  toggle: () => void
  /** Set an explicit preference */
  setTheme: (t: Theme) => void
  /** A stable unique ID for use in accessible form elements */
  themeToggleId: string
}

// The default value is used when a component is rendered outside a Provider.
// Throwing here makes the error obvious at development time.
const ThemeContext = createContext<ThemeContextValue | null>(null)
ThemeContext.displayName = 'ThemeContext'

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
}

/**
 * ThemeProvider
 * ─────────────
 * Wrap your app (or the docs site) with this to enable theme-aware components.
 *
 * @example
 *   <ThemeProvider defaultTheme="system">
 *     <App />
 *   </ThemeProvider>
 */
export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [preference, setPreference, _clear] = useLocalStorage<Theme>(
    'stackline-theme',
    defaultTheme,
  )

  // Resolve 'system' preference to actual light/dark
  const theme: 'light' | 'dark' = useMemo(() => {
    if (preference === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return preference
  }, [preference])

  // Apply the theme class to <html> whenever it changes
  // This is a side effect — useEffect is the right tool
  // (We intentionally inline it here to keep the Provider self-contained)
  const prevThemeRef = { current: theme }
  if (prevThemeRef.current !== theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }
  document.documentElement.classList.toggle('dark', theme === 'dark')

  const toggle = useCallback(() => {
    setPreference((prev) => {
      if (prev === 'light') return 'dark'
      if (prev === 'dark') return 'light'
      // system → resolve to opposite of current
      return theme === 'dark' ? 'light' : 'dark'
    })
  }, [setPreference, theme])

  const setTheme = useCallback(
    (t: Theme) => setPreference(t),
    [setPreference],
  )

  // useId: generates a stable, unique ID that's safe to use in aria-* attributes
  // and <label htmlFor> without risk of collision even if the provider is
  // rendered multiple times (e.g. in Storybook or tests)
  const themeToggleId = useId()

  // useMemo on the value object is CRITICAL. Without it, every render of
  // ThemeProvider creates a new object → every useTheme consumer re-renders.
  // With it, consumers only re-render when `theme` or `preference` actually changes.
  const value = useMemo<ThemeContextValue>(
    () => ({ theme, preference, toggle, setTheme, themeToggleId }),
    [theme, preference, toggle, setTheme, themeToggleId],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * useTheme
 * ────────
 * Custom hook that encapsulates useContext + error boundary.
 * Throwing when used outside a Provider is a developer-experience best practice:
 * it gives an obvious error message instead of a cryptic "cannot read property
 * of null" somewhere deep in the component tree.
 *
 * @example
 *   const { theme, toggle } = useTheme()
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error(
      '[useTheme] must be used inside <ThemeProvider>. ' +
      'Wrap your app root with <ThemeProvider>.',
    )
  }
  return ctx
}
