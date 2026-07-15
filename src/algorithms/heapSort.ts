import type { SortStep } from './types'

export function* heapSort(input: number[]): Generator<SortStep> {
  const arr = [...input]
  const n = arr.length

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* siftDown(arr, n, i)
  }

  for (let end = n - 1; end > 0; end--) {
    ;[arr[0], arr[end]] = [arr[end], arr[0]]
    yield { type: 'swap', indices: [0, end] }
    yield* siftDown(arr, end, 0)
  }

  yield { type: 'done' }
}

function* siftDown(arr: number[], size: number, root: number): Generator<SortStep> {
  let largest = root
  const left = 2 * root + 1
  const right = 2 * root + 2

  if (left < size) {
    yield { type: 'compare', indices: [left, largest] }
    if (arr[left] > arr[largest]) largest = left
  }
  if (right < size) {
    yield { type: 'compare', indices: [right, largest] }
    if (arr[right] > arr[largest]) largest = right
  }

  if (largest !== root) {
    ;[arr[root], arr[largest]] = [arr[largest], arr[root]]
    yield { type: 'swap', indices: [root, largest] }
    yield* siftDown(arr, size, largest)
  }
}
