import { bTree, DEFAULT_INSERT_SEQUENCE } from './btree'
import type { BTreeStep } from './types'

const CATEGORY = 'Trees'

export interface BTreeAlgorithm {
  id: string
  name: string
  category: string
  run: (insertSequence?: number[]) => Generator<BTreeStep>
  defaultSequence: number[]
}

export const BTREE_ALGORITHMS: BTreeAlgorithm[] = [
  { id: 'btree', name: 'B-Tree', category: CATEGORY, run: bTree, defaultSequence: DEFAULT_INSERT_SEQUENCE },
]
