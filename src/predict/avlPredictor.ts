import type { TreeFrame } from '../algorithms/tree/types'
import type { Prediction, Predictor } from './types'

// avlTree() only ever inserts (see algorithms/tree/avl.ts) - it never
// searches or deletes - so every 'compare' step unambiguously means
// "which side does the value being inserted go on?" with no other possible
// outcome (target is never equal to an existing value in the demo sequence).
export const avlPredictor: Predictor<TreeFrame> = (frame) => {
  const { step } = frame
  if (step.type !== 'compare') return null

  const goesLeft = step.target < step.value

  const prediction: Prediction = {
    prompt: `Inserting ${step.target}, currently at node ${step.value}. Which side does it go?`,
    options: [
      { id: 'left', label: 'Left' },
      { id: 'right', label: 'Right' },
    ],
    correctOptionId: goesLeft ? 'left' : 'right',
    explanation: goesLeft
      ? `${step.target} < ${step.value}, so it goes left.`
      : `${step.target} >= ${step.value}, so it goes right.`,
  }

  return prediction
}
