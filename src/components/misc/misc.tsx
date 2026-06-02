import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cva, type VariantProps } from 'class-variance-authority'
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Avatar ───────────────────────────────────────────────────────────────────

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        xs:  'h-6 w-6 text-[10px]',
        sm:  'h-8 w-8 text-xs',
        md:  'h-10 w-10 text-sm',
        lg:  'h-12 w-12 text-base',
        xl:  'h-16 w-16 text-lg',
        '2xl':'h-20 w-20 text-xl',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: string
  /** Optional online/offline indicator */
  status?: 'online' | 'offline' | 'busy' | 'away'
}

function Avatar({ className, size, src, alt, fallback, status, ...props }: AvatarProps) {
  const statusColor = {
    online:  'bg-green-500',
    offline: 'bg-neutral-400',
    busy:    'bg-red-500',
    away:    'bg-amber-400',
  }
  return (
    <div className="relative inline-flex">
      <AvatarPrimitive.Root className={cn(avatarVariants({ size, className }))} {...props}>
        {src && (
          <AvatarPrimitive.Image
            src={src}
            alt={alt ?? ''}
            className="aspect-square h-full w-full object-cover"
          />
        )}
        <AvatarPrimitive.Fallback
          className="flex h-full w-full items-center justify-center rounded-full bg-stack-100 font-semibold text-stack-700 dark:bg-stack-950 dark:text-stack-300"
        >
          {fallback ?? alt?.charAt(0).toUpperCase() ?? '?'}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-neutral-900',
            statusColor[status],
            size === 'xs' || size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5',
          )}
          aria-label={status}
        />
      )}
    </div>
  )
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** 0–100 */
  value?: number
  color?: 'default' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
}

function Progress({ value = 0, color = 'default', size = 'md', showLabel, label, className, ...props }: ProgressProps) {
  const trackH = { sm: 'h-1', md: 'h-2', lg: 'h-3' }[size]
  const fillColor = {
    default: 'bg-stack-600',
    success: 'bg-green-500',
    warning: 'bg-amber-400',
    error:   'bg-red-500',
  }[color]

  return (
    <div className="space-y-1.5">
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <span>{label ?? 'Progress'}</span>
          <span>{Math.round(value)}%</span>
        </div>
      )}
      <ProgressPrimitive.Root
        className={cn('overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700', trackH, className)}
        value={value}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn('h-full rounded-full transition-all duration-500 ease-out', fillColor)}
          style={{ width: `${value}%` }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
}

// ─── Separator ────────────────────────────────────────────────────────────────

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  label?: string
}

function Separator({ className, orientation = 'horizontal', label, decorative = true, ...props }: SeparatorProps) {
  if (label) {
    return (
      <div className="flex items-center gap-3">
        <SeparatorPrimitive.Root
          decorative
          className="flex-1 bg-neutral-200 dark:bg-neutral-700 h-px"
        />
        <span className="shrink-0 text-xs text-neutral-400 font-medium">{label}</span>
        <SeparatorPrimitive.Root
          decorative
          className="flex-1 bg-neutral-200 dark:bg-neutral-700 h-px"
        />
      </div>
    )
  }
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'bg-neutral-200 dark:bg-neutral-700',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  className?: string
  label?: string
}

function Spinner({ size = 'md', className, label = 'Loading…' }: SpinnerProps) {
  const s = { sm: 'h-4 w-4 border-2', md: 'h-5 w-5 border-2', lg: 'h-7 w-7 border-[3px]', xl: 'h-10 w-10 border-4' }[size]
  return (
    <span role="status" aria-label={label} className={cn('inline-flex', className)}>
      <span
        className={cn(
          'rounded-full border-neutral-200 border-t-stack-600 animate-spin dark:border-neutral-700 dark:border-t-stack-400',
          s,
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  )
}

// ─── Alert ────────────────────────────────────────────────────────────────────

const alertVariants = cva(
  'relative flex gap-3 rounded-lg border p-4 text-sm',
  {
    variants: {
      variant: {
        info:    'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200',
        success: 'border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-200',
        warning: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
        error:   'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-200',
        neutral: 'border-neutral-200 bg-neutral-50 text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200',
      },
    },
    defaultVariants: { variant: 'info' },
  },
)

const alertIcons = {
  info:    <Info size={16} className="shrink-0 mt-0.5" />,
  success: <CheckCircle2 size={16} className="shrink-0 mt-0.5" />,
  warning: <TriangleAlert size={16} className="shrink-0 mt-0.5" />,
  error:   <AlertCircle size={16} className="shrink-0 mt-0.5" />,
  neutral: <Info size={16} className="shrink-0 mt-0.5" />,
}

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string
  dismissible?: boolean
  onDismiss?: () => void
}

function Alert({ className, variant = 'info', title, children, dismissible, onDismiss, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant, className }))}
      {...props}
    >
      {alertIcons[variant ?? 'info']}
      <div className="flex-1 space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="leading-relaxed opacity-90">{children}</div>}
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

// ─── Text ─────────────────────────────────────────────────────────────────────

const textVariants = cva('', {
  variants: {
    variant: {
      h1:      'text-3xl font-bold tracking-tight',
      h2:      'text-2xl font-semibold tracking-tight',
      h3:      'text-xl font-semibold',
      h4:      'text-lg font-semibold',
      body:    'text-sm leading-relaxed',
      small:   'text-xs text-neutral-500 dark:text-neutral-400',
      mono:    'font-mono text-sm',
      label:   'text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400',
      caption: 'text-xs text-neutral-400',
    },
    color: {
      default: 'text-neutral-900 dark:text-neutral-100',
      muted:   'text-neutral-500 dark:text-neutral-400',
      primary: 'text-stack-600 dark:text-stack-400',
      success: 'text-green-600 dark:text-green-400',
      error:   'text-red-600 dark:text-red-400',
      inherit: '',
    },
  },
  defaultVariants: { variant: 'body', color: 'default' },
})

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: React.ElementType
}

function Text({ as, className, variant, color, ...props }: TextProps) {
  const Comp = as ?? (
    variant === 'h1' ? 'h1' :
    variant === 'h2' ? 'h2' :
    variant === 'h3' ? 'h3' :
    variant === 'h4' ? 'h4' :
    'p'
  )
  return <Comp className={cn(textVariants({ variant, color, className }))} {...props} />
}

export {
  Avatar,
  Progress,
  Separator,
  Spinner,
  Alert,
  Text,
}
