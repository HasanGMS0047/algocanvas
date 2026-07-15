import type { HeapFrame } from '../algorithms/heap/recordHeapFrames'
import type { HeapStep } from '../algorithms/heap/types'
import { PALETTE } from './palette'

const RADIUS = 18
const TOP_MARGIN = 56
const NODE_TOP_PAD = 20
const SIDE_MARGIN = 40
const STRIP_HEIGHT = 40
const STRIP_GAP = 24
const BOTTOM_MARGIN = 12
const CELL_GAP = 4

// A heap stored in an array maps to tree position with simple arithmetic
// (no need for the recursive subtree-width layout a general BST needs):
// node i sits at depth floor(log2(i+1)), and is the (i - (2^depth - 1))-th
// of the 2^depth slots at that depth.
function nodePosition(index: number, width: number, treeTop: number, levelGap: number) {
  const depth = Math.floor(Math.log2(index + 1))
  const levelStart = 2 ** depth - 1
  const posInLevel = index - levelStart
  const slotsInLevel = 2 ** depth
  const x = SIDE_MARGIN + ((posInLevel + 0.5) * (width - SIDE_MARGIN * 2)) / slotsInLevel
  const y = treeTop + depth * levelGap
  return { x, y }
}

export function renderHeapFrame(ctx: CanvasRenderingContext2D, width: number, height: number, frame: HeapFrame) {
  const { array, step, heapSize } = frame

  ctx.fillStyle = PALETTE.textMuted
  ctx.font = "16px 'Inter', system-ui, sans-serif"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(describeStep(step), width / 2, 4)

  // Once fully done, the one element left in a size-1 heap is already in
  // its correct spot - showing it as "sorted" too instead of a lone tree
  // node reads as a cleaner finish than the algorithm's own bookkeeping,
  // which doesn't bother extracting it.
  const displayHeapSize = step.type === 'done' ? 0 : heapSize

  const stripY = height - BOTTOM_MARGIN - STRIP_HEIGHT
  const treeTop = TOP_MARGIN + NODE_TOP_PAD
  const treeBottom = stripY - STRIP_GAP
  const maxDepth = displayHeapSize > 0 ? Math.floor(Math.log2(displayHeapSize)) : 0
  const levelGap = maxDepth > 0 ? (treeBottom - treeTop) / maxDepth : 0

  const highlight = getHighlight(step)

  ctx.strokeStyle = PALETTE.edge
  ctx.lineWidth = 1.5
  for (let i = 0; i < displayHeapSize; i++) {
    const { x, y } = nodePosition(i, width, treeTop, levelGap)
    for (const child of [2 * i + 1, 2 * i + 2]) {
      if (child >= displayHeapSize) continue
      const childPos = nodePosition(child, width, treeTop, levelGap)
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(childPos.x, childPos.y)
      ctx.stroke()
    }
  }

  for (let i = 0; i < displayHeapSize; i++) {
    const { x, y } = nodePosition(i, width, treeTop, levelGap)
    ctx.fillStyle = highlight.has(i) ? highlight.get(i)! : PALETTE.default
    ctx.beginPath()
    ctx.arc(x, y, RADIUS, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = PALETTE.edge
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = PALETTE.text
    ctx.font = "13px 'Inter', system-ui, sans-serif"
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(array[i]), x, y + 1)
  }

  drawSortedStrip(ctx, width, stripY, array, displayHeapSize)
}

function drawSortedStrip(ctx: CanvasRenderingContext2D, width: number, y: number, array: number[], heapSize: number) {
  const n = array.length
  const cellWidth = (width - SIDE_MARGIN * 2 - CELL_GAP * (n - 1)) / n

  for (let i = 0; i < n; i++) {
    const x = SIDE_MARGIN + i * (cellWidth + CELL_GAP)
    const isSorted = i >= heapSize

    if (isSorted) {
      ctx.fillStyle = PALETTE.found
      ctx.fillRect(x, y, cellWidth, STRIP_HEIGHT)
      ctx.fillStyle = PALETTE.text
      ctx.font = "13px 'Inter', system-ui, sans-serif"
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(array[i]), x + cellWidth / 2, y + STRIP_HEIGHT / 2 + 1)
    } else {
      ctx.strokeStyle = PALETTE.edge
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, cellWidth, STRIP_HEIGHT)
    }
  }
}

function getHighlight(step: HeapStep): Map<number, string> {
  const highlight = new Map<number, string>()
  if (step.type === 'compare' || step.type === 'swap') {
    const color = step.type === 'compare' ? PALETTE.compare : PALETTE.swap
    highlight.set(step.indices[0], color)
    highlight.set(step.indices[1], color)
  }
  return highlight
}

function describeStep(step: HeapStep): string {
  switch (step.type) {
    case 'start':
      return 'start - building the max-heap'
    case 'compare':
      return `compare(${step.indices[0]}, ${step.indices[1]})`
    case 'swap':
      return `swap(${step.indices[0]}, ${step.indices[1]})`
    case 'extract':
      return `index ${step.index} is now sorted`
    case 'done':
      return 'done'
  }
}
