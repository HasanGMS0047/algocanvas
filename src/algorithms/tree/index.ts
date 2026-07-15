import { avlTree, DEFAULT_INSERT_SEQUENCE as AVL_DEFAULT_SEQUENCE } from './avl'
import { binaryTree } from './binaryTree'
import { binarySearchTree, DEFAULT_INSERT_SEQUENCE as BST_DEFAULT_SEQUENCE } from './bst'
import { DEFAULT_INSERT_SEQUENCE as RB_DEFAULT_SEQUENCE, redBlackTree } from './rb'
import type { TreeStep } from './types'

const CATEGORY = 'Trees'

export interface TreeAlgorithm {
  id: string
  name: string
  category: string
  run: (insertSequence?: number[]) => Generator<TreeStep>
  // undefined = doesn't support custom input (Binary Tree always shows its
  // one curated demo shape).
  defaultSequence?: number[]
}

export const TREE_ALGORITHMS: TreeAlgorithm[] = [
  { id: 'binary-tree', name: 'Binary Tree', category: CATEGORY, run: binaryTree },
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
