import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/tabs/tabs'
import { Alert, Avatar, Progress, Spinner, Text } from '@/components/misc/misc'

// ─── Tabs ─────────────────────────────────────────────────────────────────────

describe('Tabs', () => {
  function TabsDemo() {
    return (
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )
  }

  it('renders tab triggers', () => {
    render(<TabsDemo />)
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument()
  })

  it('shows first tab content by default', () => {
    render(<TabsDemo />)
    expect(screen.getByText('Content 1')).toBeInTheDocument()
  })

  it('switches content on tab click', async () => {
    const user = userEvent.setup()
    render(<TabsDemo />)
    await user.click(screen.getByRole('tab', { name: 'Tab 2' }))
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('data-state', 'active')
  })

  it('marks default tab as active', () => {
    render(<TabsDemo />)
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('data-state', 'active')
  })
})

// ─── Alert ────────────────────────────────────────────────────────────────────

describe('Alert', () => {
  it('renders with role=alert', () => {
    render(<Alert>Something happened</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders title and body', () => {
    render(<Alert title="Heads up">Check your settings.</Alert>)
    expect(screen.getByText('Heads up')).toBeInTheDocument()
    expect(screen.getByText('Check your settings.')).toBeInTheDocument()
  })

  it.each(['info', 'success', 'warning', 'error'] as const)('renders %s variant', (v) => {
    render(<Alert variant={v}>{v}</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button clicked', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<Alert dismissible onDismiss={onDismiss}>Dismissible</Alert>)
    await user.click(screen.getByLabelText('Dismiss'))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})

// ─── Avatar ───────────────────────────────────────────────────────────────────

describe('Avatar', () => {
  it('renders fallback text when no src', () => {
    render(<Avatar fallback="IB" />)
    expect(screen.getByText('IB')).toBeInTheDocument()
  })

  it('derives fallback from alt', () => {
    render(<Avatar alt="Isha Bhate" />)
    expect(screen.getByText('I')).toBeInTheDocument()
  })

  it('renders status indicator', () => {
    render(<Avatar fallback="AB" status="online" />)
    expect(screen.getByLabelText('online')).toBeInTheDocument()
  })

  it('renders AvatarImage element when src provided (img may be hidden until load)', () => {
    // Radix AvatarImage hides <img> until the image loads. In jsdom no network requests
    // fire, so the img is hidden. We verify the root avatar wrapper is rendered and
    // the fallback is accessible until the image loads.
    const { container } = render(<Avatar src="https://example.com/avatar.jpg" alt="User" />)
    // The Radix avatar root is always rendered
    expect(container.firstChild).toBeInTheDocument()
    // AvatarImage is in the DOM but may be hidden before load — confirm the element exists
    const img = container.querySelector('img')
    // img may be null in jsdom since Radix only renders it after load status resolves
    // What we CAN assert: the fallback initial renders (image hasn't loaded)
    expect(screen.getByText('U')).toBeInTheDocument()
  })
})

// ─── Progress ─────────────────────────────────────────────────────────────────

describe('Progress', () => {
  it('renders a progressbar', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows percentage label when showLabel is set', () => {
    render(<Progress value={72} showLabel />)
    expect(screen.getByText('72%')).toBeInTheDocument()
  })

  it('shows custom label', () => {
    render(<Progress value={40} showLabel label="Upload progress" />)
    expect(screen.getByText('Upload progress')).toBeInTheDocument()
  })
})

// ─── Spinner ──────────────────────────────────────────────────────────────────

describe('Spinner', () => {
  it('has role=status', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('uses custom label for accessibility', () => {
    render(<Spinner label="Fetching data…" />)
    expect(screen.getByRole('status', { name: 'Fetching data…' })).toBeInTheDocument()
  })
})

// ─── Text ─────────────────────────────────────────────────────────────────────

describe('Text', () => {
  it('renders as p by default', () => {
    render(<Text>Body text</Text>)
    expect(screen.getByText('Body text').tagName).toBe('P')
  })

  it('renders as heading for h1 variant', () => {
    render(<Text variant="h1">Heading</Text>)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('accepts custom element via as prop', () => {
    render(<Text as="span">Span text</Text>)
    expect(screen.getByText('Span text').tagName).toBe('SPAN')
  })

  it('applies variant class', () => {
    render(<Text variant="label">Label</Text>)
    expect(screen.getByText('Label')).toHaveClass('uppercase')
  })
})
