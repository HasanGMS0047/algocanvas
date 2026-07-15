import type { TreeFrame, TreeNodeSpec, TreeStep } from '../algorithms/tree/types'

const RADIUS = 18
const COLOR_NODE = '#3b82f6'
const COLOR_ACTIVE = '#f59e0b'
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

  const activeValue = getActiveValue(frame.step)

  ctx.strokeStyle = COLOR_EDGE
  ctx.lineWidth = 1.5
  drawEdges(ctx, positioned, px, py)
  drawNodes(ctx, positioned, px, py, activeValue)
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
  activeValue: number | undefined,
) {
  const x = px(node.x)
  const y = py(node.depth)

  ctx.fillStyle = node.value === activeValue ? COLOR_ACTIVE : COLOR_NODE
  ctx.beginPath()
  ctx.arc(x, y, RADIUS, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.font = '13px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(node.value), x, y + 1)

  if (node.left) drawNodes(ctx, node.left, px, py, activeValue)
  if (node.right) drawNodes(ctx, node.right, px, py, activeValue)
}

function getMaxDepth(node: PositionedNode): number {
  let max = node.depth
  if (node.left) max = Math.max(max, getMaxDepth(node.left))
  if (node.right) max = Math.max(max, getMaxDepth(node.right))
  return max
}

function getActiveValue(step: TreeStep): number | undefined {
  return step.type === 'insert' ? step.value : undefined
}

function describeStep(step: TreeStep): string {
  switch (step.type) {
    case 'start':
      return 'start'
    case 'insert':
      return step.parentValue === null
        ? `insert ${step.value} (root)`
        : `insert ${step.value} as ${step.side} child of ${step.parentValue}`
    case 'classify':
      return 'classify shape'
    case 'done':
      return 'done'
  }
}
