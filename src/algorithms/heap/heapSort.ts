import type { HeapStep } from './types'

// Same algorithm as every other heap sort implementation - a max-heap is
// built in place, then repeatedly has its root (the max) swapped to the
// end and sifted back down over a shrinking heap. What's different here is
// the explicit `extract` step marking exactly when an index leaves the
// heap for the sorted suffix, which recordHeapFrames turns into a
// heapSize the renderer uses to draw the heap as an actual tree instead of
// bars with an index-order overlay.
export function* heapSort(input: number[]): Generator<HeapStep> {
  const arr = [...input]
  const n = arr.length

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* siftDown(arr, n, i)
  }

  for (let end = n - 1; end > 0; end--) {
    ;[arr[0], arr[end]] = [arr[end], arr[0]]
    yield { type: 'swap', indices: [0, end] }
    yield { type: 'extract', index: end }
    yield* siftDown(arr, end, 0)
  }

  yield { type: 'done' }
}

function* siftDown(arr: number[], size: number, root: number): Generator<HeapStep> {
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
