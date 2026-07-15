import type { TreeNodeSpec } from './types'

export interface TreeShapeParseResult {
  shape: TreeNodeSpec | null
  error?: string
}

const MAX_NODES = 15

// Level-order array with "null" placeholders for missing children (the
// same convention LeetCode uses for binary tree input), e.g.
// "1, 2, 3, null, null, 4, 5" - a queue-based BFS assigns each pair of
// tokens as the next un-filled node's left/right child, and a null token
// does NOT reserve slots for its own (nonexistent) children.
export function parseTreeShape(text: string): TreeShapeParseResult {
  const tokens = text
    .split(/[,\s]+/)
    .map((t) => t.trim())
    .filter(Boolean)

  if (tokens.length === 0) {
    return { shape: null, error: 'Enter at least a root value, e.g. 1, 2, 3, null, null, 4, 5' }
  }

  const parsed: Array<number | null> = []
  for (const token of tokens) {
    if (/^null$/i.test(token)) {
      parsed.push(null)
      continue
    }
    const value = Number(token)
    if (!Number.isInteger(value)) {
      return { shape: null, error: `Can't parse "${token}". Use whole numbers or "null".` }
    }
    parsed.push(value)
  }

  if (parsed[0] === null) {
    return { shape: null, error: 'The first value (the root) cannot be null.' }
  }

  const nodeCount = parsed.filter((v) => v !== null).length
  if (nodeCount > MAX_NODES) {
    return { shape: null, error: `Use ${MAX_NODES} nodes or fewer so the tree stays readable.` }
  }

  const root: TreeNodeSpec = { value: parsed[0] }
  const queue: TreeNodeSpec[] = [root]
  let i = 1

  while (queue.length > 0 && i < parsed.length) {
    const current = queue.shift()!

    const leftValue = parsed[i++]
    if (leftValue !== null) {
      const leftNode: TreeNodeSpec = { value: leftValue }
      current.left = leftNode
      queue.push(leftNode)
    }

    if (i >= parsed.length) break

    const rightValue = parsed[i++]
    if (rightValue !== null) {
      const rightNode: TreeNodeSpec = { value: rightValue }
      current.right = rightNode
      queue.push(rightNode)
    }
  }

  return { shape: root }
}

// Inverse of parseTreeShape - trims trailing "null" tokens for a cleaner
// display, which is safe because "ran out of tokens" and "explicit null"
// mean the same thing to the parser (see the `i < parsed.length` checks).
export function treeShapeToText(root: TreeNodeSpec): string {
  const tokens: string[] = [String(root.value)]
  const queue: TreeNodeSpec[] = [root]

  while (queue.length > 0) {
    const current = queue.shift()!

    tokens.push(current.left ? String(current.left.value) : 'null')
    if (current.left) queue.push(current.left)

    tokens.push(current.right ? String(current.right.value) : 'null')
    if (current.right) queue.push(current.right)
  }

  while (tokens.length > 1 && tokens[tokens.length - 1] === 'null') {
    tokens.pop()
  }

  return tokens.join(', ')
}
