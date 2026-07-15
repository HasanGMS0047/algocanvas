import { describe, expect, it } from 'vitest'
import { interpolationSearch } from './interpolationSearch'
import type { SearchStep } from './types'

const SORTED = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91]

function probesOf(steps: SearchStep[]) {
  return steps.filter((s) => s.type === 'probe').map((s) => (s.type === 'probe' ? s.index : -1))
}

describe('interpolationSearch', () => {
  it('finds a target with the hand-traced probe sequence', () => {
    const steps = [...interpolationSearch(SORTED, 23)]
    expect(probesOf(steps)).toEqual([2, 3, 4, 5])
    expect(steps.find((s) => s.type === 'found')).toEqual({ type: 'found', index: 5 })
  })

  it('finds the last element directly via interpolation', () => {
    const steps = [...interpolationSearch(SORTED, 91)]
    expect(probesOf(steps)).toEqual([10])
    expect(steps.find((s) => s.type === 'found')).toEqual({ type: 'found', index: 10 })
  })

  it('reports not found without probing when the target is outside [lo, hi]', () => {
    const steps = [...interpolationSearch(SORTED, 1)]
    expect(probesOf(steps)).toEqual([])
    expect(steps.find((s) => s.type === 'notFound')).toBeDefined()
  })

  it('reports not found for a value inside the range but absent', () => {
    const steps = [...interpolationSearch(SORTED, 99)]
    expect(steps.find((s) => s.type === 'notFound')).toBeDefined()
  })

  it('handles all-equal-value ranges without dividing by zero', () => {
    const steps = [...interpolationSearch([4, 4, 4, 4], 4)]
    expect(steps.find((s) => s.type === 'found')).toBeDefined()
    const notFoundSteps = [...interpolationSearch([4, 4, 4, 4], 9)]
    expect(notFoundSteps.find((s) => s.type === 'notFound')).toBeDefined()
  })

  it('finds a duplicate value (returns some valid occurrence)', () => {
    const dup = [1, 3, 3, 3, 5, 7]
    const steps = [...interpolationSearch(dup, 3)]
    const found = steps.find((s) => s.type === 'found')
    expect(found).toBeDefined()
    expect(dup[(found as { index: number }).index]).toBe(3)
  })

  it('handles a single-element array', () => {
    expect([...interpolationSearch([7], 7)].find((s) => s.type === 'found')).toEqual({ type: 'found', index: 0 })
    expect([...interpolationSearch([7], 3)].find((s) => s.type === 'notFound')).toBeDefined()
  })
})
