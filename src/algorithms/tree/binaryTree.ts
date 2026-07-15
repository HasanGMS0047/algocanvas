import type { TreeNodeSpec, TreeStep } from './types'

// Deliberately full and complete but NOT perfect: node 3 is a leaf at depth 1
// while 4 and 5 are leaves at depth 2, so leaves aren't all at the same depth.
// This is the instructive case - it shows full+complete doesn't imply perfect.
export const DEMO_TREE: TreeNodeSpec = {
  value: 1,
  left: { value: 2, left: { value: 4 }, right: { value: 5 } },
  right: { value: 3 },
}

export function* binaryTree(): Generator<TreeStep> {
  yield* insertLevelOrder(DEMO_TREE)
  yield {
    type: 'classify',
    full: isFull(DEMO_TREE),
    complete: isComplete(DEMO_TREE),
    perfect: isPerfect(DEMO_TREE),
  }
  yield { type: 'done' }
}

interface QueueItem {
  node: TreeNodeSpec
  parentValue: number | null
  side: 'left' | 'right' | null
}

function* insertLevelOrder(spec: TreeNodeSpec): Generator<TreeStep> {
  const queue: QueueItem[] = [{ node: spec, parentValue: null, side: null }]

  while (queue.length > 0) {
    const { node, parentValue, side } = queue.shift()!
    yield { type: 'insert', value: node.value, parentValue, side }
    if (node.left) queue.push({ node: node.left, parentValue: node.value, side: 'left' })
    if (node.right) queue.push({ node: node.right, parentValue: node.value, side: 'right' })
  }
}

function isFull(node: TreeNodeSpec | null): boolean {
  if (!node) return true
  const hasLeft = Boolean(node.left)
  const hasRight = Boolean(node.right)
  if (hasLeft !== hasRight) return false
  return isFull(node.left ?? null) && isFull(node.right ?? null)
}

function height(node: TreeNodeSpec | null): number {
  if (!node) return 0
  return 1 + Math.max(height(node.left ?? null), height(node.right ?? null))
}

function isPerfect(node: TreeNodeSpec | null): boolean {
  const deepestLevel = height(node) - 1

  function check(n: TreeNodeSpec | null, level: number): boolean {
    if (!n) return true
    if (!n.left && !n.right) return level === deepestLevel
    if (!n.left || !n.right) return false
    return check(n.left, level + 1) && check(n.right, level + 1)
  }

  return check(node, 0)
}

function isComplete(root: TreeNodeSpec | null): boolean {
  const queue: Array<TreeNodeSpec | null> = [root]
  let seenGap = false

  while (queue.length > 0) {
    const node = queue.shift()
    if (!node) {
      seenGap = true
      continue
    }
    if (seenGap) return false
    queue.push(node.left ?? null)
    queue.push(node.right ?? null)
  }

  return true
}
