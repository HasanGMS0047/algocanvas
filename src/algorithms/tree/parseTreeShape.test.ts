import { describe, expect, it } from 'vitest'
import { DEMO_TREE } from './binaryTree'
import { parseTreeShape, treeShapeToText } from './parseTreeShape'

describe('parseTreeShape', () => {
  it('parses a simple 3-node tree', () => {
    const { shape, error } = parseTreeShape('1, 2, 3')
    expect(error).toBeUndefined()
    expect(shape).toEqual({ value: 1, left: { value: 2 }, right: { value: 3 } })
  })

  it('parses null as a missing left child', () => {
    const { shape } = parseTreeShape('1, null, 2')
    expect(shape).toEqual({ value: 1, right: { value: 2 } })
  })

  it('matches the DEMO_TREE shape exactly (full/complete/not-perfect example)', () => {
    const { shape } = parseTreeShape('1, 2, 3, 4, 5')
    expect(shape).toEqual(DEMO_TREE)
  })

  it('does not reserve children slots under a null node', () => {
    // "null" at index 1 means node 1 has no left child, so the very next
    // token (2) is node 1's right child, not a child of a nonexistent node.
    const { shape } = parseTreeShape('1, null, 2, 3, 4')
    expect(shape).toEqual({
      value: 1,
      right: { value: 2, left: { value: 3 }, right: { value: 4 } },
    })
  })

  it('rejects empty input', () => {
    expect(parseTreeShape('').shape).toBeNull()
    expect(parseTreeShape('   ').shape).toBeNull()
  })

  it('rejects a null root', () => {
    const { shape, error } = parseTreeShape('null, 1, 2')
    expect(shape).toBeNull()
    expect(error).toContain('root')
  })

  it('rejects an unparseable token', () => {
    const { shape, error } = parseTreeShape('1, abc, 2')
    expect(shape).toBeNull()
    expect(error).toContain('abc')
  })

  it('rejects more than 15 nodes', () => {
    const tokens = Array.from({ length: 16 }, (_, i) => i + 1)
    expect(parseTreeShape(tokens.join(',')).shape).toBeNull()
  })

  it('is case-insensitive for the null marker', () => {
    const { shape } = parseTreeShape('1, NULL, Null, 2')
    expect(shape).toEqual({ value: 1 })
  })
})

describe('treeShapeToText', () => {
  it('round-trips DEMO_TREE through parseTreeShape', () => {
    const text = treeShapeToText(DEMO_TREE)
    expect(parseTreeShape(text).shape).toEqual(DEMO_TREE)
  })

  it('trims trailing nulls but keeps internal ones', () => {
    const shape = { value: 1, right: { value: 2 } }
    const text = treeShapeToText(shape)
    expect(text).toBe('1, null, 2')
    expect(parseTreeShape(text).shape).toEqual(shape)
  })

  it('round-trips a single-node tree', () => {
    const shape = { value: 42 }
    expect(parseTreeShape(treeShapeToText(shape)).shape).toEqual(shape)
  })
})
