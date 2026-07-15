import type { TreeFrame, TreeNodeSpec, TreeStep } from './types'

export function recordTreeFrames(spec: TreeNodeSpec, run: (spec: TreeNodeSpec) => Generator<TreeStep>): TreeFrame[] {
  let root: TreeNodeSpec | null = null
  let classification: TreeFrame['classification'] = null
  const frames: TreeFrame[] = [{ step: { type: 'start' }, root, classification }]

  for (const step of run(spec)) {
    if (step.type === 'insert') {
      root = insertNode(root, step.value, step.parentValue, step.side)
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
  attach(next, parentValue, side!, newNode)
  return next
}

function attach(node: TreeNodeSpec, parentValue: number, side: 'left' | 'right', newNode: TreeNodeSpec) {
  if (node.value === parentValue) {
    if (side === 'left') node.left = newNode
    else node.right = newNode
    return
  }
  if (node.left) attach(node.left, parentValue, side, newNode)
  if (node.right) attach(node.right, parentValue, side, newNode)
}

function cloneTree(node: TreeNodeSpec | null): TreeNodeSpec | null {
  if (!node) return null
  const clone: TreeNodeSpec = { value: node.value }
  if (node.left) clone.left = cloneTree(node.left) ?? undefined
  if (node.right) clone.right = cloneTree(node.right) ?? undefined
  return clone
}
