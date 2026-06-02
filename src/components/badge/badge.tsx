import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        default:     'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
        primary:     'bg-stack-100 text-stack-700 dark:bg-stack-950 dark:text-stack-300',
        success:     'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
        warning:     'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
        error:       'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
        info:        'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
        outline:     'border border-current bg-transparent text-neutral-700 dark:text-neutral-300',
        solid:       'bg-stack-600 text-white',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-[10px] leading-4',
        md: 'px-2 py-0.5 text-xs',
        lg: 'px-2.5 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Optional dot indicator before label */
  dot?: boolean
}

/**
 * Badge
 *
 * Compact label for status, categories, and counts.
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" dot>Failed</Badge>
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    >
      {dot && (
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-current"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  ),
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
