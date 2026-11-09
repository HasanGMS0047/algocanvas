import { describe, expect, it } from 'vitest'
import { bfs } from './bfs'
import { parseAdjacencyText } from './parseAdjacencyText'
import { parseGraphText } from './parseGraphText'
import { recordGraphFrames } from './recordGraphFrames'
import { graphToAdjacencyText, graphToText, mergeWeights } from './utils'

describe('parseAdjacencyText', () => {
  it('parses the plain "A: [B, C]" form', () => {
    const { graph, error } = parseAdjacencyText('A: [B, C]\nB: [C, D]')
    expect(error).toBeUndefined()
    expect(graph!.nodes.map((n) => n.id)).toEqual(['A', 'B', 'C', 'D'])
    expect(graph!.edges.map((e) => `${e.from}-${e.to}`)).toEqual(['A-B', 'A-C', 'B-C', 'B-D'])
  })

  it('accepts a node listing itself by ignoring the self-reference', () => {
    const { graph } = parseAdjacencyText('A: [A, B , C , D]\nB: [C,D]')
    expect(graph!.adjacency!.A).toEqual(['B', 'C', 'D'])
  })

  it('accepts a pasted Python dict literal (quotes, braces, comments, trailing commas)', () => {
    const { graph, error } = parseAdjacencyText(`graph = {
      'A': ['B', "C"],   # first
      'B': ['D'],
      'C': [],
    }`)
    expect(error).toBeUndefined()
    expect(graph!.nodes.map((n) => n.id)).toEqual(['A', 'B', 'C', 'D'])
    expect(graph!.edges).toHaveLength(3)
  })

  it('accepts entries spread across multiple lines', () => {
    const { graph } = parseAdjacencyText('A: [B,\n C],\nB: []')
    expect(graph!.adjacency!.A).toEqual(['B', 'C'])
  })

  it('treats the graph as undirected, keeping written order first', () => {
    const { graph } = parseAdjacencyText('A: [C, B]\nB: [A]\nC: []\nD: [B]')
    expect(graph!.adjacency).toEqual({ A: ['C', 'B'], B: ['A', 'D'], C: ['A'], D: ['B'] })
    expect(graph!.edges).toHaveLength(3)
  })

  it('keeps isolated nodes', () => {
    const { graph } = parseAdjacencyText('A: [B]\nZ: []')
    expect(graph!.nodes.map((n) => n.id)).toEqual(['A', 'B', 'Z'])
    expect(graph!.adjacency!.Z).toEqual([])
  })

  it('makes BFS visit neighbours in the order they were written', () => {
    const { graph } = parseAdjacencyText('A: [C, B]\nB: [D]\nC: [E]')
    const final = recordGraphFrames(() => bfs(graph!, 'A')).at(-1)!
    expect(final.visited).toEqual(['A', 'C', 'B', 'E', 'D'])
  })

  it('rejects empty input, junk, bad names, and unclosed dicts', () => {
    expect(parseAdjacencyText('').graph).toBeNull()
    expect(parseAdjacencyText('A-B').error).toContain('A-B')
    expect(parseAdjacencyText('A: [B-C]').error).toContain('B-C')
    expect(parseAdjacencyText('{A: [B]').error).toContain('}')
  })

  it('enforces the node and edge limits', () => {
    const many = Array.from({ length: 11 }, (_, i) => `N${i}: []`).join('\n')
    expect(parseAdjacencyText(many).graph).toBeNull()
    const dense = Array.from({ length: 10 }, (_, i) => {
      const neighbors = [1, 2, 3].map((j) => `N${(i + j) % 10}`)
      return `N${i}: [${neighbors.join(',')}]`
    })
    expect(parseAdjacencyText(dense.join('\n')).graph).toBeNull()
  })
})

describe('format conversion', () => {
  it('round-trips adjacency text -> graph -> adjacency text', () => {
    const text = 'A: [B, C]\nB: [A, D]\nC: [A]\nD: [B]'
    expect(graphToAdjacencyText(parseAdjacencyText(text).graph!)).toBe(text)
  })

  it('edge text keeps isolated nodes as bare ids', () => {
    const graph = parseAdjacencyText('A: [B]\nZ: []').graph!
    expect(graphToText(graph)).toBe('A-B\nZ')
    expect(parseGraphText('A-B\nZ').graph!.nodes.map((n) => n.id)).toEqual(['A', 'B', 'Z'])
  })

  it('restores weights on edges that survived a trip through the adjacency view', () => {
    const weighted = parseGraphText('A-B:4\nB-C:1').graph!
    const viaAdjacency = parseAdjacencyText(graphToAdjacencyText(weighted)).graph!
    expect(mergeWeights(viaAdjacency, weighted).edges.map((e) => e.weight)).toEqual([4, 1])
  })
})
