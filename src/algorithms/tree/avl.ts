import type { TreeStep } from './types'

interface Node {
  value: number
  left: Node | null
  right: Node | null
  height: number
}

// Chosen to hit both rotation shapes: 10,20,30 forces a single left rotation
// (RR case) as soon as it's inserted; 40,50 forces another single left
// rotation; then 25 forces a right-then-left double rotation (RL case) at
// the root. Used as the default when no custom sequence is provided. Scoped
// to insert only - delete-with-rebalancing is a distinct, more involved
// algorithm and isn't what this step is demonstrating.
export const DEFAULT_INSERT_SEQUENCE = [10, 20, 30, 40, 50, 25]

export function* avlTree(insertSequence: number[] = DEFAULT_INSERT_SEQUENCE): Generator<TreeStep> {
  let root: Node | null = null
  for (const value of insertSequence) {
    root = yield* insert(root, value, null, null)
  }
  yield { type: 'done' }
}

function nodeHeight(node: Node | null): number {
  return node ? node.height : 0
}

function updateHeight(node: Node) {
  node.height = 1 + Math.max(nodeHeight(node.left), nodeHeight(node.right))
}

function balanceFactor(node: Node): number {
  return nodeHeight(node.left) - nodeHeight(node.right)
}

function* insert(
  node: Node | null,
  value: number,
  parentValue: number | null,
  side: 'left' | 'right' | null,
): Generator<TreeStep, Node> {
  if (!node) {
    yield { type: 'insert', value, parentValue, side }
    return { value, left: null, right: null, height: 1 }
  }

  yield { type: 'compare', value: node.value, target: value }
  if (value < node.value) {
    node.left = yield* insert(node.left, value, node.value, 'left')
  } else {
    node.right = yield* insert(node.right, value, node.value, 'right')
  }

  updateHeight(node)
  return yield* rebalance(node, parentValue, side)
}

function* rebalance(node: Node, parentValue: number | null, side: 'left' | 'right' | null): Generator<TreeStep, Node> {
  const bf = balanceFactor(node)

  if (bf > 1) {
    if (balanceFactor(node.left!) < 0) {
      node.left = yield* rotateLeft(node.left!, node.value, 'left')
    }
    return yield* rotateRight(node, parentValue, side)
  }

  if (bf < -1) {
    if (balanceFactor(node.right!) > 0) {
      node.right = yield* rotateRight(node.right!, node.value, 'right')
    }
    return yield* rotateLeft(node, parentValue, side)
  }

  return node
}

function* rotateRight(
  node: Node,
  parentValue: number | null,
  side: 'left' | 'right' | null,
): Generator<TreeStep, Node> {
  yield { type: 'rotate', direction: 'right', pivotValue: node.value, parentValue, side }
  const newRoot = node.left!
  node.left = newRoot.right
  newRoot.right = node
  updateHeight(node)
  updateHeight(newRoot)
  return newRoot
}

function* rotateLeft(node: Node, parentValue: number | null, side: 'left' | 'right' | null): Generator<TreeStep, Node> {
  yield { type: 'rotate', direction: 'left', pivotValue: node.value, parentValue, side }
  const newRoot = node.right!
  node.right = newRoot.left
  newRoot.left = node
  updateHeight(node)
  updateHeight(newRoot)
  return newRoot
}
