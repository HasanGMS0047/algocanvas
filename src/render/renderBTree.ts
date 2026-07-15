import type { BTreeFrame, BTreeNodeSpec, BTreeStep } from '../algorithms/btree/types'
import { PALETTE } from './palette'

const KEY_WIDTH = 32
const KEY_HEIGHT = 30
const KEY_GAP = 2
const LEVEL_GAP = 80
const TOP_MARGIN = 56
const SIDE_MARGIN = 40

interface PositionedBNode {
  keys: number[]
  x: number
  depth: number
  path: number[]
  children: PositionedBNode[]
}

export function renderBTreeFrame(ctx: CanvasRenderingContext2D, width: number, _height: number, frame: BTreeFrame) {
  ctx.fillStyle = PALETTE.textMuted
  ctx.font = "16px 'Inter', system-ui, sans-serif"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(describeStep(frame.step), width / 2, 4)

  if (!frame.root) return

  const totalWidth = subtreeWidth(frame.root)
  const positioned = layout(frame.root, 0, 0, [])
  const usableWidth = width - SIDE_MARGIN * 2
  const slotWidth = totalWidth > 0 ? usableWidth / totalWidth : usableWidth

  const px = (x: number) => SIDE_MARGIN + x * slotWidth
  const py = (d: number) => TOP_MARGIN + d * LEVEL_GAP

  const highlight = getHighlight(frame.step)

  ctx.strokeStyle = PALETTE.edge
  ctx.lineWidth = 1.5
  drawEdges(ctx, positioned, px, py)
  drawNode(ctx, positioned, px, py, highlight)
}

function subtreeWidth(node: BTreeNodeSpec): number {
  if (node.children.length === 0) return 1
  return node.children.reduce((sum, child) => sum + subtreeWidth(child), 0)
}

function layout(node: BTreeNodeSpec, depth: number, xStart: number, path: number[]): PositionedBNode {
  if (node.children.length === 0) {
    return { keys: node.keys, x: xStart + 0.5, depth, path, children: [] }
  }

  const children: PositionedBNode[] = []
  let cursor = xStart
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]
    children.push(layout(child, depth + 1, cursor, [...path, i]))
    cursor += subtreeWidth(child)
  }

  const x = (children[0].x + children[children.length - 1].x) / 2
  return { keys: node.keys, x, depth, path, children }
}

function nodeBoxWidth(keyCount: number): number {
  return keyCount * KEY_WIDTH + (keyCount - 1) * KEY_GAP
}

function drawEdges(
  ctx: CanvasRenderingContext2D,
  node: PositionedBNode,
  px: (x: number) => number,
  py: (d: number) => number,
) {
  const parentBottom = py(node.depth) + KEY_HEIGHT / 2
  for (const child of node.children) {
    ctx.beginPath()
    ctx.moveTo(px(node.x), parentBottom)
    ctx.lineTo(px(child.x), py(child.depth) - KEY_HEIGHT / 2)
    ctx.stroke()
    drawEdges(ctx, child, px, py)
  }
}

function drawNode(
  ctx: CanvasRenderingContext2D,
  node: PositionedBNode,
  px: (x: number) => number,
  py: (d: number) => number,
  highlight: { path: number[]; key?: number; color: string } | undefined,
) {
  const cx = px(node.x)
  const cy = py(node.depth)
  const boxWidth = nodeBoxWidth(node.keys.length)
  const startX = cx - boxWidth / 2
  const nodeHighlighted = highlight !== undefined && pathsEqual(node.path, highlight.path)

  for (let i = 0; i < node.keys.length; i++) {
    const kx = startX + i * (KEY_WIDTH + KEY_GAP)
    const keyHighlighted = nodeHighlighted && (highlight!.key === undefined || highlight!.key === node.keys[i])

    ctx.fillStyle = keyHighlighted ? highlight!.color : PALETTE.default
    ctx.fillRect(kx, cy - KEY_HEIGHT / 2, KEY_WIDTH, KEY_HEIGHT)
    ctx.strokeStyle = PALETTE.text
    ctx.lineWidth = 1
    ctx.strokeRect(kx, cy - KEY_HEIGHT / 2, KEY_WIDTH, KEY_HEIGHT)

    ctx.fillStyle = PALETTE.text
    ctx.font = "13px 'Inter', system-ui, sans-serif"
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(node.keys[i]), kx + KEY_WIDTH / 2, cy + 1)
  }

  for (const child of node.children) drawNode(ctx, child, px, py, highlight)
}

function pathsEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

function getHighlight(step: BTreeStep): { path: number[]; key?: number; color: string } | undefined {
  switch (step.type) {
    case 'visit':
      return { path: step.path, color: PALETTE.compare }
    case 'insertKey':
      return { path: step.path, key: step.key, color: PALETTE.found }
    case 'split':
      return { path: step.path, color: PALETTE.structural }
    default:
      return undefined
  }
}

function describeStep(step: BTreeStep): string {
  switch (step.type) {
    case 'start':
      return 'start'
    case 'visit':
      return `visit node [${step.path.join(',')}]`
    case 'insertKey':
      return `insert ${step.key}`
    case 'split':
      return `split, median ${step.medianKey} promoted`
    case 'done':
      return 'done'
  }
}
