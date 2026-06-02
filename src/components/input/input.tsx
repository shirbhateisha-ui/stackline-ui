import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, uid } from '@/lib/utils'

const inputVariants = cva(
  [
    'flex w-full rounded-md border bg-white text-sm text-neutral-900',
    'placeholder:text-neutral-400',
    'transition-colors duration-150 outline-none',
    'focus:ring-2 focus:ring-stack-500 focus:ring-offset-1 focus:border-stack-500',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-50',
    'dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-600',
    'dark:border-neutral-700 dark:focus:border-stack-400',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-neutral-300',
        error:   'border-red-400 focus:ring-red-400 focus:border-red-400',
        success: 'border-green-400 focus:ring-green-400 focus:border-green-400',
      },
      size: {
        sm: 'h-8 px-2.5 text-xs',
        md: 'h-9 px-3',
        lg: 'h-11 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Form field label */
  label?: string
  /** Hint text shown below the input */
  hint?: string
  /** Error message — also sets error variant */
  error?: string
  /** Icon shown inside the left edge */
  leftIcon?: React.ReactNode
  /** Icon or element shown inside the right edge */
  rightElement?: React.ReactNode
  /** Whether label and input should share a wrapper div */
  wrapperClassName?: string
}

/**
 * Input
 *
 * Full-featured text input with label, hint, error, and icon slots.
 * Automatically links label and error message via aria attributes.
 *
 * @example
 * <Input label="Email" placeholder="you@example.com" />
 * <Input label="Username" error="Username is taken" />
 * <Input leftIcon={<Search size={15} />} placeholder="Search…" />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      wrapperClassName,
      variant,
      size,
      label,
      hint,
      error,
      leftIcon,
      rightElement,
      id: idProp,
      ...props
    },
    ref,
  ) => {
    const id = idProp ?? uid('input')
    const errorId = `${id}-error`
    const hintId = `${id}-hint`
    const resolvedVariant = error ? 'error' : variant

    const inputEl = (
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            inputVariants({ variant: resolvedVariant, size, className }),
            leftIcon && 'pl-9',
            rightElement && 'pr-9',
          )}
          aria-describedby={
            [error && errorId, hint && hintId].filter(Boolean).join(' ') || undefined
          }
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        {rightElement && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {rightElement}
          </span>
        )}
      </div>
    )

    if (!label && !hint && !error) return inputEl

    return (
      <div className={cn('space-y-1.5', wrapperClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-red-500" aria-hidden="true">*</span>
            )}
          </label>
        )}
        {inputEl}
        {error ? (
          <p id={errorId} className="text-xs text-red-500" role="alert">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-xs text-neutral-500 dark:text-neutral-400">
            {hint}
          </p>
        ) : null}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input, inputVariants }
