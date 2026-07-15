export type HeapStep =
  | { type: 'start' }
  | { type: 'compare'; indices: [number, number] }
  | { type: 'swap'; indices: [number, number] }
  // The max just moved to `index` and left the heap for good - the heap
  // shrinks to exclude it. Distinct from 'swap' so the recorder can track
  // the heap/sorted-suffix boundary without inferring it from array state.
  | { type: 'extract'; index: number }
  | { type: 'done' }
