import { isProduction } from './Environment'

export class AssertionException extends Error {
  constructor(message?: string) {
    super()

    this.name = 'AssertionException'
    this.message = message ?? 'assertion failed'
  }
}

export function assert(
  predicate: boolean,
  message?: string
): asserts predicate {
  if (predicate) {
    return
  }

  if (!isProduction()) {
    throw new AssertionException(message)
  }
}
