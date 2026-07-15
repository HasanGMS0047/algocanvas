import type { BTreeNodeSpec, BTreeStep } from './types'

interface Node {
  keys: number[]
  children: Node[]
}

// Minimum degree 2: nodes hold 1-3 keys, internal nodes have 2-4 children
// (this is sometimes called a 2-3-4 tree). Chosen so splits happen quickly
// with small demo values.
const MIN_DEGREE = 2
const MAX_KEYS = 2 * MIN_DEGREE - 1

// 10,20,5 fill the root; 6 forces it to split (the tree grows a level);
// 12,30,7 fill the right-then-left leaf; 17 forces a second, non-root split.
// Used as the default when no custom sequence is provided.
export const DEFAULT_INSERT_SEQUENCE = [10, 20, 5, 6, 12, 30, 7, 17]

export function* bTree(insertSequence: number[] = DEFAULT_INSERT_SEQUENCE): Generator<BTreeStep> {
  let root: Node = { keys: [], children: [] }
  yield { type: 'start', snapshot: null }

  for (const key of insertSequence) {
    root = yield* insert(root, key)
  }

  yield { type: 'done', snapshot: cloneNode(root) }
}

function* insert(root: Node, key: number): Generator<BTreeStep, Node> {
  if (root.keys.length === MAX_KEYS) {
    const newRoot: Node = { keys: [], children: [root] }
    yield* splitChild(newRoot, newRoot, 0, [])
    root = newRoot
  }
  yield* insertNonFull(root, root, key, [])
  return root
}

function* insertNonFull(root: Node, node: Node, key: number, path: number[]): Generator<BTreeStep> {
  yield { type: 'visit', path, snapshot: cloneNode(root) }

  if (node.children.length === 0) {
    let i = node.keys.length - 1
    while (i >= 0 && node.keys[i] > key) i--
    node.keys.splice(i + 1, 0, key)
    yield { type: 'insertKey', key, path, snapshot: cloneNode(root) }
    return
  }

  let i = node.keys.length - 1
  while (i >= 0 && node.keys[i] > key) i--
  i++

  if (node.children[i].keys.length === MAX_KEYS) {
    yield* splitChild(root, node, i, path)
    if (key > node.keys[i]) i++
  }

  yield* insertNonFull(root, node.children[i], key, [...path, i])
}

function* splitChild(root: Node, parent: Node, i: number, parentPath: number[]): Generator<BTreeStep> {
  const t = MIN_DEGREE
  const child = parent.children[i]
  const median = child.keys[t - 1]

  const rightNode: Node = {
    keys: child.keys.slice(t),
    children: child.children.length ? child.children.slice(t) : [],
  }
  child.keys = child.keys.slice(0, t - 1)
  if (child.children.length) child.children = child.children.slice(0, t)

  parent.keys.splice(i, 0, median)
  parent.children.splice(i + 1, 0, rightNode)

  yield { type: 'split', path: [...parentPath, i], medianKey: median, snapshot: cloneNode(root) }
}

function cloneNode(node: Node): BTreeNodeSpec {
  return {
    keys: [...node.keys],
    children: node.children.map(cloneNode),
  }
}
