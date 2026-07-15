import type { DistributionStep } from './types'

export function* countingSort(input: number[]): Generator<DistributionStep> {
  const max = Math.max(...input)
  const counts = new Array(max + 1).fill(0)

  for (let i = 0; i < input.length; i++) {
    counts[input[i]]++
    yield { type: 'place', fromIndex: i, bucketIndex: input[i], value: input[i] }
  }

  let k = 0
  for (let value = 0; value <= max; value++) {
    for (let c = 0; c < counts[value]; c++) {
      yield { type: 'write', toIndex: k, value, fromBucket: value }
      k++
    }
  }

  yield { type: 'done' }
}
