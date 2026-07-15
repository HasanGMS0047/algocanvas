export interface TreeNodeSpec {
  value: number
  left?: TreeNodeSpec
  right?: TreeNodeSpec
}

export type TreeStep =
  | { type: 'start' }
  | { type: 'insert'; value: number; parentValue: number | null; side: 'left' | 'right' | null }
  | { type: 'compare'; value: number; target: number }
  | { type: 'found'; value: number }
  | { type: 'notFound'; target: number }
  | { type: 'replace'; value: number; withValue: number }
  | { type: 'remove'; value: number; parentValue: number | null; side: 'left' | 'right' | null }
  | { type: 'classify'; full: boolean; complete: boolean; perfect: boolean }
  | { type: 'done' }

export interface TreeFrame {
  step: TreeStep
  root: TreeNodeSpec | null
  classification: { full: boolean; complete: boolean; perfect: boolean } | null
}
