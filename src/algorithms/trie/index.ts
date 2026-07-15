import { DEFAULT_WORDS, trie } from './trie'
import type { TrieStep } from './types'

const CATEGORY = 'Trees'

export interface TrieAlgorithm {
  id: string
  name: string
  category: string
  run: (words?: string[]) => Generator<TrieStep>
  defaultWords: string[]
}

export const TRIE_ALGORITHMS: TrieAlgorithm[] = [
  { id: 'trie', name: 'Trie', category: CATEGORY, run: trie, defaultWords: DEFAULT_WORDS },
]
