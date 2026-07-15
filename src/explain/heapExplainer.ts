import type { HeapFrame } from '../algorithms/heap/recordHeapFrames'

export function explainHeapStep(frame: HeapFrame, _algorithmId: string): string {
  const { step, array, heapSize } = frame

  switch (step.type) {
    case 'start':
      return 'Building a max-heap from the array first: every parent must be at least as large as its children. The tree below shows the heap; sorted elements will collect in the strip beneath it.'
    case 'compare': {
      const [a, b] = step.indices
      return `Comparing the values at heap positions ${a} (${array[a]}) and ${b} (${array[b]}) to find the larger of the two, to check whether the heap property still holds.`
    }
    case 'swap': {
      const [a, b] = step.indices
      return `Swapping positions ${a} and ${b} - either moving the current maximum to the root, or continuing to sift a value down to restore the heap property.`
    }
    case 'extract':
      return `The root of the heap is always the largest remaining value, so swapping it to position ${step.index} places it in its final sorted spot. The heap now shrinks to size ${heapSize}.`
    case 'done':
      return 'The heap is empty and every value has moved into its final sorted position.'
    default:
      return ''
  }
}
