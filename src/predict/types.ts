export interface PredictionOption {
  id: string
  label: string
}

export interface Prediction {
  prompt: string
  options: PredictionOption[]
  correctOptionId: string
  explanation: string
}

// A predictor inspects the current frame and returns a question if this
// frame is a decision point worth pausing at, or null otherwise. The
// correct answer is always computed directly from the frame's own data -
// no lookahead into future frames needed, which keeps each predictor
// self-contained and easy to verify.
export type Predictor<F> = (frame: F) => Prediction | null
