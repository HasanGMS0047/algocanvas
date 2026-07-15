import type { TreeStep } from './types'

interface Node {
  value: number
  left: Node | null
  right: Node | null
}

// Chosen to exercise all three delete cases in sequence without disturbing
// the right subtree: delete 4 (leaf) turns 6 into a one-child node; delete 6
// (one child) splices 7 up to be 3's direct right child; delete 3 (now two
// children: 1 and 7) exercises the successor-replace case.
const INSERT_SEQUENCE = [8, 3, 10, 1, 6, 14, 4, 7, 13]
const SEARCH_HIT = 7
const SEARCH_MISS = 5
const DELETE_SEQUENCE = [4, 6, 3]

export function* binarySearchTree(): Generator<TreeStep> {
  let root: Node | null = null

  for (const value of INSERT_SEQUENCE) {
    root = yield* insert(root, value, null, null)
  }

  yield* search(root, SEARCH_HIT)
  yield* search(root, SEARCH_MISS)

  for (const value of DELETE_SEQUENCE) {
    root = yield* removeFrom(root, value, null, null)
  }

  yield { type: 'done' }
}

function* insert(
  node: Node | null,
  value: number,
  parentValue: number | null,
  side: 'left' | 'right' | null,
): Generator<TreeStep, Node> {
  if (!node) {
    yield { type: 'insert', value, parentValue, side }
    return { value, left: null, right: null }
  }

  yield { type: 'compare', value: node.value, target: value }
  if (value < node.value) {
    node.left = yield* insert(node.left, value, node.value, 'left')
  } else {
    node.right = yield* insert(node.right, value, node.value, 'right')
  }
  return node
}

function* search(node: Node | null, target: number): Generator<TreeStep> {
  let current = node
  while (current) {
    yield { type: 'compare', value: current.value, target }
    if (target === current.value) {
      yield { type: 'found', value: current.value }
      return
    }
    current = target < current.value ? current.left : current.right
  }
  yield { type: 'notFound', target }
}

function* removeFrom(
  node: Node | null,
  value: number,
  parentValue: number | null,
  side: 'left' | 'right' | null,
): Generator<TreeStep, Node | null> {
  if (!node) return null

  yield { type: 'compare', value: node.value, target: value }

  if (value < node.value) {
    node.left = yield* removeFrom(node.left, value, node.value, 'left')
    return node
  }
  if (value > node.value) {
    node.right = yield* removeFrom(node.right, value, node.value, 'right')
    return node
  }

  if (node.left && node.right) {
    let successor = node.right
    while (successor.left) successor = successor.left

    yield { type: 'replace', value: node.value, withValue: successor.value }
    node.value = successor.value
    node.right = yield* removeFrom(node.right, successor.value, node.value, 'right')
    return node
  }

  yield { type: 'remove', value: node.value, parentValue, side }
  return node.left ?? node.right ?? null
}
