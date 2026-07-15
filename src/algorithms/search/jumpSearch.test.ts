import { describe, expect, it } from 'vitest'
import { jumpSearch } from './jumpSearch'
import type { SearchStep } from './types'

const SORTED = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91]

function probesOf(steps: SearchStep[]) {
  return steps.filter((s) => s.type === 'probe').map((s) => (s.type === 'probe' ? s.index : -1))
}

describe('jumpSearch', () => {
  it('finds a middle target with the hand-traced probe sequence', () => {
    const steps = [...jumpSearch(SORTED, 23)]
    expect(probesOf(steps)).toEqual([2, 5, 3, 4, 5])
    expect(steps.find((s) => s.type === 'found')).toEqual({ type: 'found', index: 5 })
  })

  it('finds the last element (blocks all the way to the end)', () => {
    const steps = [...jumpSearch(SORTED, 91)]
    expect(probesOf(steps)).toEqual([2, 5, 8, 10, 9, 10])
    expect(steps.find((s) => s.type === 'found')).toEqual({ type: 'found', index: 10 })
  })

  it('finds the first element (first block)', () => {
    const steps = [...jumpSearch(SORTED, 2)]
    expect(probesOf(steps)).toEqual([2, 0])
    expect(steps.find((s) => s.type === 'found')).toEqual({ type: 'found', index: 0 })
  })

  it('reports not found for an absent value', () => {
    const steps = [...jumpSearch(SORTED, 99)]
    expect(steps.find((s) => s.type === 'notFound')).toBeDefined()
    expect(steps.find((s) => s.type === 'found')).toBeUndefined()
  })

  it('handles a single-element array', () => {
    expect([...jumpSearch([7], 7)].find((s) => s.type === 'found')).toEqual({ type: 'found', index: 0 })
    expect([...jumpSearch([7], 3)].find((s) => s.type === 'notFound')).toBeDefined()
  })

  it('handles an empty array without crashing', () => {
    const steps = [...jumpSearch([], 5)]
    expect(steps.find((s) => s.type === 'notFound')).toBeDefined()
  })
})
