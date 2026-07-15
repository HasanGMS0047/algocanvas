import type { SortStep } from './types'

export function* quickSort(input: number[]): Generator<SortStep> {
  const arr = [...input]
  yield* sort(arr, 0, arr.length - 1)
  yield { type: 'done' }
}

function* sort(arr: number[], low: number, high: number): Generator<SortStep> {
  if (low >= high) return

  const pivotIndex = yield* partition(arr, low, high)
  yield* sort(arr, low, pivotIndex - 1)
  yield* sort(arr, pivotIndex + 1, high)
}

function* partition(arr: number[], low: number, high: number): Generator<SortStep, number> {
  const pivot = arr[high]
  let i = low - 1

  for (let j = low; j < high; j++) {
    yield { type: 'compare', indices: [j, high] }
    if (arr[j] < pivot) {
      i++
      if (i !== j) {
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        yield { type: 'swap', indices: [i, j] }
      }
    }
  }

  if (i + 1 !== high) {
    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    yield { type: 'swap', indices: [i + 1, high] }
  }

  return i + 1
}
