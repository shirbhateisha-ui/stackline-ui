import { describe, it, expect } from 'vitest'
import { colors, spacing, radii, shadows, componentSize, animation, zIndex } from '@/tokens'
import { cn } from '@/lib/utils'

describe('Design Tokens', () => {
  describe('colors', () => {
    it('has stack palette with stops including 950', () => {
      const keys = Object.keys(colors.stack)
      expect(keys.length).toBeGreaterThanOrEqual(10)
      expect(keys).toContain('950')
    })
    it('has neutral palette including stop 0 and 950', () => {
      const keys = Object.keys(colors.neutral)
      expect(keys.length).toBeGreaterThanOrEqual(11)
      expect(keys).toContain('0')
      expect(keys).toContain('950')
    })
    it('has semantic color groups', () => {
      expect(colors.success.DEFAULT).toBeDefined()
      expect(colors.warning.DEFAULT).toBeDefined()
      expect(colors.error.DEFAULT).toBeDefined()
      expect(colors.info.DEFAULT).toBeDefined()
    })
    it('stack-600 is a valid hex color', () => {
      expect(colors.stack[600]).toMatch(/^#[0-9a-fA-F]{6}$/)
    })
  })

  describe('spacing', () => {
    it('contains px values', () => {
      Object.values(spacing).forEach((v) => {
        expect(v).toMatch(/^\d+(\.\d+)?px$/)
      })
    })
    it('has at least 15 steps', () => {
      expect(Object.keys(spacing).length).toBeGreaterThanOrEqual(15)
    })
  })

  describe('radii', () => {
    it('includes expected keys', () => {
      expect(radii.none).toBe('0px')
      expect(radii.full).toBe('9999px')
    })
    it('has at least 5 radius values', () => {
      expect(Object.keys(radii).length).toBeGreaterThanOrEqual(5)
    })
  })

  describe('shadows', () => {
    it('has 7 shadow levels', () => {
      expect(Object.keys(shadows)).toHaveLength(7)
    })
    it('none is string "none"', () => {
      expect(shadows.none).toBe('none')
    })
  })

  describe('componentSize', () => {
    it('has 5 size tiers', () => {
      expect(Object.keys(componentSize)).toHaveLength(5)
    })
    it('each size has height, px, text, iconSize', () => {
      Object.values(componentSize).forEach((s) => {
        expect(s).toHaveProperty('height')
        expect(s).toHaveProperty('px')
        expect(s).toHaveProperty('text')
        expect(s).toHaveProperty('iconSize')
      })
    })
    it('sizes increase in order', () => {
      const heights = Object.values(componentSize).map((s) => parseInt(s.height))
      for (let i = 1; i < heights.length; i++) {
        expect(heights[i]).toBeGreaterThan(heights[i - 1])
      }
    })
  })

  describe('animation', () => {
    it('has duration and easing keys', () => {
      expect(animation.duration.instant).toBe('0ms')
      expect(animation.easing.spring).toBeDefined()
    })
  })

  describe('zIndex', () => {
    it('layers are ordered', () => {
      expect(zIndex.tooltip).toBeGreaterThan(zIndex.modal)
      expect(zIndex.modal).toBeGreaterThan(zIndex.overlay)
    })
  })
})

describe('cn()', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })
  it('filters falsy values', () => {
    expect(cn('foo', false && 'bar', undefined, null, '')).toBe('foo')
  })
  it('handles conditional objects', () => {
    expect(cn({ active: true, hidden: false })).toBe('active')
  })
  it('handles arrays', () => {
    expect(cn(['a', 'b', false && 'c'])).toBe('a b')
  })
})
