export class EmptyOsError extends Error {
  constructor() {
    super('OS is empty')
  }
}

export class EmptyRtsError extends Error {
  constructor() {
    super('RTS is empty')
  }
}

export class BadBuiltinArgValError extends Error {
  constructor(func: string, arg: any) {
    super(`${func} has bad argument ${arg}`)
  }
}

export class MissingBuiltinArgError extends Error {
  constructor(func: string, argName: string) {
    super(`${func} has missing argument ${argName}`)
  }
}
