import { heapSort } from './heapSort'
import type { HeapStep } from './types'

const CATEGORY = 'Comparison Sorts'

export interface HeapAlgorithm {
  id: string
  name: string
  category: string
  run: (arr: number[]) => Generator<HeapStep>
}

// Its own registry (not SortAlgorithm) because heap sort is rendered as an
// actual tree diagram, not bars - see render/renderHeap.ts. It still shows
// up under "Comparison Sorts" in the algorithm picker (same CATEGORY
// string), it just has a different data shape than the other five.
export const HEAP_ALGORITHMS: HeapAlgorithm[] = [
  { id: 'heap', name: 'Heap Sort', category: CATEGORY, run: heapSort },
]
