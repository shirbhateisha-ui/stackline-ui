/**
 * DocsApp — Stackline UI Interactive Documentation
 *
 * Every hook is imported and demonstrated in a live, interactive section.
 * Recruiters can read the hook source, then immediately see it running.
 */
import React, {
  useState,
  useCallback,
  useMemo,
  useId,
  useRef,
  Suspense,
} from 'react'
import {
  Bell, ChevronRight, Code2, Github, Minus, Moon, Package,
  Plus, Search, ShoppingCart, Sun, Trash2, Upload, Wifi,
  WifiOff, X, Zap, Check, RefreshCw, TrendingUp, TrendingDown,
} from 'lucide-react'

// ─── Components ───────────────────────────────────────────────────────────────
import { Button }                from '@/components/button/button'
import { Badge }                 from '@/components/badge/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/card/card'
import { Input }                 from '@/components/input/input'
import { Checkbox }              from '@/components/checkbox/checkbox'
import { Switch }                from '@/components/switch/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/tabs/tabs'
import { Avatar, Progress, Separator, Spinner, Alert, Text } from '@/components/misc/misc'
import { Tooltip }               from '@/components/tooltip/tooltip'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/accordion/accordion'
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogBody, DialogFooter,
  DialogTitle, DialogDescription,
} from '@/components/dialog/dialog'
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem,
} from '@/components/select/select'

// ─── Hooks ────────────────────────────────────────────────────────────────────
import { useLocalStorage }          from '@/hooks/useLocalStorage'
import { useDebounce, useDebouncedCallback } from '@/hooks/useDebounce'
import { useClickOutside }          from '@/hooks/useClickOutside'
import { useMediaQuery, useBreakpoint } from '@/hooks/useMediaQuery'
import { useCart }                  from '@/hooks/useCart'
import { useAsync }                 from '@/hooks/useAsync'
import { usePrevious, useCounter, useIntersectionObserver, useMeasure } from '@/hooks/useCounterAndObserver'
import { useTransitionSearch }      from '@/hooks/useTransitionSearch'

// ─── Context ──────────────────────────────────────────────────────────────────
import { ThemeProvider, useTheme }  from '@/context/ThemeContext'

// ─────────────────────────────────────────────────────────────────────────────
// Layout helpers
// ─────────────────────────────────────────────────────────────────────────────

function Section({
  id,
  title,
  description,
  hookLabel,
  children,
}: {
  id?: string
  title: string
  description?: string
  hookLabel?: string
  children: React.ReactNode
}) {
  // useIntersectionObserver: each section fades in as it enters the viewport
  const { ref, hasBeenVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.05,
    freezeOnceVisible: true,
  })

  return (
    <section
      id={id}
      ref={ref}
      className={[
        'mb-16 transition-all duration-700',
        hasBeenVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
      ].join(' ')}
    >
      <div className="mb-5 flex flex-wrap items-start gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="flex-1">
          <Text variant="h3" className="mb-0.5">{title}</Text>
          {description && <Text variant="small" color="muted">{description}</Text>}
        </div>
        {hookLabel && (
          <Badge variant="primary" size="sm" className="font-mono mt-1">
            {hookLabel}
          </Badge>
        )}
      </div>
      {children}
    </section>
  )
}

function Row({ children, wrap = true, className = '' }: {
  children: React.ReactNode; wrap?: boolean; className?: string
}) {
  return (
    <div className={`flex items-center gap-3 ${wrap ? 'flex-wrap' : ''} ${className}`}>
      {children}
    </div>
  )
}

function DemoCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <Card variant="ghost" padding="lg" className={`border border-neutral-200 dark:border-neutral-800 ${className}`}>
      {children}
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook demos — each is a self-contained component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ThemeDemo
 * Uses: useTheme (which internally uses useContext, useId, useMemo, useLocalStorage)
 * Shows the theme preference persisted to localStorage and applied to the page.
 */
