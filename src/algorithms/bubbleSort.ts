import type { SortStep } from './types'

export function* bubbleSort(input: number[]): Generator<SortStep> {
  const arr = [...input]
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      yield { type: 'compare', indices: [j, j + 1] }
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        yield { type: 'swap', indices: [j, j + 1] }
      }
    }
  }

  yield { type: 'done' }
}
