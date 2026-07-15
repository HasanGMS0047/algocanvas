import type { HeapStep } from './types'

export interface HeapFrame {
  step: HeapStep
  array: number[]
  // Indices [0, heapSize) are the active heap (drawn as a tree); indices
  // [heapSize, array.length) are the sorted suffix (drawn as a plain strip).
  heapSize: number
}

export function recordHeapFrames(input: number[], run: (arr: number[]) => Generator<HeapStep>): HeapFrame[] {
  const array = [...input]
  let heapSize = array.length
  const frames: HeapFrame[] = [{ step: { type: 'start' }, array: [...array], heapSize }]

  for (const step of run(input)) {
    if (step.type === 'swap') {
      const [a, b] = step.indices
      ;[array[a], array[b]] = [array[b], array[a]]
    } else if (step.type === 'extract') {
      heapSize = step.index
    }
    frames.push({ step, array: [...array], heapSize })
  }

  return frames
}
