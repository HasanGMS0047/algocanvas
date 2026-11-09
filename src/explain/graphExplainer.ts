import type { GraphFrame } from '../algorithms/graph/types'

export function explainGraphStep(frame: GraphFrame, algorithmId: string): string {
  const { step } = frame

  if (step.type === 'start') return 'Starting the traversal.'
  if (step.type === 'done') return 'Traversal complete.'

  if (step.type === 'pathFound') {
    const hops = step.path.length - 1
    const route = step.path.join(' → ')
    if (algorithmId === 'dfs-path') {
      return `Reached the target! Path ${route} has ${hops} edge${hops === 1 ? '' : 's'}. DFS can't tell if that's the shortest, so it remembers it as the best so far and backtracks to try other routes - only strictly shorter ones can replace it.`
    }
    return `Reached the target! BFS explores in rings of equal distance, so the first time it discovers the target is guaranteed to be via a shortest path: ${route} (${hops} edge${hops === 1 ? '' : 's'}).`
  }

  if (step.type === 'noPath') {
    return 'Every reachable node has been explored and the target was never found - there is no path from the start to the target.'
  }

  if (step.type === 'backtrack') {
    return `Done with ${step.nodeId} - backing up to ${step.stack[step.stack.length - 1] ?? 'the start'} to try its remaining neighbors. ${step.nodeId} is freed up, so a different route may pass through it.`
  }

  if (step.type === 'visit') {
    switch (algorithmId) {
      case 'bfs-path':
        return `Discovering node ${step.nodeId} and remembering which node it was reached from, so the path can be rebuilt backwards once the target is found.`
      case 'dfs-path':
        return `Stepping onto ${step.nodeId} - the path so far is ${(step.stack ?? [step.nodeId]).join(' → ')}.`
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
      case 'bfs-path':
        return `Looking at the edge ${step.from}-${step.to}: if ${step.to} hasn't been reached yet, it's one step further from the start than ${step.from}.`
      case 'dfs-path':
        return `Looking at the edge ${step.from}-${step.to}. It's skipped if ${step.to} is already on the current path (no loops) or if going there can't beat the best path found so far.`
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
