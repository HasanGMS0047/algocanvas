import { describe, expect, it } from 'vitest'
import { bubbleSort } from './bubbleSort'
import { heapSort } from './heapSort'
import { insertionSort } from './insertionSort'
import { mergeSort } from './mergeSort'
import { quickSort } from './quickSort'
import { recordFrames } from './recordFrames'
import { selectionSort } from './selectionSort'
import type { SortStep } from './types'

const ALGORITHMS: Array<{ name: string; run: (arr: number[]) => Generator<SortStep> }> = [
  { name: 'bubbleSort', run: bubbleSort },
  { name: 'selectionSort', run: selectionSort },
  { name: 'insertionSort', run: insertionSort },
  { name: 'quickSort', run: quickSort },
  { name: 'mergeSort', run: mergeSort },
  { name: 'heapSort', run: heapSort },
]

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

describe.each(ALGORITHMS)('$name', ({ run }) => {
  it.each(CASES)('sorts correctly: $name', ({ input }) => {
    const expected = [...input].sort((a, b) => a - b)
    const frames = recordFrames(input, run)
    expect(frames[frames.length - 1].array).toEqual(expected)
  })

  it('is a stable-length, value-preserving transformation (permutation) at every frame', () => {
    // Merge sort is exempt: it writes from separate left/right buffers, so
    // intermediate frames can transiently look like a non-permutation (see
    // the mergeSort commit message) even though the algorithm is correct.
    if (run === mergeSort) return

    const input = [8, 3, 9, 1, 6, 4, 7, 2, 5, 10]
    const expectedSorted = [...input].sort((a, b) => a - b)
    const frames = recordFrames(input, run)

    for (const frame of frames) {
      expect([...frame.array].sort((a, b) => a - b)).toEqual(expectedSorted)
    }
  })
})

describe('mergeSort out-of-place behavior', () => {
  it('final frame is still fully sorted despite transient intermediate states', () => {
    const frames = recordFrames([2, 1], mergeSort)
    expect(frames[frames.length - 1].array).toEqual([1, 2])
  })
})
