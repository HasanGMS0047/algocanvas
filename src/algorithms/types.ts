export type SortStep =
  | { type: 'start' }
  | { type: 'compare'; indices: [number, number] }
  | { type: 'swap'; indices: [number, number] }
  | { type: 'done' }