function ThemeDemo() {
  const { theme, preference, toggle, setTheme, themeToggleId } = useTheme()
  const options: Array<{ value: 'light' | 'dark' | 'system'; label: string }> = [
    { value: 'light', label: '☀️ Light' },
    { value: 'dark', label: '🌙 Dark' },
    { value: 'system', label: '💻 System' },
  ]

  return (
    <DemoCard>
      <Text variant="label" className="mb-3 block">Theme Preference (persisted to localStorage)</Text>
      <div className="flex flex-wrap gap-2 mb-4">
        {options.map((opt) => (
          <button
            key={opt.value}
            id={opt.value === preference ? themeToggleId : undefined}
            onClick={() => setTheme(opt.value)}
            className={[
              'rounded-lg px-4 py-2 text-sm font-medium border transition-all',
              preference === opt.value
                ? 'bg-stack-600 text-white border-stack-600'
                : 'border-neutral-300 dark:border-neutral-700 hover:border-stack-400',
            ].join(' ')}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={toggle}
          leftIcon={theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        >
          Toggle
        </Button>
        <Text variant="small" color="muted">
          Resolved: <strong className="text-neutral-700 dark:text-neutral-300">{theme}</strong>
          {' '}· Preference: <strong className="text-neutral-700 dark:text-neutral-300">{preference}</strong>
          {' '}· aria-labelledby: <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{themeToggleId}</code>
        </Text>
      </div>
    </DemoCard>
  )
}

/**
 * LocalStorageDemo
 * Uses: useLocalStorage directly (useState + useEffect + useCallback)
 * Shows a note that survives a page reload.
 */
function LocalStorageDemo() {
  const [note, setNote, clearNote] = useLocalStorage('stackline-demo-note', '')
  const [visits, setVisits] = useLocalStorage('stackline-visits', 0)

  // increment visit count once on mount
  const hasIncremented = useRef(false)
  if (!hasIncremented.current) {
    hasIncremented.current = true
    setVisits((v) => v + 1)
  }

  return (
    <DemoCard>
      <Text variant="label" className="mb-3 block">Persistent Note (survives page reload)</Text>
      <div className="space-y-3">
        <Input
          placeholder="Type a note — it will persist after reload…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <Text variant="small" color="muted">
            Page visits: <strong className="text-neutral-700 dark:text-neutral-300">{visits}</strong>
            {' '}· Stored at key: <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">stackline-demo-note</code>
          </Text>
          <Button variant="ghost" size="sm" onClick={clearNote}>
            Clear
          </Button>
        </div>
      </div>
    </DemoCard>
  )
}

/**
 * DebounceDemo
 * Uses: useDebounce (useState + useEffect) and useDebouncedCallback (useRef + useCallback)
 * Shows the raw input vs the debounced value with a visible delay.
 */
function DebounceDemo() {
  const [raw, setRaw] = useState('')
  const debounced = useDebounce(raw, 500)
  const [callCount, setCallCount] = useState(0)

  // useDebouncedCallback: fires only after typing stops, not on every keystroke
  const handleDebouncedChange = useDebouncedCallback(() => {
    setCallCount((c) => c + 1)
  }, 500)

  return (
    <DemoCard>
      <Text variant="label" className="mb-3 block">Debounced Input (500ms delay)</Text>
      <Input
        placeholder="Type quickly…"
        value={raw}
        onChange={(e) => {
          setRaw(e.target.value)
          handleDebouncedChange()
        }}
        rightElement={raw !== debounced ? <Spinner size="sm" label="Debouncing" /> : undefined}
      />
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3">
          <Text variant="label" className="block mb-1">Raw value (instant)</Text>
          <code className="text-stack-600 dark:text-stack-400 break-all">{raw || '—'}</code>
        </div>
        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3">
          <Text variant="label" className="block mb-1">Debounced (after 500ms)</Text>
          <code className="text-stack-600 dark:text-stack-400 break-all">{debounced || '—'}</code>
        </div>
      </div>
      <Text variant="small" color="muted" className="mt-2">
        Debounced callback fired: <strong className="text-neutral-700 dark:text-neutral-300">{callCount}×</strong>
        {' '}(vs {raw.length} raw keystrokes)
      </Text>
    </DemoCard>
  )
}

/**
 * ClickOutsideDemo
 * Uses: useClickOutside (useRef + useEffect + useCallback)
 * Shows a panel that closes when you click anywhere outside it.
 */
function ClickOutsideDemo() {
  const [open, setOpen] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))

  return (
    <DemoCard>
      <Text variant="label" className="mb-3 block">Click Outside to Dismiss</Text>
      <div className="relative">
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open Panel
        </Button>
        {open && (
          <div
            ref={ref}
            className="absolute left-0 top-12 z-20 w-72 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl p-5 animate-scale-in"
          >
            <div className="flex items-center justify-between mb-3">
              <Text variant="h4" className="text-sm">Floating Panel</Text>
              <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
                <X size={14} />
              </button>
            </div>
            <Text variant="small" color="muted">
              Click anywhere outside this panel to dismiss it.
              The <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">useClickOutside</code> hook
              attaches a document-level mousedown listener and checks if the click
              target is outside the ref element.
            </Text>
          </div>
        )}
      </div>
    </DemoCard>
  )
}

/**
 * MediaQueryDemo
 * Uses: useSyncExternalStore (via useMediaQuery + useBreakpoint)
 * Shows real-time breakpoint and media query results as you resize.
 */
function MediaQueryDemo() {
  const isMobile         = useMediaQuery('(max-width: 640px)')
  const prefersDark      = useMediaQuery('(prefers-color-scheme: dark)')
  const prefersReduced   = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isLandscape      = useMediaQuery('(orientation: landscape)')
  const breakpoint       = useBreakpoint()

  const queries = [
    { label: 'max-width: 640px (mobile)', value: isMobile },
    { label: 'prefers-color-scheme: dark', value: prefersDark },
    { label: 'prefers-reduced-motion', value: prefersReduced },
    { label: 'orientation: landscape', value: isLandscape },
  ]

  return (
    <DemoCard>
      <div className="flex items-center justify-between mb-4">
        <Text variant="label" className="block">Live Media Queries (resize window)</Text>
        <Badge variant="primary">
          Breakpoint: <strong className="ml-1">{breakpoint}</strong>
        </Badge>
      </div>
      <div className="space-y-2">
        {queries.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between rounded-lg bg-neutral-50 dark:bg-neutral-800 px-4 py-2.5">
            <code className="text-xs text-neutral-600 dark:text-neutral-400">({label})</code>
            <Badge variant={value ? 'success' : 'default'} dot size="sm">
              {value ? 'true' : 'false'}
            </Badge>
          </div>
        ))}
      </div>
    </DemoCard>
  )
}

/**
 * CartDemo
 * Uses: useCart which internally uses useReducer + useMemo + useCallback
 * A real shopping cart with add/remove/qty controls and live totals.
 */
