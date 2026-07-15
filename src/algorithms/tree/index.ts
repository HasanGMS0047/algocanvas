import { binaryTree, DEMO_TREE } from './binaryTree'
import type { TreeNodeSpec, TreeStep } from './types'

const CATEGORY = 'Trees'

export interface TreeAlgorithm {
  id: string
  name: string
  category: string
  run: (spec: TreeNodeSpec) => Generator<TreeStep>
  demoTree: TreeNodeSpec
}

export const TREE_ALGORITHMS: TreeAlgorithm[] = [
  { id: 'binary-tree', name: 'Binary Tree', category: CATEGORY, run: binaryTree, demoTree: DEMO_TREE },
]
