import { describe, expect, it } from 'vitest'
import { binarySearchTree } from './bst'
import { recordTreeFrames } from './recordTreeFrames'
import type { TreeNodeSpec } from './types'

function inorder(node: TreeNodeSpec | null, out: number[] = []): number[] {
  if (!node) return out
  inorder(node.left ?? null, out)
  out.push(node.value)
  inorder(node.right ?? null, out)
  return out
}

describe('binarySearchTree', () => {
  it('maintains the BST ordering invariant at every frame', () => {
    const frames = recordTreeFrames(binarySearchTree)
    for (const frame of frames) {
      const values = inorder(frame.root)
      const sorted = [...values].sort((a, b) => a - b)
      expect(values).toEqual(sorted)
    }
  })

  it('produces the expected final tree after inserts, searches, and deletes', () => {
    const frames = recordTreeFrames(binarySearchTree)
    const final = frames[frames.length - 1].root

    // Hand-traced: insert [8,3,10,1,6,14,4,7,13], then delete [4,6,3] -
    // delete 4 (leaf) leaves 6 with only child 7; delete 6 (one child)
    // splices 7 up under 3; delete 3 (two children: 1, 7) replaces 3's
    // value with successor 7 and removes the original leaf 7.
    expect(final).toEqual({
      value: 8,
      left: { value: 7, left: { value: 1 } },
      right: { value: 10, right: { value: 14, left: { value: 13 } } },
    })
  })

  it('search finds an existing key and reports a missing one as not found', () => {
    const frames = recordTreeFrames(binarySearchTree)
    const foundSteps = frames.map((f) => f.step).filter((s) => s.type === 'found')
    const notFoundSteps = frames.map((f) => f.step).filter((s) => s.type === 'notFound')

    expect(foundSteps).toEqual([{ type: 'found', value: 7 }])
    expect(notFoundSteps).toEqual([{ type: 'notFound', target: 5 }])
  })

  it('exercises all three delete cases: leaf, one-child, and two-child (via replace + remove)', () => {
    const frames = recordTreeFrames(binarySearchTree)
    const removeSteps = frames.map((f) => f.step).filter((s) => s.type === 'remove')
    const replaceSteps = frames.map((f) => f.step).filter((s) => s.type === 'replace')

    expect(removeSteps).toEqual([
      { type: 'remove', value: 4, parentValue: 6, side: 'left' },
      { type: 'remove', value: 6, parentValue: 3, side: 'right' },
      { type: 'remove', value: 7, parentValue: 7, side: 'right' },
    ])
    expect(replaceSteps).toEqual([{ type: 'replace', value: 3, withValue: 7 }])
  })
})
