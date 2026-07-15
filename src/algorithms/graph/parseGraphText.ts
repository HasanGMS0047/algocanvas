import type { GraphSpec } from './types'
import { circularLayout } from './utils'

export interface GraphParseResult {
  graph: GraphSpec | null
  error?: string
}

const MAX_NODES = 10
const MAX_EDGES = 20
const EDGE_LINE = /^([A-Za-z0-9]+)\s*-\s*([A-Za-z0-9]+)\s*(?::\s*(-?\d+(?:\.\d+)?))?$/

export interface ParseGraphTextOptions {
  // Bellman-Ford is the one algorithm that handles negative weights
  // correctly (and can detect a negative cycle) - every other algorithm
  // either ignores weight sign (BFS/DFS/Kruskal) or silently produces
  // wrong answers on negative weights (Dijkstra/Prim assume non-negative),
  // so this stays off by default rather than letting a shared text box
  // quietly break the other algorithms.
  allowNegativeWeights?: boolean
}

// One edge per line: "A-B" (unweighted, defaults to 1 downstream) or
// "A-B:4" (weighted). Nodes are implicit - whatever ids appear in the edge
// list, in first-seen order - then laid out on a circle since there's no
// hand-placed position for arbitrary user graphs.
export function parseGraphText(text: string, options: ParseGraphTextOptions = {}): GraphParseResult {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    return { graph: null, error: 'Enter at least one edge, e.g. A-B:4' }
  }
  if (lines.length > MAX_EDGES) {
    return { graph: null, error: `Use ${MAX_EDGES} edges or fewer so the graph stays readable.` }
  }

  const nodeOrder: string[] = []
  const nodeSet = new Set<string>()
  const edges: GraphSpec['edges'] = []

  for (const line of lines) {
    const match = EDGE_LINE.exec(line)
    if (!match) {
      return { graph: null, error: `Can't parse "${line}". Use A-B or A-B:weight.` }
    }

    const [, from, to, weightStr] = match
    if (from === to) {
      return { graph: null, error: `"${line}": an edge can't connect a node to itself.` }
    }

    const weight = weightStr !== undefined ? Number(weightStr) : undefined
    if (weight !== undefined && weight === 0) {
      return { graph: null, error: `"${line}": weight can't be zero.` }
    }
    if (weight !== undefined && weight < 0 && !options.allowNegativeWeights) {
      return {
        graph: null,
        error: `"${line}": this algorithm requires non-negative weights (only Bellman-Ford supports negative edges).`,
      }
    }

    for (const id of [from, to]) {
      if (!nodeSet.has(id)) {
        nodeSet.add(id)
        nodeOrder.push(id)
      }
    }
    edges.push({ from, to, weight })
  }

  if (nodeOrder.length > MAX_NODES) {
    return { graph: null, error: `Use ${MAX_NODES} nodes or fewer so the graph stays readable.` }
  }

  return { graph: { nodes: circularLayout(nodeOrder), edges } }
}
