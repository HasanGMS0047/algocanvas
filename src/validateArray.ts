export interface ArrayValidation {
  valid: boolean
  error?: string
}

const DEFAULT_MAX_LENGTH = 20

// Counting sort buckets by value directly (bucketIndex === value) and radix
// sort buckets by digit (Math.floor(v / exp) % 10, which goes negative for
// negative v in JS) - both crash or silently drop data on negative input.
// Everything else just needs a reasonably-sized array of whole numbers.
const REQUIRES_NON_NEGATIVE = new Set(['counting', 'radix'])

export function validateArray(
  array: number[],
  algorithmId: string,
  options: { maxLength?: number } = {},
): ArrayValidation {
  const maxLength = options.maxLength ?? DEFAULT_MAX_LENGTH

  if (array.length === 0) {
    return { valid: false, error: 'Enter at least one number.' }
  }
  if (array.length > maxLength) {
    return { valid: false, error: `Use ${maxLength} numbers or fewer so the animation stays readable.` }
  }
  if (!array.every(Number.isInteger)) {
    return { valid: false, error: 'All values must be whole numbers.' }
  }
  if (REQUIRES_NON_NEGATIVE.has(algorithmId) && array.some((n) => n < 0)) {
    return { valid: false, error: 'This algorithm requires non-negative integers.' }
  }
  return { valid: true }
}
