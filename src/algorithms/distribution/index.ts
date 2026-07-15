import { bucketSort } from './bucketSort'
import { countingSort } from './countingSort'
import { radixSort } from './radixSort'
import type { DistributionStep } from './types'

const CATEGORY = 'Non-Comparison Sorts'

export interface DistributionAlgorithm {
  id: string
  name: string
  category: string
  run: (arr: number[]) => Generator<DistributionStep>
  bucketCount: number
  demoArray: number[]
}

export const DISTRIBUTION_ALGORITHMS: DistributionAlgorithm[] = [
  {
    // countingSort buckets by value directly (bucketIndex === value), so
    // bucketCount must exceed demoArray's max - unlike radix/bucket sort,
    // whose bucket counts don't depend on the values' magnitude.
    id: 'counting',
    name: 'Counting Sort',
    category: CATEGORY,
    run: countingSort,
    bucketCount: 10,
    demoArray: [4, 2, 7, 1, 9, 4, 2, 6, 1, 3],
  },
  {
    id: 'radix',
    name: 'Radix Sort',
    category: CATEGORY,
    run: radixSort,
    bucketCount: 10,
    demoArray: [8, 3, 9, 1, 6, 4, 7, 2, 5, 10],
  },
  {
    id: 'bucket',
    name: 'Bucket Sort',
    category: CATEGORY,
    run: bucketSort,
    bucketCount: 5,
    demoArray: [8, 3, 9, 1, 6, 4, 7, 2, 5, 10],
  },
]
