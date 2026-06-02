import { clsx, type ClassValue } from 'clsx'

/** Merges class names, resolving conflicts intelligently */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

/** Generates a stable unique ID for accessibility */
let counter = 0
export function uid(prefix = 'stack'): string {
  return `${prefix}-${++counter}`
}

/** Polymorphic component helper */
export type AsProp<C extends React.ElementType> = {
  as?: C
}

export type PolymorphicProps<C extends React.ElementType, P = object> = AsProp<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof (AsProp<C> & P)> &
  P

import type React from 'react'
