import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

const tabsListVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      line: 'border-b border-neutral-200 dark:border-neutral-800 w-full',
      pill: 'gap-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1',
      card: 'gap-0 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden',
    },
  },
  defaultVariants: { variant: 'line' },
})

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, className }))}
    data-variant={variant}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const tabsTriggerVariants = cva(
  'inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-stack-500 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        line: [
          'px-4 py-2.5 -mb-px border-b-2 border-transparent text-neutral-500',
          'hover:text-neutral-700 dark:hover:text-neutral-300',
          'data-[state=active]:border-stack-600 data-[state=active]:text-stack-600',
          'dark:text-neutral-400 dark:data-[state=active]:text-stack-400 dark:data-[state=active]:border-stack-400',
        ].join(' '),
        pill: [
          'rounded-md px-3 py-1.5 text-neutral-600 dark:text-neutral-400',
          'hover:text-neutral-900 dark:hover:text-neutral-100',
          'data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm',
          'dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-neutral-100',
        ].join(' '),
        card: [
          'px-4 py-2.5 text-neutral-500 border-r border-neutral-200 last:border-0',
          'dark:border-neutral-700 dark:text-neutral-400',
          'data-[state=active]:bg-white data-[state=active]:text-neutral-900',
          'dark:data-[state=active]:bg-neutral-800 dark:data-[state=active]:text-neutral-100',
        ].join(' '),
      },
    },
    defaultVariants: { variant: 'line' },
  },
)

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof tabsTriggerVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, className }))}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 outline-none',
      'data-[state=active]:animate-fade-in',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
