import { bubbleSort } from './bubbleSort'
import { insertionSort } from './insertionSort'
import { mergeSort } from './mergeSort'
import { quickSort } from './quickSort'
import { selectionSort } from './selectionSort'
import type { SortStep } from './types'

export interface SortAlgorithm {
  id: string
  name: string
  run: (arr: number[]) => Generator<SortStep>
}

export const SORT_ALGORITHMS: SortAlgorithm[] = [
  { id: 'bubble', name: 'Bubble Sort', run: bubbleSort },
  { id: 'selection', name: 'Selection Sort', run: selectionSort },
  { id: 'insertion', name: 'Insertion Sort', run: insertionSort },
  { id: 'quick', name: 'Quick Sort', run: quickSort },
  { id: 'merge', name: 'Merge Sort', run: mergeSort },
]
