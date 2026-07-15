import { useMemo } from 'react'

interface AlgorithmWithId {
  id: string
}

// App.tsx has one "kind" per visualization family (sorts, distribution
// sorts, trees, B-trees, tries, hash tables). Each kind repeats the same
// shape - find the selected algorithm in its registry, record its frames,
// hand Visualizer a render function - just with different types. This
// captures that shape once instead of once per kind.
export function useAlgorithmKind<A extends AlgorithmWithId, F>(
  algorithmId: string,
  algorithms: A[],
  recordFrames: (algorithm: A) => F[],
  render: (ctx: CanvasRenderingContext2D, width: number, height: number, frame: F, algorithm: A) => void,
): { frames: F[]; render: (ctx: CanvasRenderingContext2D, width: number, height: number, frame: F) => void } | null {
  const algorithm = algorithms.find((a) => a.id === algorithmId)
  const frames = useMemo(() => (algorithm ? recordFrames(algorithm) : null), [algorithm])

  if (!algorithm || !frames) return null

  return {
    frames,
    render: (ctx, width, height, frame) => render(ctx, width, height, frame, algorithm),
  }
}
