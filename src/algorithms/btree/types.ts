export interface BTreeNodeSpec {
  keys: number[]
  children: BTreeNodeSpec[]
}

interface BTreeStepBase {
  // The B-tree generator maintains the authoritative live tree itself (splits
  // and multi-key nodes don't fit the "recorder replays minimal params"
  // pattern used for binary trees), so each step just carries a snapshot.
  snapshot: BTreeNodeSpec | null
}

export type BTreeStep =
  | (BTreeStepBase & { type: 'start' })
  | (BTreeStepBase & { type: 'visit'; path: number[] })
  | (BTreeStepBase & { type: 'insertKey'; key: number; path: number[] })
  | (BTreeStepBase & { type: 'split'; path: number[]; medianKey: number })
  | (BTreeStepBase & { type: 'done' })

export interface BTreeFrame {
  step: BTreeStep
  root: BTreeNodeSpec | null
}
