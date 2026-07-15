import type { GraphFrame } from '../algorithms/graph/types'

export function explainGraphStep(frame: GraphFrame, algorithmId: string): string {
  const { step } = frame

  if (step.type === 'start') return 'Starting the traversal.'
  if (step.type === 'done') return 'Traversal complete.'

  if (step.type === 'visit') {
    switch (algorithmId) {
      case 'bfs':
        return `Visiting node ${step.nodeId} - BFS explores level by level, using a queue so nodes are visited in the order they were first discovered.`
      case 'dfs':
        return `Visiting node ${step.nodeId} - DFS dives as deep as possible along one path before backtracking.`
      case 'dijkstra':
        return `Finalizing node ${step.nodeId}: its shortest distance from the start is now locked in and won't change again.`
      case 'prim':
        return `Adding node ${step.nodeId} to the growing minimum spanning tree.`
      case 'kruskal':
        return `Node ${step.nodeId} just got connected into the spanning tree by an accepted edge.`
      case 'bellman-ford':
        return `${step.nodeId} was reached with a finite distance after all edges converged.`
      default:
        return `Visiting node ${step.nodeId}.`
    }
  }

  if (step.type === 'visitEdge') {
    switch (algorithmId) {
      case 'dijkstra':
        return `Looking at the edge ${step.from}-${step.to} to see if going through ${step.from} gives a shorter path to ${step.to}.`
      case 'prim':
        return `Considering edge ${step.from}-${step.to} as a candidate to extend the tree - only the single cheapest candidate across the whole frontier gets accepted.`
      case 'kruskal':
        return `Considering edge ${step.from}-${step.to}, the next-cheapest edge remaining - it'll be accepted unless both endpoints are already connected (which would create a cycle).`
      case 'bellman-ford':
        return `Relaxing edge ${step.from}-${step.to} - unlike Dijkstra, every edge gets rechecked on every pass, which is what makes this work even with negative weights.`
      default:
        return `Exploring the edge between ${step.from} and ${step.to}.`
    }
  }

  if (step.type === 'relax') {
    return `Found a shorter path to ${step.nodeId}: its tentative distance is now ${step.distance}.`
  }

  if (step.type === 'acceptEdge') {
    return `Adding edge ${step.from}-${step.to} to the minimum spanning tree.`
  }

  if (step.type === 'negativeCycle') {
    return "Ran one extra pass over every edge and something still improved - that means a negative-weight cycle exists, so 'shortest path' is undefined (you could loop it forever to keep decreasing the total). The distances above are no longer reliable."
  }

  return ''
}
