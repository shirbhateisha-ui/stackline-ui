import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium',
    'rounded-md text-sm transition-all duration-150 outline-none',
    'focus-visible:ring-2 focus-visible:ring-stack-500 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-40',
    'active:scale-[0.98]',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-stack-600 text-white shadow-sm',
          'hover:bg-stack-700 active:bg-stack-800',
        ].join(' '),
        secondary: [
          'bg-neutral-100 text-neutral-900 border border-neutral-200 shadow-sm',
          'hover:bg-neutral-200 active:bg-neutral-300',
          'dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700',
          'dark:hover:bg-neutral-700',
        ].join(' '),
        outline: [
          'border border-neutral-300 bg-transparent text-neutral-800',
          'hover:bg-neutral-50 active:bg-neutral-100',
          'dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800',
        ].join(' '),
        ghost: [
          'bg-transparent text-neutral-700',
          'hover:bg-neutral-100 active:bg-neutral-200',
          'dark:text-neutral-300 dark:hover:bg-neutral-800',
        ].join(' '),
        destructive: [
          'bg-error text-white shadow-sm',
          'hover:bg-red-700 active:bg-red-800',
        ].join(' '),
        link: [
          'bg-transparent text-stack-600 underline-offset-4',
          'hover:underline dark:text-stack-400',
          'shadow-none',
        ].join(' '),
      },
      size: {
        xs: 'h-7 px-2.5 text-xs rounded',
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 text-sm',
        lg: 'h-10 px-5 text-sm',
        xl: 'h-12 px-6 text-base',
        icon: 'h-9 w-9 p-0',
        'icon-sm': 'h-7 w-7 p-0 rounded',
        'icon-lg': 'h-11 w-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Render as child component (polymorphic via Radix Slot).
   * When true, icon slots and loading state are disabled — only
   * className and variant styles are merged onto the single child element.
   */
  asChild?: boolean
  /** Show loading spinner and disable interaction */
  loading?: boolean
  /** Icon shown before children */
  leftIcon?: React.ReactNode
  /** Icon shown after children */
  rightIcon?: React.ReactNode
}

/**
 * Button
 *
 * The primary interactive element. Supports 6 variants, 8 sizes,
 * loading states, icon slots, and polymorphic rendering via `asChild`.
 *
 * @example
 * <Button variant="primary" size="md">Save changes</Button>
 * <Button variant="outline" leftIcon={<Plus size={16} />}>Add item</Button>
 * <Button loading>Saving…</Button>
 * <Button asChild><a href="/link">Nav link</a></Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedClassName = cn(buttonVariants({ variant, size, className }))

    // When asChild, pass className to Slot so it merges onto the child element.
    // We do NOT render icon wrappers or the spinner — Slot expects exactly one child.
    if (asChild) {
      return (
        <Slot ref={ref} className={resolvedClassName} {...props}>
          {children}
        </Slot>
      )
    }

    return (
      <button
        className={resolvedClassName}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
        ) : (
          leftIcon && <span aria-hidden="true">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
      </button>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
