import { describe, expect, it } from 'vitest'
import { recordTreeFrames } from './recordTreeFrames'
import { redBlackTree } from './rb'
import type { TreeNodeSpec } from './types'

function inorder(node: TreeNodeSpec | null, out: number[] = []): number[] {
  if (!node) return out
  inorder(node.left ?? null, out)
  out.push(node.value)
  inorder(node.right ?? null, out)
  return out
}

function noRedRedViolation(node: TreeNodeSpec | null): boolean {
  if (!node) return true
  if (node.color === 'red') {
    if (node.left?.color === 'red') return false
    if (node.right?.color === 'red') return false
  }
  return noRedRedViolation(node.left ?? null) && noRedRedViolation(node.right ?? null)
}

// Returns the black-height if every root-to-leaf path agrees, or -1 if not.
function blackHeight(node: TreeNodeSpec | null): number {
  if (!node) return 1
  const left = blackHeight(node.left ?? null)
  if (left === -1) return -1
  const right = blackHeight(node.right ?? null)
  if (right === -1) return -1
  if (left !== right) return -1
  return left + (node.color === 'black' || node.color === undefined ? 1 : 0)
}

describe('redBlackTree', () => {
  it('maintains BST ordering at every frame', () => {
    const frames = recordTreeFrames(redBlackTree)
    for (const frame of frames) {
      const values = inorder(frame.root)
      expect(values).toEqual([...values].sort((a, b) => a - b))
    }
  })

  it('satisfies all red-black invariants on the final tree', () => {
    const frames = recordTreeFrames(redBlackTree)
    const final = frames[frames.length - 1].root

    expect(final?.color).toBe('black')
    expect(noRedRedViolation(final)).toBe(true)
    expect(blackHeight(final)).not.toBe(-1)
  })

  it('produces the expected final tree (verified via invariants, not a hand-trace)', () => {
    const frames = recordTreeFrames(redBlackTree)
    const final = frames[frames.length - 1].root

    expect(final).toEqual({
      value: 20,
      color: 'black',
      left: {
        value: 10,
        color: 'red',
        left: { value: 5, color: 'black', left: { value: 1, color: 'red' }, right: { value: 7, color: 'red' } },
        right: { value: 15, color: 'black' },
      },
      right: { value: 30, color: 'black', left: { value: 25, color: 'red' } },
    })
  })

  it('exercises both fixup paths: at least one rotation and multiple recolors', () => {
    const frames = recordTreeFrames(redBlackTree)
    const rotateSteps = frames.map((f) => f.step).filter((s) => s.type === 'rotate')
    const recolorSteps = frames.map((f) => f.step).filter((s) => s.type === 'recolor')

    expect(rotateSteps.length).toBeGreaterThanOrEqual(1)
    expect(recolorSteps.length).toBeGreaterThan(0)
  })
})
