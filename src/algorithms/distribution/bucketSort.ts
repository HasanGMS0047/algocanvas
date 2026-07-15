import type { DistributionStep } from './types'

const BUCKET_COUNT = 5

export function* bucketSort(input: number[]): Generator<DistributionStep> {
  const min = Math.min(...input)
  const max = Math.max(...input)
  const range = (max - min + 1) / BUCKET_COUNT

  const buckets: number[][] = Array.from({ length: BUCKET_COUNT }, () => [])

  for (let i = 0; i < input.length; i++) {
    const value = input[i]
    const bucketIndex = Math.min(Math.floor((value - min) / range), BUCKET_COUNT - 1)
    buckets[bucketIndex].push(value)
    yield { type: 'place', fromIndex: i, bucketIndex, value }
  }

  let k = 0
  for (let b = 0; b < BUCKET_COUNT; b++) {
    const sorted = [...buckets[b]].sort((x, y) => x - y)
    if (sorted.length > 1) {
      yield { type: 'sortBucket', bucketIndex: b, values: sorted }
    }
    for (const value of sorted) {
      yield { type: 'write', toIndex: k, value, fromBucket: b }
      k++
    }
  }

  yield { type: 'done' }
}
