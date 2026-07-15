import { describe, expect, it } from 'vitest'
import { avlTree } from '../algorithms/tree/avl'
import { recordTreeFrames } from '../algorithms/tree/recordTreeFrames'
import { avlPredictor } from './avlPredictor'

describe('avlPredictor', () => {
  it('returns null for non-compare steps', () => {
    const frames = recordTreeFrames(avlTree)
    const nonCompare = frames.filter((f) => f.step.type !== 'compare')
    expect(nonCompare.length).toBeGreaterThan(0)
    for (const frame of nonCompare) {
      expect(avlPredictor(frame)).toBeNull()
    }
  })

  it('every compare step predicts the side matching simple BST comparison (target < value)', () => {
    const frames = recordTreeFrames(avlTree)
    const compareFrames = frames.filter((f) => f.step.type === 'compare')
    expect(compareFrames.length).toBeGreaterThan(0)

    for (const frame of compareFrames) {
      const prediction = avlPredictor(frame)
      expect(prediction).not.toBeNull()

      const step = frame.step as Extract<typeof frame.step, { type: 'compare' }>
      const expectedLeft = step.target < step.value

      expect(prediction!.correctOptionId).toBe(expectedLeft ? 'left' : 'right')
      expect(prediction!.options.map((o) => o.id)).toContain(prediction!.correctOptionId)
    }
  })
})
