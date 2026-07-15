import type { NodeColor, TreeStep } from './types'

interface Node {
  value: number
  color: NodeColor
  left: Node | null
  right: Node | null
  parent: Node | null
}

// Exercises both fixup paths: an early run of increasing values forces
// rotation-based fixups (uncle black), and later insertions land under a
// red uncle, forcing the recolor-and-move-up case instead.
const INSERT_SEQUENCE = [10, 20, 30, 15, 25, 5, 1, 7]

export function* redBlackTree(): Generator<TreeStep> {
  let root: Node | null = null
  for (const value of INSERT_SEQUENCE) {
    root = yield* insert(root, value)
  }
  yield { type: 'done' }
}

function* insert(root: Node | null, value: number): Generator<TreeStep, Node> {
  let parent: Node | null = null
  let current = root
  while (current) {
    yield { type: 'compare', value: current.value, target: value }
    parent = current
    current = value < current.value ? current.left : current.right
  }

  const side: 'left' | 'right' | null = parent ? (value < parent.value ? 'left' : 'right') : null
  const node: Node = { value, color: 'red', left: null, right: null, parent }
  yield { type: 'insert', value, parentValue: parent ? parent.value : null, side, color: 'red' }

  if (!parent) root = node
  else if (side === 'left') parent.left = node
  else parent.right = node

  root = yield* fixup(root!, node)

  if (root.color !== 'black') yield* recolor(root, 'black')
  return root
}

function* fixup(root: Node, start: Node): Generator<TreeStep, Node> {
  let z = start

  while (z.parent && z.parent.color === 'red') {
    const parent = z.parent
    const grandparent = parent.parent!

    if (parent === grandparent.left) {
      const uncle = grandparent.right
      if (uncle && uncle.color === 'red') {
        yield* recolor(parent, 'black')
        yield* recolor(uncle, 'black')
        yield* recolor(grandparent, 'red')
        z = grandparent
      } else {
        if (z === parent.right) {
          z = parent
          root = yield* leftRotate(root, z)
        }
        yield* recolor(z.parent!, 'black')
        yield* recolor(z.parent!.parent!, 'red')
        root = yield* rightRotate(root, z.parent!.parent!)
      }
    } else {
      const uncle = grandparent.left
      if (uncle && uncle.color === 'red') {
        yield* recolor(parent, 'black')
        yield* recolor(uncle, 'black')
        yield* recolor(grandparent, 'red')
        z = grandparent
      } else {
        if (z === parent.left) {
          z = parent
          root = yield* rightRotate(root, z)
        }
        yield* recolor(z.parent!, 'black')
        yield* recolor(z.parent!.parent!, 'red')
        root = yield* leftRotate(root, z.parent!.parent!)
      }
    }
  }

  return root
}

function* recolor(node: Node, color: NodeColor): Generator<TreeStep> {
  node.color = color
  yield { type: 'recolor', value: node.value, color }
}

function parentInfo(node: Node): { parentValue: number | null; side: 'left' | 'right' | null } {
  if (!node.parent) return { parentValue: null, side: null }
  return { parentValue: node.parent.value, side: node.parent.left === node ? 'left' : 'right' }
}

function* leftRotate(root: Node, x: Node): Generator<TreeStep, Node> {
  const { parentValue, side } = parentInfo(x)
  yield { type: 'rotate', direction: 'left', pivotValue: x.value, parentValue, side }

  const y = x.right!
  x.right = y.left
  if (y.left) y.left.parent = x
  y.parent = x.parent
  if (!x.parent) root = y
  else if (x.parent.left === x) x.parent.left = y
  else x.parent.right = y
  y.left = x
  x.parent = y

  return root
}

function* rightRotate(root: Node, x: Node): Generator<TreeStep, Node> {
  const { parentValue, side } = parentInfo(x)
  yield { type: 'rotate', direction: 'right', pivotValue: x.value, parentValue, side }

  const y = x.left!
  x.left = y.right
  if (y.right) y.right.parent = x
  y.parent = x.parent
  if (!x.parent) root = y
  else if (x.parent.left === x) x.parent.left = y
  else x.parent.right = y
  y.right = x
  x.parent = y

  return root
}
