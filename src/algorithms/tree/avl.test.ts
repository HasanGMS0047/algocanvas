import { describe, expect, it } from 'vitest'
import { avlTree } from './avl'
import { recordTreeFrames } from './recordTreeFrames'
import type { TreeNodeSpec } from './types'

function height(node: TreeNodeSpec | null): number {
  if (!node) return 0
  return 1 + Math.max(height(node.left ?? null), height(node.right ?? null))
}

function maxAbsBalanceFactor(node: TreeNodeSpec | null): number {
  if (!node) return 0
  const bf = Math.abs(height(node.left ?? null) - height(node.right ?? null))
  return Math.max(bf, maxAbsBalanceFactor(node.left ?? null), maxAbsBalanceFactor(node.right ?? null))
}

function inorder(node: TreeNodeSpec | null, out: number[] = []): number[] {
  if (!node) return out
  inorder(node.left ?? null, out)
  out.push(node.value)
  inorder(node.right ?? null, out)
  return out
}

describe('avlTree', () => {
  it('never exceeds a balance factor of 2 mid-rebalance, and settles to at most 1', () => {
    const frames = recordTreeFrames(avlTree)
    for (const frame of frames) {
      expect(maxAbsBalanceFactor(frame.root)).toBeLessThanOrEqual(2)
    }
    const final = frames[frames.length - 1]
    expect(maxAbsBalanceFactor(final.root)).toBeLessThanOrEqual(1)
  })

  it('maintains BST ordering at every frame', () => {
    const frames = recordTreeFrames(avlTree)
    for (const frame of frames) {
      const values = inorder(frame.root)
      expect(values).toEqual([...values].sort((a, b) => a - b))
    }
  })

  it('produces the expected final tree (hand-traced: 2 single rotations + 1 double rotation)', () => {
    const frames = recordTreeFrames(avlTree)
    const final = frames[frames.length - 1].root

    expect(final).toEqual({
      value: 30,
      left: { value: 20, left: { value: 10 }, right: { value: 25 } },
      right: { value: 40, right: { value: 50 } },
    })
  })

  it('rotates exactly as hand-traced: RR, RR, then RL (right-then-left)', () => {
    const frames = recordTreeFrames(avlTree)
    const rotateSteps = frames.map((f) => f.step).filter((s) => s.type === 'rotate')

    expect(rotateSteps).toEqual([
      { type: 'rotate', direction: 'left', pivotValue: 10, parentValue: null, side: null },
      { type: 'rotate', direction: 'left', pivotValue: 30, parentValue: 20, side: 'right' },
      { type: 'rotate', direction: 'right', pivotValue: 40, parentValue: 20, side: 'right' },
      { type: 'rotate', direction: 'left', pivotValue: 20, parentValue: null, side: null },
    ])
  })
})
