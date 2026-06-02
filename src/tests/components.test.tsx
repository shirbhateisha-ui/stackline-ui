import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Badge } from '@/components/badge/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/card/card'
import { Input } from '@/components/input/input'
import { Checkbox } from '@/components/checkbox/checkbox'
import { Switch } from '@/components/switch/switch'

// ─── Badge ────────────────────────────────────────────────────────────────────

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it.each([
    ['success', 'bg-green-100'],
    ['warning', 'bg-amber-100'],
    ['error',   'bg-red-100'],
    ['primary', 'bg-stack-100'],
  ] as const)('applies %s variant', (variant, cls) => {
    render(<Badge variant={variant}>{variant}</Badge>)
    expect(screen.getByText(variant)).toHaveClass(cls)
  })

  it('renders dot indicator when dot prop is set', () => {
    render(<Badge dot>With dot</Badge>)
    // dot is aria-hidden span
    const badge = screen.getByText('With dot').closest('span')
    expect(badge?.querySelector('[aria-hidden]')).toBeInTheDocument()
  })
})

// ─── Card ─────────────────────────────────────────────────────────────────────

describe('Card', () => {
  it('renders with children', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    const { container } = render(<Card variant="elevated">Elevated</Card>)
    expect(container.firstChild).toHaveClass('shadow-lg')
  })

  it('applies padding classes', () => {
    const { container } = render(<Card padding="lg">Large</Card>)
    expect(container.firstChild).toHaveClass('p-6')
  })

  it('merges custom className', () => {
    const { container } = render(<Card className="custom-cls">Card</Card>)
    expect(container.firstChild).toHaveClass('custom-cls')
  })
})

// ─── Input ────────────────────────────────────────────────────────────────────

describe('Input', () => {
  it('renders a text input by default', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders with label and links them', () => {
    render(<Input label="Email" id="email-input" />)
    const label = screen.getByText('Email')
    const input = screen.getByLabelText('Email')
    expect(label).toBeInTheDocument()
    expect(input).toBeInTheDocument()
  })

  it('shows required asterisk', () => {
    render(<Input label="Name" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('displays error message with role=alert', () => {
    render(<Input error="Email is required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Email is required')
  })

  it('applies error variant class when error prop set', () => {
    render(<Input error="Bad" />)
    expect(screen.getByRole('textbox')).toHaveClass('border-red-400')
  })

  it('shows hint text when no error', () => {
    render(<Input hint="Must be at least 8 characters" />)
    expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument()
  })

  it('calls onChange on user input', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Input onChange={onChange} />)
    await user.type(screen.getByRole('textbox'), 'hello')
    expect(onChange).toHaveBeenCalled()
  })

  it('is disabled when disabled prop set', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})

// ─── Checkbox ─────────────────────────────────────────────────────────────────

describe('Checkbox', () => {
  it('renders a checkbox', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders with label and links them', () => {
    render(<Checkbox label="Accept terms" id="terms" />)
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<Checkbox label="Notifications" description="Receive email updates" />)
    expect(screen.getByText('Receive email updates')).toBeInTheDocument()
  })

  it('calls onCheckedChange when clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox label="Check me" onCheckedChange={onChange} />)
    await user.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('starts checked when defaultChecked set', () => {
    render(<Checkbox defaultChecked />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked')
  })
})

// ─── Switch ───────────────────────────────────────────────────────────────────

describe('Switch', () => {
  it('renders a switch', () => {
    render(<Switch />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<Switch label="Enable dark mode" id="dark" />)
    expect(screen.getByText('Enable dark mode')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<Switch label="Autoplay" description="Videos will autoplay" />)
    expect(screen.getByText('Videos will autoplay')).toBeInTheDocument()
  })

  it('calls onCheckedChange when clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Switch onCheckedChange={onChange} />)
    await user.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('is off by default', () => {
    render(<Switch />)
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'unchecked')
  })

  it('is on when defaultChecked set', () => {
    render(<Switch defaultChecked />)
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'checked')
  })
})
