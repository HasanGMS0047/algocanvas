export type HashStep =
  | { type: 'start' }
  | { type: 'hash'; key: number; bucketIndex: number }
  | { type: 'insert'; key: number; bucketIndex: number }
  | { type: 'compare'; key: number; target: number; bucketIndex: number }
  | { type: 'found'; key: number; bucketIndex: number }
  | { type: 'notFound'; target: number; bucketIndex: number }
  | { type: 'delete'; key: number; bucketIndex: number }
  | { type: 'done' }

export interface HashTableFrame {
  step: HashStep
  buckets: number[][]
}
