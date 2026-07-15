export type LisStep =
  | { type: 'start' }
  | { type: 'compare'; i: number; j: number }
  | { type: 'update'; index: number; length: number }
  | { type: 'reconstruct'; index: number }
  | { type: 'done' }
