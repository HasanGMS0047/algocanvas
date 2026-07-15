import type { TreeFrame, TreeNodeSpec, TreeStep } from '../algorithms/tree/types'

const RADIUS = 18
const COLOR_NODE = '#3b82f6'
const COLOR_ACTIVE = '#f59e0b'
const COLOR_FOUND = '#10b981'
const COLOR_ROTATE = '#a855f7'
const COLOR_EDGE = 'rgba(128, 128, 128, 0.5)'
const TOP_MARGIN = 56
const BOTTOM_MARGIN = 24
const SIDE_MARGIN = 32

interface PositionedNode {
  value: number
  x: number
  depth: number
  left?: PositionedNode
  right?: PositionedNode
}

export function renderTreeFrame(ctx: CanvasRenderingContext2D, width: number, height: number, frame: TreeFrame) {
  ctx.fillStyle = '#888'
  ctx.font = '16px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(describeStep(frame.step), width / 2, 4)

  if (frame.classification) {
    const { full, complete, perfect } = frame.classification
    ctx.font = '14px system-ui, sans-serif'
    ctx.fillText(
      `full: ${full ? 'yes' : 'no'}   complete: ${complete ? 'yes' : 'no'}   perfect: ${perfect ? 'yes' : 'no'}`,
      width / 2,
      28,
    )
  }

  if (!frame.root) return

  const counter = { n: 0 }
  const positioned = layout(frame.root, 0, counter)
  if (!positioned) return

  const nodeCount = counter.n
  const maxDepth = getMaxDepth(positioned)
  const usableWidth = width - SIDE_MARGIN * 2
  const usableHeight = height - TOP_MARGIN - BOTTOM_MARGIN
  const levelGap = maxDepth > 0 ? usableHeight / maxDepth : 0
  const slotGap = nodeCount > 1 ? usableWidth / (nodeCount - 1) : 0

  const px = (x: number) => (nodeCount > 1 ? SIDE_MARGIN + x * slotGap : width / 2)
  const py = (d: number) => TOP_MARGIN + d * levelGap

  const highlight = getHighlight(frame.step)

  ctx.strokeStyle = COLOR_EDGE
  ctx.lineWidth = 1.5
  drawEdges(ctx, positioned, px, py)
  drawNodes(ctx, positioned, px, py, highlight)
}

function layout(node: TreeNodeSpec | null, depth: number, counter: { n: number }): PositionedNode | undefined {
  if (!node) return undefined
  const left = layout(node.left ?? null, depth + 1, counter)
  const x = counter.n++
  const right = layout(node.right ?? null, depth + 1, counter)
  return { value: node.value, x, depth, left, right }
}

function drawEdges(
  ctx: CanvasRenderingContext2D,
  node: PositionedNode,
  px: (x: number) => number,
  py: (d: number) => number,
) {
  for (const child of [node.left, node.right]) {
    if (!child) continue
    ctx.beginPath()
    ctx.moveTo(px(node.x), py(node.depth))
    ctx.lineTo(px(child.x), py(child.depth))
    ctx.stroke()
    drawEdges(ctx, child, px, py)
  }
}

function drawNodes(
  ctx: CanvasRenderingContext2D,
  node: PositionedNode,
  px: (x: number) => number,
  py: (d: number) => number,
  highlight: { value: number; color: string } | undefined,
) {
  const x = px(node.x)
  const y = py(node.depth)

  ctx.fillStyle = node.value === highlight?.value ? highlight.color : COLOR_NODE
  ctx.beginPath()
  ctx.arc(x, y, RADIUS, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.font = '13px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(node.value), x, y + 1)

  if (node.left) drawNodes(ctx, node.left, px, py, highlight)
  if (node.right) drawNodes(ctx, node.right, px, py, highlight)
}

function getMaxDepth(node: PositionedNode): number {
  let max = node.depth
  if (node.left) max = Math.max(max, getMaxDepth(node.left))
  if (node.right) max = Math.max(max, getMaxDepth(node.right))
  return max
}

function getHighlight(step: TreeStep): { value: number; color: string } | undefined {
  switch (step.type) {
    case 'insert':
      return { value: step.value, color: COLOR_ACTIVE }
    case 'compare':
      return { value: step.value, color: COLOR_ACTIVE }
    case 'found':
      return { value: step.value, color: COLOR_FOUND }
    case 'replace':
      return { value: step.withValue, color: COLOR_ACTIVE }
    case 'rotate':
      return { value: step.pivotValue, color: COLOR_ROTATE }
    default:
      return undefined
  }
}

function describeStep(step: TreeStep): string {
  switch (step.type) {
    case 'start':
      return 'start'
    case 'insert':
      return step.parentValue === null
        ? `insert ${step.value} (root)`
        : `insert ${step.value} as ${step.side} child of ${step.parentValue}`
    case 'compare':
      return `compare ${step.value} vs ${step.target}`
    case 'found':
      return `found ${step.value}`
    case 'notFound':
      return `${step.target} not found`
    case 'replace':
      return `replace ${step.value} with ${step.withValue}`
    case 'remove':
      return `remove ${step.value}`
    case 'rotate':
      return `rotate ${step.direction} at ${step.pivotValue}`
    case 'classify':
      return 'classify shape'
    case 'done':
      return 'done'
  }
}
