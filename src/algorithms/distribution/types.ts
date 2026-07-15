export type DistributionStep =
  | { type: 'start' }
  | { type: 'place'; fromIndex: number; bucketIndex: number; value: number }
  | { type: 'sortBucket'; bucketIndex: number; values: number[] }
  | { type: 'write'; toIndex: number; value: number; fromBucket: number }
  | { type: 'done' }

export interface DistributionFrame {
  step: DistributionStep
  array: number[]
  buckets: number[][]
}