const PRODUCTS = [
  { id: 'p1', name: 'Design System License', price: 299 },
  { id: 'p2', name: 'Component Pack', price: 99 },
  { id: 'p3', name: 'Icon Set', price: 49 },
  { id: 'p4', name: 'Template Bundle', price: 149 },
]

function CartDemo() {
  const { items, totalItems, totalPrice, addItem, removeItem, increment, decrement, clear } = useCart()

  return (
    <DemoCard>
      <div className="flex items-center justify-between mb-4">
        <Text variant="label" className="block">Shopping Cart (useReducer)</Text>
        <Badge variant={totalItems > 0 ? 'primary' : 'default'}>
          <ShoppingCart size={11} className="mr-1" />
          {totalItems} item{totalItems !== 1 ? 's' : ''}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4 sm:grid-cols-4">
        {PRODUCTS.map((p) => {
          const inCart = items.find((i) => i.id === p.id)
          return (
            <button
              key={p.id}
              onClick={() => addItem(p)}
              className={[
                'rounded-lg border p-3 text-left transition-all text-sm',
                inCart
                  ? 'border-stack-500 bg-stack-50 dark:bg-stack-950'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-stack-300',
              ].join(' ')}
            >
              <p className="font-medium text-neutral-800 dark:text-neutral-200 text-xs leading-tight mb-1">{p.name}</p>
              <p className="text-stack-600 dark:text-stack-400 font-bold">${p.price}</p>
              {inCart && <Badge variant="primary" size="sm" className="mt-1">×{inCart.qty}</Badge>}
            </button>
          )
        })}
      </div>

      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 px-3 py-2">
              <span className="flex-1 text-sm font-medium">{item.name}</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => decrement(item.id)} aria-label="Decrease">
                  <Minus size={12} />
                </Button>
                <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                <Button variant="ghost" size="icon-sm" onClick={() => increment(item.id)} aria-label="Increase">
                  <Plus size={12} />
                </Button>
              </div>
              <span className="w-16 text-right text-sm font-semibold">${(item.price * item.qty).toLocaleString()}</span>
              <Button variant="ghost" size="icon-sm" onClick={() => removeItem(item.id)} aria-label="Remove">
                <X size={12} />
              </Button>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-3">
            <Button variant="ghost" size="sm" onClick={clear}>Clear cart</Button>
            <div className="text-right">
              <Text variant="small" color="muted">{totalItems} items</Text>
              <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                ${totalPrice.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Text variant="small" color="muted">Click a product to add it to the cart.</Text>
      )}
    </DemoCard>
  )
}

/**
 * AsyncDemo
 * Uses: useAsync (useState + useEffect + useCallback + useRef)
 * Simulates an API call with all lifecycle states: idle → loading → success/error.
 */
