import { avlTree } from './avl'
import { binaryTree } from './binaryTree'
import { binarySearchTree } from './bst'
import { redBlackTree } from './rb'
import type { TreeStep } from './types'

const CATEGORY = 'Trees'

export interface TreeAlgorithm {
  id: string
  name: string
  category: string
  run: () => Generator<TreeStep>
}

export const TREE_ALGORITHMS: TreeAlgorithm[] = [
  { id: 'binary-tree', name: 'Binary Tree', category: CATEGORY, run: binaryTree },
  { id: 'bst', name: 'Binary Search Tree', category: CATEGORY, run: binarySearchTree },
  { id: 'avl', name: 'AVL Tree', category: CATEGORY, run: avlTree },
  { id: 'rb', name: 'Red-Black Tree', category: CATEGORY, run: redBlackTree },
]
