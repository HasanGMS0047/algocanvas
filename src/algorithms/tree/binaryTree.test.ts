import { describe, expect, it } from 'vitest'
import { binaryTree, DEMO_TREE, isComplete, isFull, isPerfect } from './binaryTree'
import { recordTreeFrames } from './recordTreeFrames'
import type { TreeStep } from './types'

describe('binaryTree', () => {
  it('builds DEMO_TREE via level-order inserts', () => {
    const frames = recordTreeFrames(binaryTree)
    const insertSteps = frames
      .map((f) => f.step)
      .filter((s): s is Extract<TreeStep, { type: 'insert' }> => s.type === 'insert')
    expect(insertSteps.map((s) => s.value)).toEqual([1, 2, 3, 4, 5])
  })

  it("reports the demo tree's classification correctly (full, complete, not perfect)", () => {
    const frames = recordTreeFrames(binaryTree)
    const final = frames[frames.length - 1]
    expect(final.classification).toEqual({ full: true, complete: true, perfect: false })
  })
})

describe('shape classifiers', () => {
  it('a single node is full, complete, and perfect', () => {
    const tree = { value: 1 }
    expect(isFull(tree)).toBe(true)
    expect(isComplete(tree)).toBe(true)
    expect(isPerfect(tree)).toBe(true)
  })

  it('a 3-node tree with both children filled is full, complete, and perfect', () => {
    const tree = { value: 1, left: { value: 2 }, right: { value: 3 } }
    expect(isFull(tree)).toBe(true)
    expect(isComplete(tree)).toBe(true)
    expect(isPerfect(tree)).toBe(true)
  })

  it('a node with exactly one child is neither full nor complete nor perfect', () => {
    // The gap left by the missing sibling hides node 3, breaking completeness too.
    const tree = { value: 1, left: { value: 2, left: { value: 3 } } }
    expect(isFull(tree)).toBe(false)
    expect(isComplete(tree)).toBe(false)
    expect(isPerfect(tree)).toBe(false)
  })

  it('a gap before a later real node breaks completeness (and full/perfect too here)', () => {
    const tree = {
      value: 1,
      left: { value: 2, left: { value: 4 } },
      right: { value: 3, left: { value: 5 } },
    }
    expect(isFull(tree)).toBe(false)
    expect(isComplete(tree)).toBe(false)
    expect(isPerfect(tree)).toBe(false)
  })

  it('DEMO_TREE itself is full and complete but not perfect', () => {
    expect(isFull(DEMO_TREE)).toBe(true)
    expect(isComplete(DEMO_TREE)).toBe(true)
    expect(isPerfect(DEMO_TREE)).toBe(false)
  })
})
