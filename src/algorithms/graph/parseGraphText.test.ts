import { describe, expect, it } from 'vitest'
import { parseGraphText } from './parseGraphText'

describe('parseGraphText', () => {
  it('parses weighted edges into a graph spec', () => {
    const { graph, error } = parseGraphText('A-B:4\nB-C:1')
    expect(error).toBeUndefined()
    expect(graph!.edges).toEqual([
      { from: 'A', to: 'B', weight: 4 },
      { from: 'B', to: 'C', weight: 1 },
    ])
    expect(graph!.nodes.map((n) => n.id)).toEqual(['A', 'B', 'C'])
  })

  it('parses unweighted edges (weight left undefined)', () => {
    const { graph } = parseGraphText('A-B\nB-C')
    expect(graph!.edges).toEqual([
      { from: 'A', to: 'B', weight: undefined },
      { from: 'B', to: 'C', weight: undefined },
    ])
  })

  it('lays every node out inside the [0,1] normalized bounds', () => {
    const { graph } = parseGraphText('A-B:4\nB-C:1\nC-D:2\nD-E:3')
    for (const node of graph!.nodes) {
      expect(node.x).toBeGreaterThanOrEqual(0)
      expect(node.x).toBeLessThanOrEqual(1)
      expect(node.y).toBeGreaterThanOrEqual(0)
      expect(node.y).toBeLessThanOrEqual(1)
    }
  })

  it('rejects empty input', () => {
    expect(parseGraphText('').graph).toBeNull()
    expect(parseGraphText('   \n  ').graph).toBeNull()
  })

  it('rejects an unparseable line', () => {
    const { graph, error } = parseGraphText('A-B:4\nnot an edge')
    expect(graph).toBeNull()
    expect(error).toContain('not an edge')
  })

  it('rejects a self-loop', () => {
    const { graph, error } = parseGraphText('A-A:1')
    expect(graph).toBeNull()
    expect(error).toContain('itself')
  })

  it('rejects a non-positive weight', () => {
    expect(parseGraphText('A-B:0').graph).toBeNull()
    expect(parseGraphText('A-B:-3').graph).toBeNull()
  })

  it('rejects more than 20 edges', () => {
    const lines = Array.from({ length: 21 }, (_, i) => `N${i}-N${i + 1}`)
    expect(parseGraphText(lines.join('\n')).graph).toBeNull()
  })

  it('rejects more than 10 distinct nodes', () => {
    const lines = Array.from({ length: 10 }, (_, i) => `N${i}-N${i + 1}`) // 11 distinct nodes
    expect(parseGraphText(lines.join('\n')).graph).toBeNull()
  })
})
