import type { TrieNodeSpec, TrieStep } from './types'

interface Node {
  char: string
  isEnd: boolean
  children: Map<string, Node>
}

// cat/car/card share the "ca"/"car" prefix; "do" is itself a complete word
// AND a prefix of "dog", demonstrating a node that's both an end-of-word and
// has further children.
const INSERT_WORDS = ['cat', 'car', 'card', 'dog', 'do']
const SEARCH_HIT = 'car'
const SEARCH_MISS_PREFIX_ONLY = 'ca' // real path, but never marked end-of-word
const SEARCH_MISS_NO_PATH = 'cow' // path itself doesn't exist

export function* trie(): Generator<TrieStep> {
  const root: Node = { char: '', isEnd: false, children: new Map() }
  yield { type: 'start', snapshot: null }

  for (const word of INSERT_WORDS) {
    yield* insertWord(root, word)
  }

  yield* search(root, SEARCH_HIT)
  yield* search(root, SEARCH_MISS_PREFIX_ONLY)
  yield* search(root, SEARCH_MISS_NO_PATH)

  yield { type: 'done', snapshot: cloneNode(root) }
}

function* insertWord(root: Node, word: string): Generator<TrieStep> {
  let current = root
  let path = ''
  for (const ch of word) {
    path += ch
    yield { type: 'visit', path, snapshot: cloneNode(root) }
    if (!current.children.has(ch)) {
      current.children.set(ch, { char: ch, isEnd: false, children: new Map() })
      yield { type: 'createNode', path, snapshot: cloneNode(root) }
    }
    current = current.children.get(ch)!
  }
  current.isEnd = true
  yield { type: 'markEnd', path, snapshot: cloneNode(root) }
}

function* search(root: Node, word: string): Generator<TrieStep> {
  let current = root
  let path = ''
  for (const ch of word) {
    path += ch
    yield { type: 'visit', path, snapshot: cloneNode(root) }
    const next = current.children.get(ch)
    if (!next) {
      yield { type: 'notFound', word, reason: 'no-path', snapshot: cloneNode(root) }
      return
    }
    current = next
  }

  if (current.isEnd) {
    yield { type: 'found', word, snapshot: cloneNode(root) }
  } else {
    yield { type: 'notFound', word, reason: 'not-a-word', snapshot: cloneNode(root) }
  }
}

function cloneNode(node: Node): TrieNodeSpec {
  return {
    char: node.char,
    isEnd: node.isEnd,
    children: [...node.children.values()].sort((a, b) => a.char.localeCompare(b.char)).map(cloneNode),
  }
}
