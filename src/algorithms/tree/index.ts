import { avlTree, DEFAULT_INSERT_SEQUENCE as AVL_DEFAULT_SEQUENCE } from './avl'
import { binaryTree, DEMO_TREE } from './binaryTree'
import { binarySearchTree, DEFAULT_INSERT_SEQUENCE as BST_DEFAULT_SEQUENCE } from './bst'
import { DEFAULT_INSERT_SEQUENCE as RB_DEFAULT_SEQUENCE, redBlackTree } from './rb'
import type { TreeNodeSpec, TreeStep } from './types'

const CATEGORY = 'Trees'

export interface TreeAlgorithm {
  id: string
  name: string
  category: string
  run: (insertSequence?: number[]) => Generator<TreeStep>
  defaultSequence: number[]
}

// Binary Tree gets its own registry (not TreeAlgorithm) because it has no
// insertion rule - its "custom input" is a full shape (see parseTreeShape),
// not an insert sequence, so `run` takes a different parameter type.
export interface BinaryTreeAlgorithm {
  id: string
  name: string
  category: string
  run: (shape?: TreeNodeSpec) => Generator<TreeStep>
  defaultShape: TreeNodeSpec
}

export const BINARY_TREE_ALGORITHMS: BinaryTreeAlgorithm[] = [
  { id: 'binary-tree', name: 'Binary Tree', category: CATEGORY, run: binaryTree, defaultShape: DEMO_TREE },
]

export const TREE_ALGORITHMS: TreeAlgorithm[] = [
  {
    id: 'bst',
    name: 'Binary Search Tree',
    category: CATEGORY,
    run: binarySearchTree,
    defaultSequence: BST_DEFAULT_SEQUENCE,
  },
  { id: 'avl', name: 'AVL Tree', category: CATEGORY, run: avlTree, defaultSequence: AVL_DEFAULT_SEQUENCE },
  {
    id: 'rb',
    name: 'Red-Black Tree',
    category: CATEGORY,
    run: redBlackTree,
    defaultSequence: RB_DEFAULT_SEQUENCE,
  },
]
