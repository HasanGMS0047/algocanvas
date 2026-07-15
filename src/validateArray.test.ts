import { describe, expect, it } from 'vitest'
import { validateArray } from './validateArray'

describe('validateArray', () => {
  it('accepts a normal array for a comparison sort', () => {
    expect(validateArray([8, 3, 9, 1], 'bubble')).toEqual({ valid: true })
  })

  it('rejects an empty array', () => {
    expect(validateArray([], 'bubble').valid).toBe(false)
  })

  it('rejects an array longer than 20', () => {
    const long = Array.from({ length: 21 }, (_, i) => i)
    expect(validateArray(long, 'bubble').valid).toBe(false)
  })

  it('accepts exactly 20 elements', () => {
    const exact = Array.from({ length: 20 }, (_, i) => i)
    expect(validateArray(exact, 'bubble').valid).toBe(true)
  })

  it('rejects non-integer values', () => {
    expect(validateArray([1, 2.5, 3], 'bubble').valid).toBe(false)
  })

  it('rejects negative values for counting sort specifically', () => {
    expect(validateArray([1, -2, 3], 'counting').valid).toBe(false)
  })

  it('rejects negative values for radix sort too (digit bucketing goes negative)', () => {
    expect(validateArray([1, -2, 3], 'radix').valid).toBe(false)
  })

  it('allows negative values for other algorithms', () => {
    expect(validateArray([1, -2, 3], 'bubble').valid).toBe(true)
    expect(validateArray([1, -2, 3], 'quick').valid).toBe(true)
  })
})
