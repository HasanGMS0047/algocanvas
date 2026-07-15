import { describe, expect, it } from 'vitest'
import { binarySearch } from './binarySearch'
import type { SearchStep } from './types'

const SORTED = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91]

function probesOf(steps: SearchStep[]) {
  return steps.filter((s) => s.type === 'probe').map((s) => (s.type === 'probe' ? s.index : -1))
}

describe('binarySearch', () => {
  it('finds a middle target with the hand-traced probe sequence', () => {
    const steps = [...binarySearch(SORTED, 23)]
    expect(probesOf(steps)).toEqual([5])
    expect(steps.find((s) => s.type === 'found')).toEqual({ type: 'found', index: 5 })
  })

  it('finds the last element', () => {
    const steps = [...binarySearch(SORTED, 91)]
    expect(probesOf(steps)).toEqual([5, 8, 9, 10])
    expect(steps.find((s) => s.type === 'found')).toEqual({ type: 'found', index: 10 })
  })

  it('finds the first element', () => {
    const steps = [...binarySearch(SORTED, 2)]
    expect(probesOf(steps)).toEqual([5, 2, 0])
    expect(steps.find((s) => s.type === 'found')).toEqual({ type: 'found', index: 0 })
  })

  it('reports not found for a value outside the range', () => {
    const steps = [...binarySearch(SORTED, 1)]
    expect(steps.find((s) => s.type === 'notFound')).toBeDefined()
    expect(steps.find((s) => s.type === 'found')).toBeUndefined()
  })

  it('reports not found for a value inside the range but absent', () => {
    const steps = [...binarySearch(SORTED, 99)]
    expect(steps.find((s) => s.type === 'notFound')).toBeDefined()
  })

  it('shrinks the [lo, hi] range with every probe', () => {
    const steps = [...binarySearch(SORTED, 99)].filter((s) => s.type === 'probe')
    for (let i = 1; i < steps.length; i++) {
      const prev = steps[i - 1] as { range: [number, number] }
      const curr = steps[i] as { range: [number, number] }
      const prevSize = prev.range[1] - prev.range[0]
      const currSize = curr.range[1] - curr.range[0]
      expect(currSize).toBeLessThan(prevSize)
    }
  })

  it('finds a duplicate value (returns some valid occurrence)', () => {
    const dup = [1, 3, 3, 3, 5, 7]
    const steps = [...binarySearch(dup, 3)]
    const found = steps.find((s) => s.type === 'found')
    expect(found).toBeDefined()
    expect(dup[(found as { index: number }).index]).toBe(3)
  })
})
