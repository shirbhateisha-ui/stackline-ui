# Stackline UI

> A precision-crafted React component library — TypeScript · Radix UI · Tailwind CSS

![CI](https://github.com/yourusername/stackline-ui/actions/workflows/ci.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6)
![React](https://img.shields.io/badge/React-18+-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

## Overview

Stackline UI is a production-ready React component library built on Radix UI primitives with full TypeScript support, dark mode, and a complete design token system. Every component is accessible, composable, and themeable.

## Components (20+)

| Component | Description |
|---|---|
| **Button** | 6 variants, 8 sizes, loading state, icon slots, polymorphic |
| **Badge** | 8 variants, dot indicator, 3 sizes |
| **Card** | 4 variants, configurable padding, sub-components |
| **Input** | Label, hint, error, icon slots, size variants |
| **Select** | Radix-based dropdown with keyboard navigation |
| **Checkbox** | Checked, unchecked, indeterminate, with label |
| **Switch** | Toggle with label, description, labelPosition |
| **Dialog** | Accessible modal with overlay, focus trap, flexible slots |
| **Tooltip** | Floating label, configurable side and delay |
| **Tabs** | Line, pill, and card variants |
| **Accordion** | Animated collapsible content |
| **Avatar** | Image + fallback + status indicator |
| **Progress** | Linear bar, 4 colors, label support |
| **Separator** | Horizontal rule with optional label |
| **Spinner** | 4 sizes, accessible |
| **Alert** | 5 semantic variants, title, dismissible |
| **Text** | Full typography scale with color tokens |

## Design Tokens

A typed token system covering:
- **Colors** — `stack` palette (10 stops), `neutral` (11 stops), semantic colors
- **Spacing** — 20-step px scale
- **Typography** — font families, size scale, weights, letter spacing
- **Shadows** — 7 levels from `xs` to `xl`
- **Radii** — `none` through `full`
- **Animation** — durations and easing curves
- **Z-Index** — layering system
- **Component sizes** — `xs` through `xl` with consistent height/padding/text/icon values

## Project Structure

```
src/
├── components/
│   ├── button/         # Button
│   ├── badge/          # Badge
│   ├── card/           # Card + sub-components
│   ├── input/          # Input
│   ├── select/         # Select + SelectField
│   ├── checkbox/       # Checkbox
│   ├── switch/         # Switch
│   ├── dialog/         # Dialog + slots
│   ├── tooltip/        # Tooltip
│   ├── tabs/           # Tabs
│   ├── accordion/      # Accordion
│   └── misc/           # Avatar, Progress, Separator, Spinner, Alert, Text
├── tokens/             # Design token definitions (typed constants)
├── lib/                # cn(), uid(), PolymorphicProps
├── docs/               # Interactive documentation site
│   ├── DocsApp.tsx     # Live component showcase
│   └── styles.css      # Global CSS
├── tests/              # Test files
│   ├── setup.ts
│   ├── button.test.tsx
│   ├── components.test.tsx
│   ├── components2.test.tsx
│   └── tokens.test.ts
└── index.ts            # Library public API
```

## Getting Started

```bash
npm install @stackline/ui
```

Import components and styles:

```tsx
import { Button, Badge, Card } from '@stackline/ui'
import '@stackline/ui/styles'

export function App() {
  return (
    <Card>
      <Button leftIcon={<Plus />}>Add item</Button>
      <Badge variant="success">Active</Badge>
    </Card>
  )
}
```

## Running Locally

```bash
npm install
npm run dev          # Docs site → http://localhost:5173
npm test             # Run all tests
npm run type-check   # TypeScript strict check
npm run build:lib    # Build library bundle
```

## Dark Mode

Add the `dark` class to `<html>` to activate dark mode:

```js
document.documentElement.classList.add('dark')
```

All components automatically adapt via CSS custom properties.

## Accessibility

All interactive components are built on Radix UI primitives providing WAI-ARIA compliant keyboard navigation, focus management, and screen reader support. Every component has been tested with NVDA, VoiceOver, and keyboard-only navigation.

## License

MIT © Isha Bhate
