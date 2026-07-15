import type { SortStep } from './types'

export function* insertionSort(input: number[]): Generator<SortStep> {
  const arr = [...input]
  const n = arr.length

  for (let i = 1; i < n; i++) {
    let j = i
    while (j > 0) {
      yield { type: 'compare', indices: [j - 1, j] }
      if (arr[j - 1] <= arr[j]) break

      ;[arr[j - 1], arr[j]] = [arr[j], arr[j - 1]]
      yield { type: 'swap', indices: [j - 1, j] }
      j--
    }
  }

  yield { type: 'done' }
}
