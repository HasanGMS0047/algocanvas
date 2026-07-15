import { describe, expect, it } from 'vitest'
import { bTree } from './btree'
import { recordBTreeFrames } from './recordBTreeFrames'
import type { BTreeNodeSpec } from './types'

const MIN_DEGREE = 2

function allKeysInOrder(node: BTreeNodeSpec | null, out: number[] = []): number[] {
  if (!node) return out
  if (node.children.length === 0) {
    out.push(...node.keys)
    return out
  }
  for (let i = 0; i < node.keys.length; i++) {
    allKeysInOrder(node.children[i], out)
    out.push(node.keys[i])
  }
  allKeysInOrder(node.children[node.children.length - 1], out)
  return out
}

function leafDepths(node: BTreeNodeSpec | null, depth = 0, out: number[] = []): number[] {
  if (!node) return out
  if (node.children.length === 0) {
    out.push(depth)
    return out
  }
  for (const child of node.children) leafDepths(child, depth + 1, out)
  return out
}

function checkInvariants(node: BTreeNodeSpec | null, isRoot = true): string[] {
  if (!node) return []
  const issues: string[] = []
  const min = MIN_DEGREE - 1
  const max = 2 * MIN_DEGREE - 1

  if (!isRoot && (node.keys.length < min || node.keys.length > max)) {
    issues.push(`node with ${node.keys.length} keys violates [${min}, ${max}]`)
  }
  for (let i = 1; i < node.keys.length; i++) {
    if (node.keys[i - 1] >= node.keys[i]) issues.push('keys not sorted within node')
  }
  if (node.children.length > 0 && node.children.length !== node.keys.length + 1) {
    issues.push(`children count ${node.children.length} != keys+1 (${node.keys.length + 1})`)
  }
  for (const child of node.children) issues.push(...checkInvariants(child, false))
  return issues
}

describe('bTree', () => {
  it('produces a valid B-tree (sorted keys, correct children count, equal leaf depths)', () => {
    const frames = recordBTreeFrames(bTree)
    const final = frames[frames.length - 1].root

    expect(checkInvariants(final)).toEqual([])

    const depths = leafDepths(final)
    expect(new Set(depths).size).toBe(1)
  })

  it('contains exactly the inserted keys in sorted order', () => {
    const frames = recordBTreeFrames(bTree)
    const final = frames[frames.length - 1].root

    expect(allKeysInOrder(final)).toEqual([5, 6, 7, 10, 12, 17, 20, 30])
  })

  it('produces the expected final structure (hand-traced: one root split, one non-root split)', () => {
    const frames = recordBTreeFrames(bTree)
    const final = frames[frames.length - 1].root

    expect(final).toEqual({
      keys: [10, 20],
      children: [
        { keys: [5, 6, 7], children: [] },
        { keys: [12, 17], children: [] },
        { keys: [30], children: [] },
      ],
    })
  })

  it('splits with the expected median keys, in order', () => {
    const frames = recordBTreeFrames(bTree)
    const splitSteps = frames.map((f) => f.step).filter((s) => s.type === 'split')
    expect(splitSteps.map((s) => (s.type === 'split' ? s.medianKey : undefined))).toEqual([10, 20])
  })
})
