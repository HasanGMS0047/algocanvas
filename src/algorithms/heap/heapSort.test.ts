import { describe, expect, it } from 'vitest'
import { heapSort } from './heapSort'
import { recordHeapFrames } from './recordHeapFrames'

const CASES: Array<{ name: string; input: number[] }> = [
  { name: 'typical', input: [8, 3, 9, 1, 6, 4, 7, 2, 5, 10] },
  { name: 'duplicates', input: [5, 3, 5, 1, 3, 5, 1, 2] },
  { name: 'already sorted', input: [1, 2, 3, 4, 5, 6] },
  { name: 'reverse sorted', input: [6, 5, 4, 3, 2, 1] },
  { name: 'single element', input: [42] },
  { name: 'two elements', input: [2, 1] },
  { name: 'all equal', input: [7, 7, 7, 7] },
  { name: 'empty', input: [] },
]

describe('heapSort', () => {
  it.each(CASES)('sorts correctly: $name', ({ input }) => {
    const expected = [...input].sort((a, b) => a - b)
    const frames = recordHeapFrames(input, heapSort)
    expect(frames[frames.length - 1].array).toEqual(expected)
  })

  it('is a value-preserving permutation at every frame', () => {
    const input = [8, 3, 9, 1, 6, 4, 7, 2, 5, 10]
    const expectedSorted = [...input].sort((a, b) => a - b)
    const frames = recordHeapFrames(input, heapSort)

    for (const frame of frames) {
      expect([...frame.array].sort((a, b) => a - b)).toEqual(expectedSorted)
    }
  })

  it('heapSize starts at the full array length and decreases by exactly one per extract', () => {
    const input = [8, 3, 9, 1, 6, 4, 7, 2, 5, 10]
    const frames = recordHeapFrames(input, heapSort)
    expect(frames[0].heapSize).toBe(input.length)

    const extractFrames = frames.filter((f) => f.step.type === 'extract')
    expect(extractFrames.map((f) => f.heapSize)).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1])
  })

  it('everything at or beyond heapSize is already in its final sorted position, at every frame', () => {
    const input = [8, 3, 9, 1, 6, 4, 7, 2, 5, 10]
    const expectedSorted = [...input].sort((a, b) => a - b)
    const frames = recordHeapFrames(input, heapSort)

    for (const frame of frames) {
      const sortedSuffix = frame.array.slice(frame.heapSize)
      expect(sortedSuffix).toEqual(expectedSorted.slice(frame.heapSize))
    }
  })

  it('an extract step always names the index that was just swapped to the front of the heap', () => {
    const input = [8, 3, 9, 1, 6, 4, 7, 2, 5, 10]
    const frames = recordHeapFrames(input, heapSort)

    for (let i = 1; i < frames.length; i++) {
      const step = frames[i].step
      if (step.type === 'extract') {
        const prevStep = frames[i - 1].step
        expect(prevStep).toEqual({ type: 'swap', indices: [0, step.index] })
      }
    }
  })

  it('handles an empty array without crashing (heapSize 0, no extracts)', () => {
    const frames = recordHeapFrames([], heapSort)
    expect(frames[0].heapSize).toBe(0)
    expect(frames.some((f) => f.step.type === 'extract')).toBe(false)
    expect(frames[frames.length - 1]).toEqual({ step: { type: 'done' }, array: [], heapSize: 0 })
  })
})
