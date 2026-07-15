import { binarySearch } from './binarySearch'
import { interpolationSearch } from './interpolationSearch'
import { jumpSearch } from './jumpSearch'
import { linearSearch } from './linearSearch'
import type { SearchStep } from './types'

const CATEGORY = 'Searching'

export interface SearchAlgorithm {
  id: string
  name: string
  category: string
  run: (array: number[], target: number) => Generator<SearchStep>
  requiresSorted?: boolean
}

export const SEARCH_ALGORITHMS: SearchAlgorithm[] = [
  { id: 'linear-search', name: 'Linear Search', category: CATEGORY, run: linearSearch },
  { id: 'binary-search', name: 'Binary Search', category: CATEGORY, run: binarySearch, requiresSorted: true },
  { id: 'jump-search', name: 'Jump Search', category: CATEGORY, run: jumpSearch, requiresSorted: true },
  {
    id: 'interpolation-search',
    name: 'Interpolation Search',
    category: CATEGORY,
    run: interpolationSearch,
    requiresSorted: true,
  },
]
