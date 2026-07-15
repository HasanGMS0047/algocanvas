import { hashTable, TABLE_SIZE } from './hashtable'
import type { HashStep } from './types'

const CATEGORY = 'Hashing'

export interface HashTableAlgorithm {
  id: string
  name: string
  category: string
  run: () => Generator<HashStep>
  bucketCount: number
}

export const HASHTABLE_ALGORITHMS: HashTableAlgorithm[] = [
  { id: 'hashtable', name: 'Hash Table', category: CATEGORY, run: hashTable, bucketCount: TABLE_SIZE },
]
