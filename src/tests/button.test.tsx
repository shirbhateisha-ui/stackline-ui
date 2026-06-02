import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/button/button'
import { Plus } from 'lucide-react'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('applies primary variant by default', () => {
    render(<Button>Click</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-stack-600')
  })

  it.each([
    ['primary', 'bg-stack-600'],
    ['secondary', 'bg-neutral-100'],
    ['outline', 'border'],
    ['ghost', 'bg-transparent'],
    ['destructive', 'bg-error'],
  ] as const)('applies %s variant class', (variant, cls) => {
    render(<Button variant={variant}>{variant}</Button>)
    expect(screen.getByRole('button')).toHaveClass(cls)
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows spinner and is disabled when loading', () => {
    render(<Button loading>Saving</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-busy')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Click</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders leftIcon', () => {
    render(<Button leftIcon={<Plus data-testid="icon" />}>Add</Button>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('does not render leftIcon when loading', () => {
    render(<Button loading leftIcon={<Plus data-testid="icon" />}>Add</Button>)
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
  })

  it('applies size classes', () => {
    render(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10')
  })

  it('renders as a custom element with asChild — merges classes onto child', () => {
    // When asChild is used, Button merges its className onto the single child.
    // Radix Slot requires exactly one React element child with no extra nodes.
    render(
      <Button asChild variant="primary">
        <a href="/test">Link button</a>
      </Button>,
    )
    // The anchor element should exist and carry button classes
    const link = screen.getByText('Link button')
    expect(link.tagName).toBe('A')
    expect(link).toHaveClass('bg-stack-600')
  })
})
