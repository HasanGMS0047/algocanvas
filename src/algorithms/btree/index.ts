import { bTree } from './btree'
import type { BTreeStep } from './types'

const CATEGORY = 'Trees'

export interface BTreeAlgorithm {
  id: string
  name: string
  category: string
  run: () => Generator<BTreeStep>
}

export const BTREE_ALGORITHMS: BTreeAlgorithm[] = [{ id: 'btree', name: 'B-Tree', category: CATEGORY, run: bTree }]
