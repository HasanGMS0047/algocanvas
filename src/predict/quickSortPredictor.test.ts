import { describe, expect, it } from 'vitest'
import { recordFrames } from '../algorithms/recordFrames'
import { quickSort } from '../algorithms/quickSort'
import { quickSortPredictor } from './quickSortPredictor'

describe('quickSortPredictor', () => {
  it('returns null for non-compare steps', () => {
    const frames = recordFrames([3, 1, 2], quickSort)
    const nonCompare = frames.filter((f) => f.step.type !== 'compare')
    expect(nonCompare.length).toBeGreaterThan(0)
    for (const frame of nonCompare) {
      expect(quickSortPredictor(frame)).toBeNull()
    }
  })

  it("every compare step's correct answer matches whether the element actually swaps into the left partition", () => {
    const frames = recordFrames([8, 3, 9, 1, 6, 4, 7, 2, 5, 10], quickSort)
    const compareFrames = frames.filter((f) => f.step.type === 'compare')
    expect(compareFrames.length).toBeGreaterThan(0)

    for (const frame of compareFrames) {
      const prediction = quickSortPredictor(frame)
      expect(prediction).not.toBeNull()

      const step = frame.step as Extract<typeof frame.step, { type: 'compare' }>
      const [j, pivotIndex] = step.indices
      const expectedLeft = frame.array[j] < frame.array[pivotIndex]

      expect(prediction!.correctOptionId).toBe(expectedLeft ? 'left' : 'right')
      // The correct option must always be present among the offered options.
      expect(prediction!.options.map((o) => o.id)).toContain(prediction!.correctOptionId)
    }
  })
})
