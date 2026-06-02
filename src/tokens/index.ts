/**
 * Stackline UI Design Tokens
 *
 * Single source of truth for the entire design system.
 * All component styles derive from these values.
 * In consuming apps, override CSS variables on :root or .dark.
 */

// ─── Color Palette ────────────────────────────────────────────────────────────

export const colors = {
  stack: {
    50:  '#f0f4ff',
    100: '#e0e9ff',
    200: '#c7d7fe',
    300: '#a5b8fc',
    400: '#8194f8',
    500: '#6370f1',
    600: '#4f52e6',
    700: '#4040cc',
    800: '#3535a4',
    900: '#2f3182',
    950: '#1c1d4c',
  },
  neutral: {
    0:   '#ffffff',
    50:  '#f8f9fa',
    100: '#f1f3f5',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#868e96',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
    950: '#0d0f12',
  },
  success: { light: '#d3f9d8', DEFAULT: '#2f9e44', dark: '#1a5c26' },
  warning: { light: '#fff3bf', DEFAULT: '#e67700', dark: '#7d4000' },
  error:   { light: '#ffe3e3', DEFAULT: '#e03131', dark: '#7a1818' },
  info:    { light: '#e8f4fd', DEFAULT: '#1971c2', dark: '#0c3a6b' },
} as const

// ─── Spacing Scale ────────────────────────────────────────────────────────────

export const spacing = {
  0:    '0px',
  0.5:  '2px',
  1:    '4px',
  1.5:  '6px',
  2:    '8px',
  2.5:  '10px',
  3:    '12px',
  3.5:  '14px',
  4:    '16px',
  5:    '20px',
  6:    '24px',
  7:    '28px',
  8:    '32px',
  9:    '36px',
  10:   '40px',
  12:   '48px',
  14:   '56px',
  16:   '64px',
} as const

// ─── Typography ───────────────────────────────────────────────────────────────

export const typography = {
  fontFamily: {
    sans: '"Geist", "Geist Fallback", system-ui, sans-serif',
    mono: '"Geist Mono", "JetBrains Mono", monospace',
  },
  fontSize: {
    xs:   ['11px', { lineHeight: '16px' }],
    sm:   ['13px', { lineHeight: '20px' }],
    base: ['14px', { lineHeight: '22px' }],
    md:   ['15px', { lineHeight: '24px' }],
    lg:   ['18px', { lineHeight: '28px' }],
    xl:   ['22px', { lineHeight: '32px' }],
    '2xl':['28px', { lineHeight: '36px' }],
    '3xl':['36px', { lineHeight: '44px' }],
  },
  fontWeight: {
    regular: '400',
    medium:  '500',
    semibold:'600',
    bold:    '700',
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.02em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const

// ─── Border Radius ────────────────────────────────────────────────────────────

export const radii = {
  none: '0px',
  sm:   '4px',
  md:   '6px',
  lg:   '8px',
  xl:   '12px',
  '2xl':'16px',
  full: '9999px',
} as const

// ─── Shadows ──────────────────────────────────────────────────────────────────

export const shadows = {
  none: 'none',
  xs:   '0 1px 2px 0 rgba(0,0,0,0.05)',
  sm:   '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
  md:   '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
  lg:   '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
  xl:   '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
  inner:'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
} as const

// ─── Animation ────────────────────────────────────────────────────────────────

export const animation = {
  duration: {
    instant: '0ms',
    fast:    '100ms',
    normal:  '200ms',
    slow:    '300ms',
    slower:  '500ms',
  },
  easing: {
    linear:    'linear',
    easeIn:    'cubic-bezier(0.4, 0, 1, 1)',
    easeOut:   'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring:    'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const

// ─── Z-Index ──────────────────────────────────────────────────────────────────

export const zIndex = {
  below:   -1,
  base:    0,
  raised:  10,
  overlay: 100,
  modal:   200,
  popover: 300,
  toast:   400,
  tooltip: 500,
} as const

// ─── Component Size Tokens ────────────────────────────────────────────────────

export const componentSize = {
  xs: { height: '28px', px: '8px',  text: '12px', iconSize: '14px' },
  sm: { height: '32px', px: '10px', text: '13px', iconSize: '15px' },
  md: { height: '36px', px: '14px', text: '14px', iconSize: '16px' },
  lg: { height: '40px', px: '16px', text: '15px', iconSize: '17px' },
  xl: { height: '48px', px: '20px', text: '16px', iconSize: '18px' },
} as const

export type ColorToken = typeof colors
export type SpacingToken = typeof spacing
export type TypographyToken = typeof typography
export type ShadowToken = typeof shadows
export type ComponentSizeToken = typeof componentSize
