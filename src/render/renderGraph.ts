import type { GraphFrame, GraphSpec, GraphStep } from '../algorithms/graph/types'
import { PALETTE } from './palette'

const RADIUS = 20
const SIDE_MARGIN = 50
const TOP_MARGIN = 70
const BOTTOM_MARGIN = 30

export interface GraphRenderOptions {
  // Shortest-path algorithms mark these two nodes "start" / "end".
  start?: string
  target?: string
}

// Consecutive node pairs of a path, as "a|b" keys (order-insensitive).
function pathEdgeKeys(path: string[]): Set<string> {
  const keys = new Set<string>()
  for (let i = 0; i + 1 < path.length; i++) keys.add(edgeKey(path[i], path[i + 1]))
  return keys
}

function edgeKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`
}

export function renderGraphFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: GraphFrame,
  graph: GraphSpec,
  options: GraphRenderOptions = {},
) {
  ctx.fillStyle = frame.hasNegativeCycle ? PALETTE.swap : PALETTE.textMuted
  ctx.font = "16px 'Inter', system-ui, sans-serif"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(describeStep(frame.step), width / 2, 4)

  const px = (x: number) => SIDE_MARGIN + x * (width - SIDE_MARGIN * 2)
  const py = (y: number) => TOP_MARGIN + y * (height - TOP_MARGIN - BOTTOM_MARGIN)

  const activeEdge = frame.step.type === 'visitEdge' ? frame.step : null
  const activeNode = frame.step.type === 'visit' || frame.step.type === 'relax' ? frame.step.nodeId : null
  const visited = new Set(frame.visited)
  const bestEdges = pathEdgeKeys(frame.path)
  const stackEdges = pathEdgeKeys(frame.stack)
  const bestNodes = new Set(frame.path)

  for (const edge of graph.edges) {
    const from = graph.nodes.find((n) => n.id === edge.from)!
    const to = graph.nodes.find((n) => n.id === edge.to)!
    const isActive =
      activeEdge !== null &&
      ((activeEdge.from === edge.from && activeEdge.to === edge.to) ||
        (activeEdge.from === edge.to && activeEdge.to === edge.from))
    const isMstEdge = frame.mstEdges.some(
      (e) => (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from),
    )

    const key = edgeKey(edge.from, edge.to)
    const isBest = bestEdges.has(key)
    const isOnStack = stackEdges.has(key)

    ctx.strokeStyle = isBest
      ? PALETTE.structural
      : isActive || isOnStack
        ? PALETTE.compare
        : isMstEdge
          ? PALETTE.found
          : PALETTE.edge
    ctx.lineWidth = isBest ? 5 : isActive || isMstEdge || isOnStack ? 2.5 : 1.5
    ctx.beginPath()
    ctx.moveTo(px(from.x), py(from.y))
    ctx.lineTo(px(to.x), py(to.y))
    ctx.stroke()

    if (edge.weight !== undefined) {
      ctx.fillStyle = PALETTE.textMuted
      ctx.font = "12px 'Inter', system-ui, sans-serif"
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(edge.weight), (px(from.x) + px(to.x)) / 2, (py(from.y) + py(to.y)) / 2)
    }
  }

  for (const node of graph.nodes) {
    const x = px(node.x)
    const y = py(node.y)
    const isActive = node.id === activeNode
    const isVisited = visited.has(node.id)

    ctx.fillStyle = isActive ? PALETTE.compare : isVisited ? PALETTE.found : PALETTE.default
    ctx.beginPath()
    ctx.arc(x, y, RADIUS, 0, Math.PI * 2)
    ctx.fill()
    if (bestNodes.has(node.id)) {
      ctx.strokeStyle = PALETTE.structural
      ctx.lineWidth = 4
    } else {
      ctx.strokeStyle = PALETTE.edge
      ctx.lineWidth = 1
    }
    ctx.stroke()

    ctx.fillStyle = PALETTE.text
    ctx.font = "14px 'Inter', system-ui, sans-serif"
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(node.id, x, y)

    const role = node.id === options.start ? 'start' : node.id === options.target ? 'end' : null
    if (role) {
      ctx.fillStyle = PALETTE.structural
      ctx.font = "600 11px 'Inter', system-ui, sans-serif"
      ctx.textBaseline = 'bottom'
      ctx.fillText(node.id === options.start && node.id === options.target ? 'start / end' : role, x, y - RADIUS - 5)
    }

    const distance = frame.distances[node.id]
    if (distance !== undefined) {
      ctx.fillStyle = PALETTE.textMuted
      ctx.font = "11px 'Inter', system-ui, sans-serif"
      ctx.textBaseline = 'top'
      ctx.fillText(distance === Infinity ? '∞' : String(distance), x, y + RADIUS + 6)
    }
  }
}

function describeStep(step: GraphStep): string {
  switch (step.type) {
    case 'start':
      return 'start'
    case 'visit':
      return `visit ${step.nodeId}`
    case 'visitEdge':
      return `explore edge ${step.from}–${step.to}`
    case 'backtrack':
      return `backtrack from ${step.nodeId}`
    case 'pathFound':
      return `path found: ${step.path.join(' → ')}`
    case 'noPath':
      return 'no path'
    case 'relax':
      return `distance[${step.nodeId}] = ${step.distance}`
    case 'acceptEdge':
      return `add edge ${step.from}–${step.to} to MST`
    case 'negativeCycle':
      return '⚠ negative cycle detected - distances are unreliable'
    case 'done':
      return 'done'
  }
}
