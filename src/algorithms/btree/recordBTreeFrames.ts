import type { BTreeFrame, BTreeStep } from './types'

export function recordBTreeFrames(run: () => Generator<BTreeStep>): BTreeFrame[] {
  const frames: BTreeFrame[] = []
  for (const step of run()) {
    frames.push({ step, root: step.snapshot })
  }
  return frames
}
