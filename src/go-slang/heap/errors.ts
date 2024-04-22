export class MemExhaustedError extends Error {
  constructor() {
    super('Memory exhausted')
  }
}

export class MemOutOfBoundsError extends Error {
  constructor() {
    super('Address out of bounds')
  }
}

export class InvalidMemRequestedError extends Error {
  constructor() {
    super('Invalid amount of memory requested')
  }
}

export class InvalidChildIndexError extends Error {
  constructor(childIdx: number, numChildren: number) {
    super(`Child index ${childIdx} requested but node only has ${numChildren} children`)
  }
}

export class CannotAddChildError extends Error {
  constructor() {
    super('Data type does not support adding children')
  }
}

export class BadTagError extends Error {
  constructor(expected: number, actual: number) {
    super(`Bad tag: Expected ${expected}, Actual ${actual}`)
  }
}

export class WaitGroupCounterOverflowError extends Error {
  constructor() {
    super('Wait group counter cannot exceed 16777215')
  }
}

export class NegativeWaitGroupCounterError extends Error {
  constructor() {
    super('Wait group counter negative')
  }
}

export class InvalidSemaphoreValueError extends Error {
  constructor(val: number) {
    super(`Semaphore initialised with size ${val}, must be between [1, 2^32 - 1] inclusive`)
  }
}

export class InvalidChannelValueError extends Error {
  constructor(val: number) {
    super(`Channel initialised with size ${val}, must be between [1, 65536] inclusive`)
  }
}

export class InvalidValTypeError extends Error {
  constructor() {
    super('Value type could not be determined')
  }
}

export class UnassignedVarError extends Error {
  constructor() {
    super('Variable is unassigned')
  }
}
