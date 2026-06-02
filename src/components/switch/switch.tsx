import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn, uid } from '@/lib/utils'

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: string
  description?: string
  labelPosition?: 'left' | 'right'
}

/**
 * Switch
 *
 * Toggle switch for boolean settings.
 *
 * @example
 * <Switch label="Enable notifications" />
 * <Switch label="Dark mode" labelPosition="left" />
 */
const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, label, description, labelPosition = 'right', id: idProp, ...props }, ref) => {
    const id = idProp ?? uid('switch')

    const toggle = (
      <SwitchPrimitive.Root
        id={id}
        ref={ref}
        className={cn(
          'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
          'transition-colors duration-200 outline-none',
          'focus-visible:ring-2 focus-visible:ring-stack-500 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'bg-neutral-300 data-[state=checked]:bg-stack-600',
          'dark:bg-neutral-600 dark:data-[state=checked]:bg-stack-500',
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm',
            'transition-transform duration-200',
            'data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
          )}
        />
      </SwitchPrimitive.Root>
    )

    if (!label) return toggle

    const labelEl = (
      <div className={cn('space-y-0.5', labelPosition === 'left' && 'text-right')}>
        <label
          htmlFor={id}
          className="cursor-pointer text-sm font-medium text-neutral-800 dark:text-neutral-200"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{description}</p>
        )}
      </div>
    )

    return (
      <div className="flex items-center gap-3">
        {labelPosition === 'left' && labelEl}
        {toggle}
        {labelPosition === 'right' && labelEl}
      </div>
    )
  },
)
Switch.displayName = 'Switch'

export { Switch }
