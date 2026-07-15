import type { SortStep } from './types'

export function* mergeSort(input: number[]): Generator<SortStep> {
  const arr = [...input]
  yield* sort(arr, 0, arr.length - 1)
  yield { type: 'done' }
}

function* sort(arr: number[], low: number, high: number): Generator<SortStep> {
  if (low >= high) return

  const mid = Math.floor((low + high) / 2)
  yield* sort(arr, low, mid)
  yield* sort(arr, mid + 1, high)
  yield* merge(arr, low, mid, high)
}

function* merge(arr: number[], low: number, mid: number, high: number): Generator<SortStep> {
  const left = arr.slice(low, mid + 1)
  const right = arr.slice(mid + 1, high + 1)

  let i = 0
  let j = 0
  let k = low

  while (i < left.length && j < right.length) {
    yield { type: 'compare', indices: [low + i, mid + 1 + j] }
    const value = left[i] <= right[j] ? left[i++] : right[j++]
    arr[k] = value
    yield { type: 'overwrite', index: k, value }
    k++
  }

  while (i < left.length) {
    arr[k] = left[i]
    yield { type: 'overwrite', index: k, value: left[i] }
    i++
    k++
  }

  while (j < right.length) {
    arr[k] = right[j]
    yield { type: 'overwrite', index: k, value: right[j] }
    j++
    k++
  }
}
