import { describe, expect, it } from 'vitest'
import { linearSearch } from './linearSearch'
import type { SearchStep } from './types'

function probesOf(steps: SearchStep[]) {
  return steps.filter((s) => s.type === 'probe').map((s) => (s.type === 'probe' ? s.index : -1))
}

describe('linearSearch', () => {
  it('scans left to right until it finds the target', () => {
    const steps = [...linearSearch([2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91], 23)]
    expect(probesOf(steps)).toEqual([0, 1, 2, 3, 4, 5])
    expect(steps.find((s) => s.type === 'found')).toEqual({ type: 'found', index: 5 })
  })

  it('works on an unsorted array (no precondition)', () => {
    const steps = [...linearSearch([9, 1, 7, 3], 7)]
    expect(steps.find((s) => s.type === 'found')).toEqual({ type: 'found', index: 2 })
  })

  it('reports not found and scans every index when the target is absent', () => {
    const steps = [...linearSearch([1, 2, 3], 99)]
    expect(probesOf(steps)).toEqual([0, 1, 2])
    expect(steps.find((s) => s.type === 'notFound')).toBeDefined()
  })

  it('handles a single-element array', () => {
    expect([...linearSearch([7], 7)].find((s) => s.type === 'found')).toEqual({ type: 'found', index: 0 })
    expect([...linearSearch([7], 3)].find((s) => s.type === 'notFound')).toBeDefined()
  })

  it('every run ends with done', () => {
    const steps = [...linearSearch([1, 2, 3], 2)]
    expect(steps[steps.length - 1]).toEqual({ type: 'done' })
  })
})
