import { trie } from './trie'
import type { TrieStep } from './types'

const CATEGORY = 'Trees'

export interface TrieAlgorithm {
  id: string
  name: string
  category: string
  run: () => Generator<TrieStep>
}

export const TRIE_ALGORITHMS: TrieAlgorithm[] = [{ id: 'trie', name: 'Trie', category: CATEGORY, run: trie }]
