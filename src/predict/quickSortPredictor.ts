import type { Frame } from '../algorithms/recordFrames'
import type { Prediction, Predictor } from './types'

// quickSort's compare step always has shape indices: [j, pivotIndex] (see
// algorithms/quickSort.ts's partition()), so frame.array at those two
// indices is exactly what's being compared at this moment - no lookahead
// into future frames needed.
export const quickSortPredictor: Predictor<Frame> = (frame) => {
  const { step, array } = frame
  if (step.type !== 'compare') return null

  const [j, pivotIndex] = step.indices
  const value = array[j]
  const pivot = array[pivotIndex]
  const movesLeft = value < pivot

  const prediction: Prediction = {
    prompt: `Comparing ${value} against pivot ${pivot}. Will ${value} move into the left partition?`,
    options: [
      { id: 'left', label: 'Yes, moves left' },
      { id: 'right', label: 'No, stays right' },
    ],
    correctOptionId: movesLeft ? 'left' : 'right',
    explanation: movesLeft
      ? `${value} < ${pivot} (the pivot), so it belongs in the left partition.`
      : `${value} >= ${pivot} (the pivot), so it stays in the right partition.`,
  }

  return prediction
}