function AsyncDemo() {
  // Simulate an API call with 70% success rate
  const mockFetch = useCallback(() => {
    return new Promise<{ user: string; score: number; timestamp: string }>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.3) {
          resolve({
            user: ['alice', 'bob', 'carol', 'dave'][Math.floor(Math.random() * 4)],
            score: Math.floor(Math.random() * 100),
            timestamp: new Date().toLocaleTimeString(),
          })
        } else {
          reject(new Error('Network request failed — 503 Service Unavailable'))
        }
      }, 1200)
    })
  }, [])

  const { state, execute, reset } = useAsync(mockFetch)

  return (
    <DemoCard>
      <Text variant="label" className="mb-3 block">Async Data Fetching (discriminated union state)</Text>
      <div className="mb-4 flex gap-2">
        <Button
          onClick={execute}
          loading={state.status === 'loading'}
          disabled={state.status === 'loading'}
          leftIcon={<RefreshCw size={14} />}
        >
          {state.status === 'idle' ? 'Fetch Data' : 'Refetch'}
        </Button>
        {state.status !== 'idle' && (
          <Button variant="ghost" size="md" onClick={reset}>Reset</Button>
        )}
      </div>

      <div className="min-h-[80px]">
        {state.status === 'idle' && (
          <Text variant="small" color="muted">
            Press "Fetch Data" to trigger an async call. 70% success / 30% error rate.
          </Text>
        )}
        {state.status === 'loading' && (
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <Spinner size="md" />
            <span>Fetching from API…</span>
          </div>
        )}
        {state.status === 'success' && (
          <Alert variant="success" title="Success">
            User: <strong>{state.data.user}</strong> · Score:{' '}
            <strong>{state.data.score}</strong> · At{' '}
            <strong>{state.data.timestamp}</strong>
          </Alert>
        )}
        {state.status === 'error' && (
          <Alert variant="error" title="Request Failed">
            {state.error.message}
          </Alert>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        {(['idle', 'loading', 'success', 'error'] as const).map((s) => (
          <Badge
            key={s}
            variant={state.status === s ? 'primary' : 'default'}
            dot={state.status === s}
            size="sm"
          >
            {s}
          </Badge>
        ))}
      </div>
    </DemoCard>
  )
}

/**
 * CounterDemo
 * Uses: useCounter (useState + useMemo + useCallback) + usePrevious (useRef + useEffect)
 * Shows computed values, stable action references, and value diffing.
 */
function CounterDemo() {
  const { count, increment, decrement, reset, set, isMin, isMax, isEven } =
    useCounter({ initial: 0, min: -10, max: 10, step: 1 })

  const previous = usePrevious(count)
  const direction = previous === undefined
    ? null
    : count > previous
    ? 'up'
    : count < previous
    ? 'down'
    : null

  return (
    <DemoCard>
      <Text variant="label" className="mb-4 block">Counter (useReducer via useCounter + usePrevious)</Text>
      <div className="flex items-center gap-4 mb-5">
        <Button variant="outline" size="icon" onClick={decrement} disabled={isMin} aria-label="Decrement">
          <Minus size={16} />
        </Button>
        <div className="text-center min-w-[80px]">
          <p className="text-4xl font-bold tabular-nums leading-none text-neutral-900 dark:text-neutral-100">
            {count}
          </p>
          {direction && (
            <span className={direction === 'up' ? 'text-green-500' : 'text-red-500'}>
              {direction === 'up'
                ? <TrendingUp size={14} className="inline" />
                : <TrendingDown size={14} className="inline" />}
            </span>
          )}
        </div>
        <Button variant="outline" size="icon" onClick={increment} disabled={isMax} aria-label="Increment">
          <Plus size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-4 sm:grid-cols-4">
        {[
          { label: 'Previous', value: previous ?? '—' },
          { label: 'isMin', value: String(isMin) },
          { label: 'isMax', value: String(isMax) },
          { label: 'isEven', value: String(isEven) },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-center">
            <Text variant="label" className="block mb-0.5">{label}</Text>
            <code className="text-stack-600 dark:text-stack-400 font-bold">{String(value)}</code>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="ghost" size="sm" onClick={reset}>Reset</Button>
        {[-10, -5, 0, 5, 10].map((v) => (
          <Button key={v} variant="outline" size="xs" onClick={() => set(v)}>{v}</Button>
        ))}
      </div>
    </DemoCard>
  )
}

/**
 * TransitionSearchDemo
 * Uses: useTransitionSearch (useTransition + useDeferredValue + useMemo + useState)
 * Filters 200 items without blocking the input — shows isPending and isStale states.
 */
const COMPONENT_LIST = [
  'Button', 'Badge', 'Card', 'Input', 'Select', 'Checkbox', 'Switch',
  'Dialog', 'Modal', 'Tooltip', 'Tabs', 'Accordion', 'Avatar', 'Progress',
  'Separator', 'Spinner', 'Alert', 'Text', 'Breadcrumb', 'Pagination',
  'Table', 'DataGrid', 'Form', 'DatePicker', 'TimePicker', 'ColorPicker',
  'Slider', 'Range', 'Toggle', 'RadioGroup', 'Combobox', 'Autocomplete',
  'Command', 'Popover', 'Sheet', 'Drawer', 'Toast', 'Notification',
  'Skeleton', 'Placeholder', 'EmptyState', 'ErrorBoundary', 'Loading',
  'Carousel', 'Gallery', 'Image', 'Video', 'Audio', 'Icon', 'Avatar',
  'Tag', 'Chip', 'Token', 'Label', 'Heading', 'Paragraph', 'Code',
  'BlockQuote', 'List', 'Timeline', 'Steps', 'Wizard', 'Stepper',
  'NavigationMenu', 'Sidebar', 'Navbar', 'Footer', 'Header', 'Layout',
  'Grid', 'Flex', 'Stack', 'HStack', 'VStack', 'Box', 'Container',
  'Section', 'Article', 'Aside', 'Main', 'Hero', 'Feature', 'Pricing',
  'Testimonial', 'CTA', 'Banner', 'Announcement', 'Badge', 'Chip',
  'Status', 'Indicator', 'Dot', 'Ring', 'Pulse', 'Glow', 'Shimmer',
  'Gradient', 'Pattern', 'Texture', 'Background', 'Overlay', 'Backdrop',
  'Shadow', 'Border', 'Divider', 'Spacer', 'Gap', 'Padding', 'Margin',
]
// Deduplicate
const ALL_COMPONENTS = [...new Set(COMPONENT_LIST)].map((name, i) => ({
  id: String(i),
  name,
  category: ['Form', 'Overlay', 'Layout', 'Typography', 'Feedback', 'Navigation'][i % 6],
}))

function TransitionSearchDemo() {
  const { query, setQuery, filteredItems, isPending, isStale, resultCount, totalCount } =
    useTransitionSearch(
      ALL_COMPONENTS,
      (item, q) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q),
    )

  return (
    <DemoCard>
      <Text variant="label" className="mb-3 block">
        Non-blocking Search — useTransition + useDeferredValue ({totalCount} items)
      </Text>
      <Input
        placeholder={`Search ${totalCount} components…`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        leftIcon={<Search size={14} />}
        rightElement={isPending ? <Spinner size="sm" label="Filtering" /> : undefined}
      />
      <div className="mt-2 mb-3 flex items-center gap-2">
        <Text variant="small" color="muted">
          {resultCount} result{resultCount !== 1 ? 's' : ''}
        </Text>
        {isPending && <Badge variant="warning" size="sm" dot>Updating…</Badge>}
        {isStale && !isPending && <Badge variant="default" size="sm">Stale</Badge>}
      </div>
      <div
        className={[
          'grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto transition-opacity duration-200 sm:grid-cols-4',
          isStale ? 'opacity-50' : 'opacity-100',
        ].join(' ')}
      >
        {filteredItems.slice(0, 48).map((item) => (
          <div
            key={item.id}
            className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate"
          >
            {item.name}
          </div>
        ))}
        {filteredItems.length > 48 && (
          <div className="col-span-full text-center text-xs text-neutral-400 py-2">
            +{filteredItems.length - 48} more
          </div>
        )}
        {filteredItems.length === 0 && (
          <div className="col-span-full text-center text-xs text-neutral-400 py-6">
            No components match "{query}"
          </div>
        )}
      </div>
    </DemoCard>
  )
}

/**
 * MeasureDemo
 * Uses: useMeasure (useLayoutEffect + useRef + useState) to measure a resizable element
 */
function MeasureDemo() {
  const { ref, width, height } = useMeasure<HTMLDivElement>()
  const [cols, setCols] = useState(2)

  return (
    <DemoCard>
      <div className="flex items-center justify-between mb-3">
        <Text variant="label" className="block">useMeasure — useLayoutEffect reads layout before paint</Text>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((n) => (
            <Button key={n} size="xs" variant={cols === n ? 'primary' : 'outline'} onClick={() => setCols(n)}>
              {n}col
            </Button>
          ))}
        </div>
      </div>
      <div
        ref={ref}
        className="rounded-lg border-2 border-dashed border-stack-300 dark:border-stack-700 p-4 transition-all"
        style={{ columns: cols }}
      >
        {Array.from({ length: cols * 2 }, (_, i) => (
          <div key={i} className="mb-2 break-inside-avoid rounded bg-stack-100 dark:bg-stack-950 p-2 text-xs text-stack-700 dark:text-stack-300">
            Item {i + 1}
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-4">
        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-center">
          <Text variant="label" className="block">Width</Text>
          <code className="text-stack-600 dark:text-stack-400 font-bold">{width}px</code>
        </div>
        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-center">
          <Text variant="label" className="block">Height</Text>
          <code className="text-stack-600 dark:text-stack-400 font-bold">{height}px</code>
        </div>
        <Text variant="small" color="muted" className="flex-1 self-center">
          useLayoutEffect reads getBoundingClientRect() <em>before</em> the browser paints,
          preventing the one-frame flicker you'd get with useEffect.
        </Text>
      </div>
    </DemoCard>
  )
}

/**
 * UseIdDemo
 * Uses: useId — stable unique IDs for accessible form elements
 */
function UseIdDemo() {
  // useId: generates ":r0:", ":r1:" etc — stable across renders,
  // unique across multiple component instances, safe for SSR hydration
  const emailId  = useId()
  const nameId   = useId()
  const termsId  = useId()

  return (
    <DemoCard>
      <Text variant="label" className="mb-3 block">
        useId — accessible form IDs without manual string management
      </Text>
      <div className="space-y-4 max-w-sm">
        <div className="space-y-1">
          <label htmlFor={emailId} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Email
          </label>
          <Input id={emailId} type="email" placeholder="you@example.com" />
          <Text variant="small" color="muted">
            id: <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{emailId}</code>
          </Text>
        </div>
        <div className="space-y-1">
          <label htmlFor={nameId} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Name
          </label>
          <Input id={nameId} placeholder="Full name" />
          <Text variant="small" color="muted">
            id: <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{nameId}</code>
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id={termsId} className="rounded" />
          <label htmlFor={termsId} className="text-sm text-neutral-700 dark:text-neutral-300">
            Accept terms
          </label>
          <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded text-neutral-500">
            {termsId}
          </code>
        </div>
      </div>
      <Alert variant="info" className="mt-4">
        useId ensures IDs are unique even when the same form component is rendered multiple
        times on the same page — something hand-written strings can't guarantee.
      </Alert>
    </DemoCard>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Component showcase sections (Button, Badge, etc.)
// ─────────────────────────────────────────────────────────────────────────────

function ComponentShowcase() {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [progress, setProgress] = useState(60)

  // useMemo: compute the list of button variants to render — in real use
  // this might be derived from user permissions or feature flags
  const buttonVariants = useMemo(() => [
    { variant: 'primary' as const, label: 'Primary' },
    { variant: 'secondary' as const, label: 'Secondary' },
    { variant: 'outline' as const, label: 'Outline' },
    { variant: 'ghost' as const, label: 'Ghost' },
    { variant: 'destructive' as const, label: 'Destructive' },
  ], [])

  const simulateLoad = useCallback((id: string) => {
    setLoadingId(id)
    setTimeout(() => setLoadingId(null), 1600)
  }, [])

  return (
    <>
      <Section title="Button" description="6 variants · 8 sizes · loading state · icon slots · polymorphic asChild">
        <div className="space-y-5">
          <div>
            <Text variant="label" className="mb-3 block">Variants</Text>
            <Row>
              {buttonVariants.map(({ variant, label }) => (
                <Button key={variant} variant={variant}>{label}</Button>
              ))}
            </Row>
          </div>
          <div>
            <Text variant="label" className="mb-3 block">Sizes</Text>
            <Row>
              {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
                <Button key={size} size={size}>{size.toUpperCase()}</Button>
              ))}
            </Row>
          </div>
          <div>
            <Text variant="label" className="mb-3 block">States & icons</Text>
            <Row>
              <Button leftIcon={<Plus size={15} />}>Add item</Button>
              <Button rightIcon={<Upload size={15} />} variant="outline">Upload</Button>
              <Button
                loading={loadingId === 'save'}
                onClick={() => simulateLoad('save')}
              >
                {loadingId === 'save' ? 'Saving…' : 'Save changes'}
              </Button>
              <Button disabled>Disabled</Button>
              <Tooltip content="Settings panel">
                <Button size="icon" variant="outline" aria-label="Settings">
                  <Zap size={16} />
                </Button>
              </Tooltip>
              <Button asChild variant="link">
                <a href="#">Link button</a>
              </Button>
            </Row>
          </div>
        </div>
      </Section>

      <Section title="Badge" description="8 variants · dot indicator · 3 sizes">
        <div className="space-y-4">
          <Row>
            {(['default', 'primary', 'success', 'warning', 'error', 'info', 'outline', 'solid'] as const).map((v) => (
              <Badge key={v} variant={v}>{v}</Badge>
            ))}
          </Row>
          <Row>
            <Badge variant="success" dot>Online</Badge>
            <Badge variant="error" dot>Offline</Badge>
            <Badge variant="warning" dot>Away</Badge>
          </Row>
        </div>
      </Section>

      <Section title="Input & Select" description="Label · hint · error · icon slots · keyboard-navigable select">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label="Email address" placeholder="you@example.com" />
          <Input label="Search" placeholder="Search…" leftIcon={<Search size={14} />} />
          <Input label="Username" error="Username is already taken" defaultValue="isha.bhate" />
          <Input label="Password" hint="Minimum 8 characters" type="password" required />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Framework</label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent>
                {['React', 'Vue', 'Svelte', 'SolidJS', 'Angular'].map((f) => (
                  <SelectItem key={f} value={f.toLowerCase()}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Section title="Checkbox & Switch" description="Accessible form controls with labels, descriptions, and all states">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="space-y-4">
            <Checkbox label="Accept terms and conditions" description="You agree to our privacy policy." />
            <Checkbox label="Subscribe to changelog" defaultChecked />
            <Checkbox label="Indeterminate (partial selection)" indeterminate />
            <Checkbox label="Disabled option" disabled />
          </div>
          <div className="space-y-4">
            <Switch label="Enable notifications" description="You'll receive email alerts." defaultChecked />
            <Switch label="Dark mode" labelPosition="left" />
            <Switch label="Disabled" disabled />
          </div>
        </div>
      </Section>

      <Section title="Tabs" description="Three visual styles: line (default), pill, and card">
        <div className="space-y-8">
          <Tabs defaultValue="acc">
            <TabsList variant="line">
              {['Account', 'Security', 'Billing'].map((t) => (
                <TabsTrigger key={t} value={t.toLowerCase()} variant="line">{t}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="account"><Text color="muted">Manage your account settings.</Text></TabsContent>
            <TabsContent value="security"><Text color="muted">Update password and 2FA.</Text></TabsContent>
            <TabsContent value="billing"><Text color="muted">View invoices and payment methods.</Text></TabsContent>
          </Tabs>
          <Tabs defaultValue="overview">
            <TabsList variant="pill">
              {['Overview', 'Analytics', 'Reports'].map((t) => (
                <TabsTrigger key={t} value={t.toLowerCase()} variant="pill">{t}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="overview"><Text color="muted">Overview content.</Text></TabsContent>
            <TabsContent value="analytics"><Text color="muted">Analytics content.</Text></TabsContent>
            <TabsContent value="reports"><Text color="muted">Reports content.</Text></TabsContent>
          </Tabs>
        </div>
      </Section>

      <Section title="Dialog" description="Accessible modal with focus trap, animated overlay, flexible slot layout">
        <Row>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Delete dialog</Button>
            </DialogTrigger>
            <DialogContent size="sm">
              <DialogHeader>
                <DialogTitle>Delete project?</DialogTitle>
                <DialogDescription>This action cannot be undone. All data will be permanently removed.</DialogDescription>
              </DialogHeader>
              <DialogBody>
                <Alert variant="warning">All 14 team members will lose access immediately.</Alert>
              </DialogBody>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive" leftIcon={<Trash2 size={14} />}>Delete project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create workspace</Button>
            </DialogTrigger>
            <DialogContent size="sm">
              <DialogHeader>
                <DialogTitle>New workspace</DialogTitle>
                <DialogDescription>Set up a workspace for your team.</DialogDescription>
              </DialogHeader>
              <DialogBody className="space-y-4">
                <Input label="Workspace name" placeholder="e.g. Acme Inc." />
                <Input label="Invite teammates" placeholder="email@company.com" />
              </DialogBody>
              <DialogFooter>
                <Button className="w-full">Create workspace</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Row>
      </Section>

      <Section title="Avatar & Progress" description="User avatars with status indicators · linear progress with semantic colors">
        <div className="space-y-6">
          <Row>
            {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
              <Avatar key={size} size={size} fallback={size.toUpperCase().slice(0, 2)} />
            ))}
          </Row>
          <Row>
            {(['online', 'busy', 'away', 'offline'] as const).map((status) => (
              <div key={status} className="flex flex-col items-center gap-1">
                <Avatar fallback={status[0].toUpperCase()} status={status} />
                <Text variant="small" color="muted">{status}</Text>
              </div>
            ))}
          </Row>
          <div className="space-y-3 max-w-md">
            {([
              { value: progress, color: 'default' as const, label: 'Overall progress' },
              { value: 78, color: 'success' as const, label: 'Storage used' },
              { value: 44, color: 'warning' as const, label: 'Quota remaining' },
              { value: 92, color: 'error' as const, label: 'Memory usage' },
            ]).map(({ value, color, label }) => (
              <Progress key={label} value={value} color={color} showLabel label={label} />
            ))}
            <div className="flex gap-2 pt-1">
              <Button size="sm" variant="outline" onClick={() => setProgress((p) => Math.max(0, p - 10))}>−10%</Button>
              <Button size="sm" variant="outline" onClick={() => setProgress((p) => Math.min(100, p + 10))}>+10%</Button>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Alert & Accordion" description="Semantic alerts · animated collapsible content">
        <div className="space-y-6">
          <div className="space-y-3 max-w-xl">
            <Alert variant="info" title="New version available">Stackline UI v1.1 ships 3 new components.</Alert>
            <Alert variant="success" title="Deployment complete">Your changes are live and serving 100% of traffic.</Alert>
            <Alert variant="warning" title="API rate limit approaching" dismissible>89% of monthly quota used.</Alert>
            <Alert variant="error" title="Payment failed">Card declined — please update billing info.</Alert>
          </div>
          <Accordion type="single" collapsible defaultValue="item-1" className="max-w-xl">
            {[
              { id: 'item-1', q: 'What is Stackline UI?', a: 'A developer-focused React component library built on Radix UI primitives with TypeScript, dark mode, and a full design token system.' },
              { id: 'item-2', q: 'How do I install it?', a: 'Run npm install @stackline/ui and import the styles. Every component is tree-shakeable.' },
              { id: 'item-3', q: 'Is it accessible?', a: 'All interactive components are built on Radix UI providing WAI-ARIA keyboard navigation and screen reader support.' },
            ].map(({ id, q, a }) => (
              <AccordionItem key={id} value={id}>
                <AccordionTrigger>{q}</AccordionTrigger>
                <AccordionContent>{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <Section title="Typography" description="Full type scale — h1 through caption with semantic color tokens">
        <div className="space-y-3 max-w-lg">
          {([
            ['h1', 'Heading 1 — Bold & Large'],
            ['h2', 'Heading 2 — Section Title'],
            ['h3', 'Heading 3 — Subsection'],
            ['h4', 'Heading 4 — Card Title'],
            ['body', 'Body — Comfortable line height for reading.'],
            ['small', 'Small — captions, helpers, timestamps'],
            ['label', 'Label — Uppercase tracked'],
            ['mono', 'mono — code snippets & data'],
          ] as const).map(([v, text]) => (
            <Text key={v} variant={v}>{text}</Text>
          ))}
        </div>
      </Section>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Hooks index — visible sidebar-style summary of all hooks
// ─────────────────────────────────────────────────────────────────────────────

const HOOK_CATALOG = [
  { name: 'useLocalStorage',          apis: 'useState · useEffect · useCallback',    summary: 'Persist state across reloads with cross-tab sync' },
  { name: 'useDebounce',              apis: 'useState · useEffect',                  summary: 'Delay value updates until typing stops' },
  { name: 'useDebouncedCallback',     apis: 'useRef · useEffect · useCallback',      summary: 'Stable debounced fn without stale closures' },
  { name: 'useClickOutside',          apis: 'useRef · useEffect · useCallback',      summary: 'Dismiss overlays on outside click' },
  { name: 'useMediaQuery',            apis: 'useSyncExternalStore · useCallback',    summary: 'Reactive CSS media query — concurrent-safe' },
  { name: 'useBreakpoint',            apis: 'useMediaQuery (composed)',               summary: 'Active Tailwind breakpoint name' },
  { name: 'useCart (useReducer)',      apis: 'useReducer · useMemo · useCallback',   summary: 'Multi-action state with pure reducer + derived values' },
  { name: 'useAsync',                 apis: 'useState · useCallback · useRef',       summary: 'Async lifecycle: idle→loading→success/error' },
  { name: 'usePrevious',              apis: 'useRef · useEffect',                    summary: 'Value from the previous render' },
  { name: 'useCounter',               apis: 'useState · useMemo · useCallback',      summary: 'Counter with derived flags and stable actions' },
  { name: 'useIntersectionObserver',  apis: 'useRef · useState · useEffect',         summary: 'Viewport visibility for scroll animations' },
  { name: 'useMeasure',               apis: 'useLayoutEffect · useRef · useState',   summary: 'DOM dimensions before paint (no flicker)' },
  { name: 'useTransitionSearch',      apis: 'useTransition · useDeferredValue · useMemo', summary: 'Non-blocking filter for large lists' },
  { name: 'useTheme (useContext)',     apis: 'useContext · useMemo · useId',          summary: 'Theme context with memoised value object' },
]

function HookCatalog() {
  return (
    <Section
      title="Hook Catalog"
      description="14 production-ready hooks covering every major React hook API"
      hookLabel="All hooks"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {HOOK_CATALOG.map(({ name, apis, summary }) => (
          <Card key={name} variant="default" padding="md" className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <code className="text-sm font-bold text-stack-600 dark:text-stack-400">{name}</code>
              <Check size={14} className="shrink-0 text-green-500 mt-0.5" />
            </div>
            <Text variant="small" color="muted" className="mb-2">{summary}</Text>
            <div className="flex flex-wrap gap-1">
              {apis.split(' · ').map((api) => (
                <Badge key={api} variant="default" size="sm">
                  <code className="text-[10px]">{api}</code>
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Inner app — consumes ThemeProvider context
// ─────────────────────────────────────────────────────────────────────────────

function InnerApp() {
  const { theme, toggle } = useTheme()
  const isMobile = useMediaQuery('(max-width: 640px)')
  const breakpoint = useBreakpoint()

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">

      {/* Sticky header */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stack-600">
              <Zap size={14} className="text-white" />
            </div>
            <Text variant="h4" className="!text-sm font-bold tracking-tight">Stackline UI</Text>
            <Badge variant="primary" size="sm">v1.0</Badge>
            {!isMobile && (
              <Badge variant="default" size="sm" className="font-mono">{breakpoint}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Tooltip content="View source on GitHub">
              <Button variant="ghost" size="icon-sm" asChild>
                <a href="https://github.com" aria-label="GitHub"><Github size={16} /></a>
              </Button>
            </Tooltip>
            <Button variant="ghost" size="icon-sm" onClick={toggle} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4">Developer-focused · Open Source</Badge>
            <Text variant="h1" className="mb-4 !text-4xl font-bold tracking-tight">
              Components built the right way
            </Text>
            <Text color="muted" className="mb-8 text-base leading-relaxed">
              20+ accessible components, 14 custom hooks covering every React hook API,
              a full design token system, and an interactive docs site. Built with
              React 18, TypeScript strict mode, Radix UI, and Tailwind CSS.
            </Text>
            <Row>
              <Button leftIcon={<Code2 size={15} />}>Get started</Button>
              <Button variant="outline" rightIcon={<ChevronRight size={15} />} asChild>
                <a href="https://github.com">View on GitHub</a>
              </Button>
            </Row>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: <Package size={13} />, label: '20+ components' },
                { icon: <Zap size={13} />, label: '14 custom hooks' },
                { icon: <Check size={13} />, label: 'TypeScript strict' },
                { icon: <Wifi size={13} />, label: 'Accessible (ARIA)' },
                { icon: <WifiOff size={13} />, label: 'Dark mode' },
                { icon: <Bell size={13} />, label: '87 tests passing' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {icon} {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-6 py-14">

        {/* Hooks demos — these are the real-world usage showcase */}
        <div className="mb-4">
          <Text variant="h2" className="mb-2">React Hooks — Live Demos</Text>
          <Text color="muted" className="mb-10">
            Every hook below is fully wired into this page. The code you see in the source
            files is exactly what's powering the interactions here.
          </Text>
        </div>

        <Section id="theme" title="useTheme → useContext" description="Context API with memoised value, useId for accessible IDs, persisted to localStorage" hookLabel="useContext · useMemo · useId">
          <ThemeDemo />
        </Section>

        <Section id="localstorage" title="useLocalStorage" description="useState + useEffect: persist any value to localStorage with cross-tab sync" hookLabel="useState · useEffect · useCallback">
          <LocalStorageDemo />
        </Section>

        <Section id="debounce" title="useDebounce + useDebouncedCallback" description="Delay updates until inactivity. useRef pattern prevents stale closures on the callback version." hookLabel="useState · useEffect · useRef · useCallback">
          <DebounceDemo />
        </Section>

        <Section id="clickoutside" title="useClickOutside" description="Document-level listener scoped to a ref. The foundational pattern for all overlay dismissal." hookLabel="useRef · useEffect · useCallback">
          <ClickOutsideDemo />
        </Section>

        <Section id="mediaquery" title="useMediaQuery + useBreakpoint" description="useSyncExternalStore — the React 18 concurrent-safe way to subscribe to any external store." hookLabel="useSyncExternalStore">
          <MediaQueryDemo />
        </Section>

        <Section id="cart" title="useCart → useReducer" description="Complex multi-action state with a pure reducer. useMemo derives totals. useCallback keeps action references stable." hookLabel="useReducer · useMemo · useCallback">
          <CartDemo />
        </Section>

        <Section id="async" title="useAsync" description="Full async lifecycle as a discriminated union. useRef prevents setState-on-unmounted-component." hookLabel="useState · useCallback · useRef · useEffect">
          <AsyncDemo />
        </Section>

        <Section id="counter" title="useCounter + usePrevious" description="useMemo for derived flags. usePrevious captures the last render's value via useRef — shows direction change." hookLabel="useState · useMemo · useCallback · useRef">
          <CounterDemo />
        </Section>

        <Section id="transition" title="useTransitionSearch" description="useTransition + useDeferredValue: the input stays instant while 200-item filtering happens in the background." hookLabel="useTransition · useDeferredValue · useMemo">
          <TransitionSearchDemo />
        </Section>

        <Section id="measure" title="useMeasure → useLayoutEffect" description="Reads getBoundingClientRect() before the browser paints. Eliminates the one-frame flicker you get with useEffect." hookLabel="useLayoutEffect · useRef · useState">
          <MeasureDemo />
        </Section>

        <Section id="useid" title="useId" description="Stable unique IDs generated by React — safe for SSR, concurrent rendering, and multiple component instances on the same page." hookLabel="useId">
          <UseIdDemo />
        </Section>

        <Separator label="Components" className="my-12" />

        {/* Component showcase */}
        <ComponentShowcase />

        {/* Hook catalog summary */}
        <Separator label="Summary" className="my-12" />
        <HookCatalog />

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-10 text-center">
        <Text variant="small" color="muted">
          Stackline UI — React 18 · TypeScript 5.5 strict · Radix UI · Tailwind CSS · 14 hooks · 20+ components · 87 tests
        </Text>
      </footer>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export — ThemeProvider wraps everything so useTheme works anywhere
// ─────────────────────────────────────────────────────────────────────────────

export function DocsApp() {
  return (
    <ThemeProvider defaultTheme="system">
      <Suspense fallback={<div className="flex h-screen items-center justify-center"><Spinner size="xl" /></div>}>
        <InnerApp />
      </Suspense>
    </ThemeProvider>
  )
}
