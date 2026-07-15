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
  // Extra values (e.g. a custom input array) that should also force frames
  // to recompute, since switching only tracks the *algorithm* by default -
  // it has no way to know recordFrames depends on something else too.
  extraDeps: unknown[] = [],
): { frames: F[]; render: (ctx: CanvasRenderingContext2D, width: number, height: number, frame: F) => void } | null {
  const algorithm = algorithms.find((a) => a.id === algorithmId)
  // recordFrames is a fresh closure each render (App.tsx passes an inline
  // arrow function per kind) but its behavior is stable, so keying only on
  // `algorithm` + extraDeps is intentional - including recordFrames itself
  // would defeat the memoization and re-run every render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const frames = useMemo(() => (algorithm ? recordFrames(algorithm) : null), [algorithm, ...extraDeps])

  if (!algorithm || !frames) return null

  return {
    frames,
    render: (ctx, width, height, frame) => render(ctx, width, height, frame, algorithm),
  }
}
