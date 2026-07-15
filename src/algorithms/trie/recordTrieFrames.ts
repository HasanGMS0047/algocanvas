import type { TrieFrame, TrieStep } from './types'

export function recordTrieFrames(run: () => Generator<TrieStep>): TrieFrame[] {
  const frames: TrieFrame[] = []
  for (const step of run()) {
    frames.push({ step, root: step.snapshot })
  }
  return frames
}
