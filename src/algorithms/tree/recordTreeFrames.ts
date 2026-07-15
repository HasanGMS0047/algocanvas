import type { TreeFrame, TreeNodeSpec, TreeStep } from './types'

export function recordTreeFrames(run: () => Generator<TreeStep>): TreeFrame[] {
  let root: TreeNodeSpec | null = null
  let classification: TreeFrame['classification'] = null
  const frames: TreeFrame[] = [{ step: { type: 'start' }, root, classification }]

  for (const step of run()) {
    if (step.type === 'insert') {
      root = insertNode(root, step.value, step.parentValue, step.side)
    } else if (step.type === 'replace') {
      root = replaceValue(root, step.value, step.withValue)
    } else if (step.type === 'remove') {
      root = removeNode(root, step.parentValue, step.side)
    } else if (step.type === 'classify') {
      classification = { full: step.full, complete: step.complete, perfect: step.perfect }
    }
    frames.push({ step, root: cloneTree(root), classification })
  }

  return frames
}

function insertNode(
  root: TreeNodeSpec | null,
  value: number,
  parentValue: number | null,
  side: 'left' | 'right' | null,
): TreeNodeSpec {
  const newNode: TreeNodeSpec = { value }
  if (parentValue === null || !root) return newNode

  const next = cloneTree(root)!
  const parent = findByValue(next, parentValue)!
  if (side === 'left') parent.left = newNode
  else parent.right = newNode
  return next
}

function replaceValue(root: TreeNodeSpec | null, oldValue: number, newValue: number): TreeNodeSpec | null {
  const next = cloneTree(root)
  const node = next && findByValue(next, oldValue)
  if (node) node.value = newValue
  return next
}

// Removal is positional (parentValue + side), not a value search, because a
// two-child delete emits 'replace' before 'remove' - at that point two nodes
// can transiently share the same value (the relabeled node and the original
// successor it copied from), so we navigate to the exact slot instead.
function removeNode(
  root: TreeNodeSpec | null,
  parentValue: number | null,
  side: 'left' | 'right' | null,
): TreeNodeSpec | null {
  if (parentValue === null) return null // removing the root itself

  const next = cloneTree(root)!
  const parent = findByValue(next, parentValue)!
  const target = side === 'left' ? parent.left : parent.right
  const replacement = target?.left ?? target?.right

  if (side === 'left') parent.left = replacement
  else parent.right = replacement

  return next
}

function findByValue(node: TreeNodeSpec | null | undefined, value: number): TreeNodeSpec | undefined {
  if (!node) return undefined
  if (node.value === value) return node
  return findByValue(node.left, value) ?? findByValue(node.right, value)
}

function cloneTree(node: TreeNodeSpec | null): TreeNodeSpec | null {
  if (!node) return null
  const clone: TreeNodeSpec = { value: node.value }
  if (node.left) clone.left = cloneTree(node.left) ?? undefined
  if (node.right) clone.right = cloneTree(node.right) ?? undefined
  return clone
}
