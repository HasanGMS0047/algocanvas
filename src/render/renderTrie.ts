import type { TrieFrame, TrieNodeSpec, TrieStep } from '../algorithms/trie/types'
import { PALETTE } from './palette'

const RADIUS = 16
const ROOT_RADIUS = 8
const LEVEL_GAP = 70
const TOP_MARGIN = 56
const SIDE_MARGIN = 32

interface PositionedNode {
  char: string
  isEnd: boolean
  x: number
  depth: number
  path: string
  children: PositionedNode[]
}

export function renderTrieFrame(ctx: CanvasRenderingContext2D, width: number, _height: number, frame: TrieFrame) {
  ctx.fillStyle = PALETTE.textMuted
  ctx.font = "16px 'Inter', system-ui, sans-serif"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(describeStep(frame.step), width / 2, 4)

  if (!frame.root) return

  const totalWidth = subtreeWidth(frame.root)
  const positioned = layout(frame.root, 0, 0, '')
  const usableWidth = width - SIDE_MARGIN * 2
  const slotWidth = totalWidth > 0 ? usableWidth / totalWidth : usableWidth

  const px = (x: number) => SIDE_MARGIN + x * slotWidth
  const py = (d: number) => TOP_MARGIN + d * LEVEL_GAP

  const highlight = getHighlight(frame.step)

  ctx.strokeStyle = PALETTE.edge
  ctx.lineWidth = 1.5
  drawEdges(ctx, positioned, px, py)
  drawNodes(ctx, positioned, px, py, highlight)
}

function subtreeWidth(node: TrieNodeSpec): number {
  if (node.children.length === 0) return 1
  return node.children.reduce((sum, child) => sum + subtreeWidth(child), 0)
}

function layout(node: TrieNodeSpec, depth: number, xStart: number, path: string): PositionedNode {
  if (node.children.length === 0) {
    return { char: node.char, isEnd: node.isEnd, x: xStart + 0.5, depth, path, children: [] }
  }

  const children: PositionedNode[] = []
  let cursor = xStart
  for (const child of node.children) {
    children.push(layout(child, depth + 1, cursor, path + child.char))
    cursor += subtreeWidth(child)
  }

  const x = (children[0].x + children[children.length - 1].x) / 2
  return { char: node.char, isEnd: node.isEnd, x, depth, path, children }
}

function drawEdges(
  ctx: CanvasRenderingContext2D,
  node: PositionedNode,
  px: (x: number) => number,
  py: (d: number) => number,
) {
  for (const child of node.children) {
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
  highlight: { path: string; color: string } | undefined,
) {
  const x = px(node.x)
  const y = py(node.depth)
  const isRoot = node.path === ''
  const radius = isRoot ? ROOT_RADIUS : RADIUS

  ctx.fillStyle = highlight && node.path === highlight.path ? highlight.color : PALETTE.default
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fill()

  ctx.lineWidth = node.isEnd ? 3 : 1
  ctx.strokeStyle = node.isEnd ? PALETTE.text : 'rgba(255, 255, 255, 0.3)'
  ctx.stroke()

  if (!isRoot) {
    ctx.fillStyle = PALETTE.text
    ctx.font = "13px 'Inter', system-ui, sans-serif"
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(node.char, x, y + 1)
  }

  for (const child of node.children) drawNodes(ctx, child, px, py, highlight)
}

function getHighlight(step: TrieStep): { path: string; color: string } | undefined {
  switch (step.type) {
    case 'visit':
      return { path: step.path, color: PALETTE.compare }
    case 'createNode':
      return { path: step.path, color: PALETTE.structural }
    case 'markEnd':
      return { path: step.path, color: PALETTE.found }
    case 'found':
      return { path: step.word, color: PALETTE.found }
    case 'notFound':
      return step.reason === 'not-a-word' ? { path: step.word, color: PALETTE.swap } : undefined
    default:
      return undefined
  }
}

function describeStep(step: TrieStep): string {
  switch (step.type) {
    case 'start':
      return 'start'
    case 'visit':
      return `visit "${step.path}"`
    case 'createNode':
      return `create node "${step.path}"`
    case 'markEnd':
      return `mark end of word "${step.path}"`
    case 'found':
      return `found "${step.word}"`
    case 'notFound':
      return step.reason === 'no-path'
        ? `"${step.word}" not found (no path)`
        : `"${step.word}" not found (not a complete word)`
    case 'done':
      return 'done'
  }
}
