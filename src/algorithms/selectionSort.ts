import type { SortStep } from './types'

export function* selectionSort(input: number[]): Generator<SortStep> {
  const arr = [...input]
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i
    for (let j = i + 1; j < n; j++) {
      yield { type: 'compare', indices: [minIndex, j] }
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    if (minIndex !== i) {
      ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
      yield { type: 'swap', indices: [i, minIndex] }
    }
  }

  yield { type: 'done' }
}
