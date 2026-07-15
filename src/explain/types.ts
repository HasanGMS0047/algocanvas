// An explainer turns the current frame into a plain-English sentence
// describing what's happening right now. Unlike Predictor<F>, it always
// returns something (no "not a decision point" case) since every frame,
// not just chosen ones, gets an explanation.
export type Explainer<F> = (frame: F, algorithmId: string) => string
