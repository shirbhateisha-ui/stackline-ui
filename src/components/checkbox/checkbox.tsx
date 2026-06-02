import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { cn, uid } from '@/lib/utils'

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Label text */
  label?: string
  /** Helper text below label */
  description?: string
  /** Indeterminate state */
  indeterminate?: boolean
}

/**
 * Checkbox
 *
 * Accessible checkbox with label and description support.
 * Supports checked, unchecked, and indeterminate states.
 *
 * @example
 * <Checkbox label="Accept terms" />
 * <Checkbox label="Select all" indeterminate />
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, description, indeterminate, id: idProp, ...props }, ref) => {
  const id = idProp ?? uid('checkbox')

  const box = (
    <CheckboxPrimitive.Root
      ref={ref}
      id={id}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded border border-neutral-300 bg-white',
        'transition-colors duration-150 outline-none',
        'focus-visible:ring-2 focus-visible:ring-stack-500 focus-visible:ring-offset-2',
        'data-[state=checked]:bg-stack-600 data-[state=checked]:border-stack-600',
        'data-[state=indeterminate]:bg-stack-600 data-[state=indeterminate]:border-stack-600',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-neutral-600 dark:bg-neutral-900',
        className,
      )}
      checked={indeterminate ? 'indeterminate' : props.checked}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
        {indeterminate ? (
          <Minus className="h-3 w-3" strokeWidth={3} />
        ) : (
          <Check className="h-3 w-3" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )

  if (!label) return box

  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5">{box}</div>
      <div className="space-y-0.5">
        <label
          htmlFor={id}
          className="cursor-pointer text-sm font-medium text-neutral-800 dark:text-neutral-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{description}</p>
        )}
      </div>
    </div>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
