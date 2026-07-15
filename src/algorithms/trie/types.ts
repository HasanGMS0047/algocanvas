export interface TrieNodeSpec {
  char: string
  isEnd: boolean
  children: TrieNodeSpec[]
}

interface TrieStepBase {
  // Same reasoning as B-Tree: nodes are keyed by character and have variable
  // arity, so the generator hands over a full snapshot each step rather than
  // minimal params for a generic replay.
  snapshot: TrieNodeSpec | null
}

export type TrieStep =
  | (TrieStepBase & { type: 'start' })
  | (TrieStepBase & { type: 'visit'; path: string })
  | (TrieStepBase & { type: 'createNode'; path: string })
  | (TrieStepBase & { type: 'markEnd'; path: string })
  | (TrieStepBase & { type: 'found'; word: string })
  | (TrieStepBase & { type: 'notFound'; word: string; reason: 'no-path' | 'not-a-word' })
  | (TrieStepBase & { type: 'done' })

export interface TrieFrame {
  step: TrieStep
  root: TrieNodeSpec | null
}
