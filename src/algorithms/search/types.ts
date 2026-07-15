export type SearchStep =
  | { type: 'start' }
  | { type: 'probe'; index: number; range: [number, number] }
  | { type: 'found'; index: number }
  | { type: 'notFound' }
  | { type: 'done' }
