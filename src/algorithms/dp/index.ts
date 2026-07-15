import { longestIncreasingSubsequence } from './longestIncreasingSubsequence'
import type { LisStep } from './types'

const CATEGORY = 'Dynamic Programming'

export interface DpAlgorithm {
  id: string
  name: string
  category: string
  run: (array: number[]) => Generator<LisStep>
}

export const DP_ALGORITHMS: DpAlgorithm[] = [
  { id: 'lis', name: 'Longest Increasing Subsequence', category: CATEGORY, run: longestIncreasingSubsequence },
]
