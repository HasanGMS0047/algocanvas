import { bubbleSort } from './bubbleSort'
import { insertionSort } from './insertionSort'
import { mergeSort } from './mergeSort'
import { quickSort } from './quickSort'
import { selectionSort } from './selectionSort'
import type { SortStep } from './types'

const CATEGORY = 'Comparison Sorts'

export interface SortAlgorithm {
  id: string
  name: string
  category: string
  run: (arr: number[]) => Generator<SortStep>
}

// Heap Sort lives in algorithms/heap - it's rendered as a tree, not bars,
// so it doesn't share this family's SortStep/frame shape. See
// algorithms/heap/index.ts.
export const SORT_ALGORITHMS: SortAlgorithm[] = [
  { id: 'bubble', name: 'Bubble Sort', category: CATEGORY, run: bubbleSort },
  { id: 'selection', name: 'Selection Sort', category: CATEGORY, run: selectionSort },
  { id: 'insertion', name: 'Insertion Sort', category: CATEGORY, run: insertionSort },
  { id: 'quick', name: 'Quick Sort', category: CATEGORY, run: quickSort },
  { id: 'merge', name: 'Merge Sort', category: CATEGORY, run: mergeSort },
]
