import type { DistributionStep } from './types'

export function* radixSort(input: number[]): Generator<DistributionStep> {
  const max = Math.max(...input)
  let arr = [...input]

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const buckets: number[][] = Array.from({ length: 10 }, () => [])

    for (let i = 0; i < arr.length; i++) {
      const digit = Math.floor(arr[i] / exp) % 10
      buckets[digit].push(arr[i])
      yield { type: 'place', fromIndex: i, bucketIndex: digit, value: arr[i] }
    }

    const next: number[] = []
    let k = 0
    for (let digit = 0; digit < 10; digit++) {
      for (const value of buckets[digit]) {
        yield { type: 'write', toIndex: k, value, fromBucket: digit }
        next.push(value)
        k++
      }
    }
    arr = next
  }

  yield { type: 'done' }
}
