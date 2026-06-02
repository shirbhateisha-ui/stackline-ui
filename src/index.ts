// ─── Tokens ───────────────────────────────────────────────────────────────────
export * from './tokens'

// ─── Utilities ────────────────────────────────────────────────────────────────
export { cn } from './lib/utils'

// ─── Button ───────────────────────────────────────────────────────────────────
export { Button, buttonVariants } from './components/button/button'
export type { ButtonProps } from './components/button/button'

// ─── Badge ────────────────────────────────────────────────────────────────────
export { Badge, badgeVariants } from './components/badge/badge'
export type { BadgeProps } from './components/badge/badge'

// ─── Card ─────────────────────────────────────────────────────────────────────
export {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from './components/card/card'
export type { CardProps } from './components/card/card'

// ─── Input ────────────────────────────────────────────────────────────────────
export { Input, inputVariants } from './components/input/input'
export type { InputProps } from './components/input/input'

// ─── Select ───────────────────────────────────────────────────────────────────
export {
  Select, SelectGroup, SelectValue,
  SelectTrigger, SelectContent,
  SelectItem, SelectLabel, SelectSeparator,
  SelectField,
} from './components/select/select'
export type { SelectFieldProps } from './components/select/select'

// ─── Checkbox ─────────────────────────────────────────────────────────────────
export { Checkbox } from './components/checkbox/checkbox'
export type { CheckboxProps } from './components/checkbox/checkbox'

// ─── Switch ───────────────────────────────────────────────────────────────────
export { Switch } from './components/switch/switch'
export type { SwitchProps } from './components/switch/switch'

// ─── Dialog ───────────────────────────────────────────────────────────────────
export {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogBody, DialogFooter,
  DialogTitle, DialogDescription, DialogClose,
} from './components/dialog/dialog'
export type { DialogContentProps } from './components/dialog/dialog'

// ─── Tooltip ──────────────────────────────────────────────────────────────────
export {
  Tooltip, TooltipProvider, TooltipRoot,
  TooltipTrigger, TooltipContent,
} from './components/tooltip/tooltip'
export type { TooltipProps } from './components/tooltip/tooltip'

// ─── Tabs ─────────────────────────────────────────────────────────────────────
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/tabs/tabs'

// ─── Accordion ────────────────────────────────────────────────────────────────
export {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from './components/accordion/accordion'

// ─── Misc ─────────────────────────────────────────────────────────────────────
export {
  Avatar, Progress, Separator, Spinner, Alert, Text,
} from './components/misc/misc'
export type { AvatarProps, ProgressProps, SeparatorProps, SpinnerProps, AlertProps, TextProps } from './components/misc/misc'

// ─── Hooks ────────────────────────────────────────────────────────────────────
export { useLocalStorage }               from './hooks/useLocalStorage'
export { useDebounce, useDebouncedCallback } from './hooks/useDebounce'
export { useClickOutside }               from './hooks/useClickOutside'
export { useMediaQuery, useBreakpoint }  from './hooks/useMediaQuery'
export { useCart }                       from './hooks/useCart'
export type { CartItem, CartAction, CartState } from './hooks/useCart'
export { useAsync }                      from './hooks/useAsync'
export type { AsyncState }               from './hooks/useAsync'
export {
  usePrevious, useCounter,
  useIntersectionObserver, useMeasure,
} from './hooks/useCounterAndObserver'
export { useTransitionSearch }           from './hooks/useTransitionSearch'

// ─── Context ──────────────────────────────────────────────────────────────────
export { ThemeProvider, useTheme }       from './context/ThemeContext'
export type { Theme }                    from './context/ThemeContext'
