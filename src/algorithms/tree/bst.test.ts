import { describe, expect, it } from 'vitest'
import { binarySearchTree, DEFAULT_INSERT_SEQUENCE } from './bst'
import { recordTreeFrames } from './recordTreeFrames'
import type { TreeNodeSpec } from './types'

function inorder(node: TreeNodeSpec | null, out: number[] = []): number[] {
  if (!node) return out
  inorder(node.left ?? null, out)
  out.push(node.value)
  inorder(node.right ?? null, out)
  return out
}

describe('binarySearchTree (default sequence)', () => {
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

    // Hand-traced against DEFAULT_INSERT_SEQUENCE = [8,3,10,1,6,14,4,7,13].
    // Search/delete targets are now derived from the sequence itself: hit =
    // last value (13), miss = max+1 (15), delete = first value (8, the
    // root!). Root has two children (3, 10), so deleting it hits the
    // two-child case: 10 is the in-order successor (no left child of its
    // own), so 8 is relabeled to 10 and the original node 10 (which had one
    // child, 14) is spliced out.
    expect(final).toEqual({
      value: 10,
      left: { value: 3, left: { value: 1 }, right: { value: 6, left: { value: 4 }, right: { value: 7 } } },
      right: { value: 14, left: { value: 13 } },
    })
  })

  it('search finds the last-inserted value and reports max+1 as not found', () => {
    const frames = recordTreeFrames(binarySearchTree)
    const foundSteps = frames.map((f) => f.step).filter((s) => s.type === 'found')
    const notFoundSteps = frames.map((f) => f.step).filter((s) => s.type === 'notFound')

    const lastInserted = DEFAULT_INSERT_SEQUENCE[DEFAULT_INSERT_SEQUENCE.length - 1]
    const guaranteedMiss = Math.max(...DEFAULT_INSERT_SEQUENCE) + 1

    expect(foundSteps).toEqual([{ type: 'found', value: lastInserted }])
    expect(notFoundSteps).toEqual([{ type: 'notFound', target: guaranteedMiss }])
  })

  it('deleting the first-inserted value (the root) exercises the two-child replace+remove case', () => {
    const frames = recordTreeFrames(binarySearchTree)
    const removeSteps = frames.map((f) => f.step).filter((s) => s.type === 'remove')
    const replaceSteps = frames.map((f) => f.step).filter((s) => s.type === 'replace')

    expect(replaceSteps).toEqual([{ type: 'replace', value: 8, withValue: 10 }])
    expect(removeSteps).toEqual([{ type: 'remove', value: 10, parentValue: 10, side: 'right' }])
  })
})

describe('binarySearchTree (custom sequence)', () => {
  it('builds correctly and stays a valid BST for an arbitrary custom sequence', () => {
    const custom = [50, 20, 80, 10, 30, 5]
    const frames = recordTreeFrames(() => binarySearchTree(custom))
    const final = frames[frames.length - 1].root

    for (const frame of frames) {
      const values = inorder(frame.root)
      expect(values).toEqual([...values].sort((a, b) => a - b))
    }

    // 5 elements remain after deleting the first-inserted value (50, the
    // root) - confirm nothing was lost or duplicated.
    expect(inorder(final)).toEqual([5, 10, 20, 30, 80])
  })

  it('skips search/delete entirely for a single-element sequence without crashing', () => {
    const frames = recordTreeFrames(() => binarySearchTree([42]))
    const final = frames[frames.length - 1].root
    expect(final).toEqual({ value: 42 })
  })
})
