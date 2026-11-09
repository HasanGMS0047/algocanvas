import { MAX_EDGES, MAX_NODES, type GraphParseResult } from './parseGraphText'
import type { GraphSpec } from './types'
import { circularLayout } from './utils'

// One entry: `A: [B, C]` - the key and the list items may be quoted
// (`'A': ['B', 'C']`), and a trailing comma after the entry is fine, so a
// pasted Python dict literal works as-is.
const ENTRY = /\s*(?:(['"])([A-Za-z0-9]+)\1|([A-Za-z0-9]+))\s*:\s*\[([^\]]*)\]\s*,?/y
const ITEM = /^[A-Za-z0-9]+$/
const FORMAT_HINT = "Use one line per node, like A: [B, C]."

// Parses the way you'd write an adjacency list in Python:
//
//   A: [B, C]            or      graph = {
//   B: [C, D]                      'A': ['B', 'C'],
//   C: []                          'B': ['C', 'D'],
//                                }
//
// The graph is undirected: B appearing in A's list connects A and B both
// ways, even if B's own list doesn't mention A. Each node's neighbours are
// kept in the order written (then any neighbours implied only by other
// nodes' lists), so BFS/DFS visit them exactly as the text reads. A node
// listing itself is ignored.
export function parseAdjacencyText(text: string): GraphParseResult {
  let src = text.replace(/#.*$/gm, '').trim()
  src = src.replace(/^[A-Za-z_]\w*\s*=\s*/, '')
  if (src.startsWith('{')) {
    if (!src.endsWith('}')) return { graph: null, error: 'Missing the closing } of the dictionary.' }
    src = src.slice(1, -1).trim()
  }
  if (src.length === 0) {
    return { graph: null, error: 'Enter at least one node, e.g. A: [B, C]' }
  }

  const keyOrder: string[] = []
  const lists = new Map<string, string[]>()

  let pos = 0
  while (pos < src.length) {
    ENTRY.lastIndex = pos
    const match = ENTRY.exec(src)
    if (!match) {
      const near = src.slice(pos, pos + 24).trim().split('\n')[0]
      return { graph: null, error: `Can't parse near "${near}". ${FORMAT_HINT}` }
    }
    pos = ENTRY.lastIndex

    const key = match[2] ?? match[3]
    const items: string[] = []
    for (const raw of match[4].split(',')) {
      const item = raw.trim().replace(/^(['"])(.*)\1$/, '$2')
      if (item === '') continue
      if (!ITEM.test(item)) {
        return { graph: null, error: `"${raw.trim()}" in ${key}'s list isn't a valid node name (letters and digits only).` }
      }
      items.push(item)
    }

    if (!lists.has(key)) {
      lists.set(key, [])
      keyOrder.push(key)
    }
    const list = lists.get(key)!
    for (const item of items) if (item !== key && !list.includes(item)) list.push(item)
  }

  // Nodes in first-seen order (a key, then the names in its list), so the
  // circular layout reads in the same order as the text.
  const nodeOrder: string[] = []
  for (const key of keyOrder) {
    for (const id of [key, ...lists.get(key)!]) if (!nodeOrder.includes(id)) nodeOrder.push(id)
  }
  if (nodeOrder.length > MAX_NODES) {
    return { graph: null, error: `Use ${MAX_NODES} nodes or fewer so the graph stays readable.` }
  }

  // Edges: each unordered pair once, in the order first written.
  const edges: GraphSpec['edges'] = []
  const seen = new Set<string>()
  for (const key of keyOrder) {
    for (const item of lists.get(key)!) {
      const id = key < item ? `${key}|${item}` : `${item}|${key}`
      if (seen.has(id)) continue
      seen.add(id)
      edges.push({ from: key, to: item, weight: undefined })
    }
  }
  if (edges.length > MAX_EDGES) {
    return { graph: null, error: `Use ${MAX_EDGES} edges or fewer so the graph stays readable.` }
  }

  // Symmetric neighbour lists: what was written first, then anything only
  // implied by another node's list.
  const adjacency: Record<string, string[]> = {}
  for (const id of nodeOrder) {
    const neighbors = [...(lists.get(id) ?? [])]
    for (const other of keyOrder) {
      if (lists.get(other)!.includes(id) && !neighbors.includes(other)) neighbors.push(other)
    }
    adjacency[id] = neighbors
  }

  return { graph: { nodes: circularLayout(nodeOrder), edges, adjacency } }
}
