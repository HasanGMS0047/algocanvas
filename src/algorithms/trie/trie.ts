import type { TrieNodeSpec, TrieStep } from './types'

interface Node {
  char: string
  isEnd: boolean
  children: Map<string, Node>
}

// cat/car/card share the "ca"/"car" prefix; "do" is itself a complete word
// AND a prefix of "dog", demonstrating a node that's both an end-of-word and
// has further children.
export const DEFAULT_WORDS = ['cat', 'car', 'card', 'dog', 'do']

export function* trie(words: string[] = DEFAULT_WORDS): Generator<TrieStep> {
  const root: Node = { char: '', isEnd: false, children: new Map() }
  yield { type: 'start', snapshot: null }

  for (const word of words) {
    yield* insertWord(root, word)
  }

  if (words.length > 0) {
    const longest = [...words].sort((a, b) => b.length - a.length)[0]

    yield* search(root, longest)

    const prefixMiss = findPrefixMiss(root, longest)
    if (prefixMiss) yield* search(root, prefixMiss)

    yield* search(root, findNoPathMiss(root, longest))
  }

  yield { type: 'done', snapshot: cloneNode(root) }
}

// Walks the already-built trie along `longest`'s own prefixes and returns
// the shortest one that was never marked end-of-word - a real path that is
// still a legitimate "not a word" miss. Returns null only if every proper
// prefix of `longest` also happens to be a separately inserted word.
function findPrefixMiss(root: Node, longest: string): string | null {
  let node = root
  let path = ''
  for (let i = 0; i < longest.length - 1; i++) {
    node = node.children.get(longest[i])!
    path += longest[i]
    if (!node.isEnd) return path
  }
  return null
}

// Walks to the end of `longest` in the built trie, then finds a letter that
// isn't one of that node's children - guaranteeing a genuine "no path" miss
// regardless of what words were inserted.
function findNoPathMiss(root: Node, longest: string): string {
  let node = root
  for (const ch of longest) {
    node = node.children.get(ch)!
  }
  for (let code = 97; code <= 122; code++) {
    const ch = String.fromCharCode(code)
    if (!node.children.has(ch)) return longest + ch
  }
  return longest + 'zzz'
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
