import type { GraphFrame, GraphSpec, GraphStep } from '../algorithms/graph/types'
import { PALETTE } from './palette'

const RADIUS = 20
const SIDE_MARGIN = 50
const TOP_MARGIN = 70
const BOTTOM_MARGIN = 30

export function renderGraphFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: GraphFrame,
  graph: GraphSpec,
) {
  ctx.fillStyle = PALETTE.textMuted
  ctx.font = "16px 'Inter', system-ui, sans-serif"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(describeStep(frame.step), width / 2, 4)

  const px = (x: number) => SIDE_MARGIN + x * (width - SIDE_MARGIN * 2)
  const py = (y: number) => TOP_MARGIN + y * (height - TOP_MARGIN - BOTTOM_MARGIN)

  const activeEdge = frame.step.type === 'visitEdge' ? frame.step : null
  const activeNode = frame.step.type === 'visit' || frame.step.type === 'relax' ? frame.step.nodeId : null
  const visited = new Set(frame.visited)

  for (const edge of graph.edges) {
    const from = graph.nodes.find((n) => n.id === edge.from)!
    const to = graph.nodes.find((n) => n.id === edge.to)!
    const isActive =
      activeEdge !== null &&
      ((activeEdge.from === edge.from && activeEdge.to === edge.to) ||
        (activeEdge.from === edge.to && activeEdge.to === edge.from))

    ctx.strokeStyle = isActive ? PALETTE.compare : PALETTE.edge
    ctx.lineWidth = isActive ? 2.5 : 1.5
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
    ctx.strokeStyle = PALETTE.edge
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = PALETTE.text
    ctx.font = "14px 'Inter', system-ui, sans-serif"
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(node.id, x, y)

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
    case 'relax':
      return `distance[${step.nodeId}] = ${step.distance}`
    case 'done':
      return 'done'
  }
}
