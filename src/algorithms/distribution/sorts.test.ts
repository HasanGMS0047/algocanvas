import { describe, expect, it } from 'vitest'
import { bucketSort } from './bucketSort'
import { countingSort } from './countingSort'
import { radixSort } from './radixSort'
import { recordDistributionFrames } from './recordDistributionFrames'
import type { DistributionStep } from './types'

// countingSort buckets by value directly (bucketIndex === value), so its
// bucketCount (10, matching the app's registry) must exceed every test
// case's max value - unlike radix/bucket sort, whose bucket counts are
// independent of value magnitude. See algorithms/distribution/index.ts.
const COUNTING_SAFE_CASES = [
  { name: 'typical', input: [4, 2, 7, 1, 9, 4, 2, 6, 1, 3] },
  { name: 'duplicates', input: [5, 3, 5, 1, 3, 5, 1, 2] },
  { name: 'already sorted', input: [1, 2, 3, 4, 5, 6] },
  { name: 'reverse sorted', input: [6, 5, 4, 3, 2, 1] },
  { name: 'single element', input: [4] },
  { name: 'two elements', input: [2, 1] },
  { name: 'all equal', input: [7, 7, 7, 7] },
]

const GENERAL_CASES = [
  { name: 'typical (2-digit)', input: [8, 3, 9, 1, 6, 4, 7, 2, 5, 10] },
  { name: 'duplicates', input: [5, 3, 5, 1, 3, 5, 1, 2] },
  { name: 'already sorted', input: [1, 2, 3, 4, 5, 6] },
  { name: 'reverse sorted', input: [6, 5, 4, 3, 2, 1] },
  { name: 'single element', input: [4] },
  { name: 'two elements', input: [2, 1] },
  { name: 'all equal', input: [7, 7, 7, 7] },
]

function finalArray(algorithm: (arr: number[]) => Generator<DistributionStep>, bucketCount: number, input: number[]) {
  const frames = recordDistributionFrames(input, bucketCount, algorithm)
  return frames[frames.length - 1].array
}

describe('countingSort', () => {
  it.each(COUNTING_SAFE_CASES)('sorts correctly: $name', ({ input }) => {
    const expected = [...input].sort((a, b) => a - b)
    expect(finalArray(countingSort, 10, input)).toEqual(expected)
  })
})

describe('radixSort', () => {
  it.each(GENERAL_CASES)('sorts correctly: $name', ({ input }) => {
    const expected = [...input].sort((a, b) => a - b)
    expect(finalArray(radixSort, 10, input)).toEqual(expected)
  })
})

describe('bucketSort', () => {
  it.each(GENERAL_CASES)('sorts correctly: $name', ({ input }) => {
    const expected = [...input].sort((a, b) => a - b)
    expect(finalArray(bucketSort, 5, input)).toEqual(expected)
  })
})
