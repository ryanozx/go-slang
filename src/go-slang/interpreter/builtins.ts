import { HeapBuffer } from '../heap/heap'
import { HeapVal, ValType } from '../heap/heapVals'
import { BadBuiltinArgValError, MissingBuiltinArgError } from './errors'
import { GoRoutine } from './goroutine'

class BuiltinFuncOutput {
  needRepeat: boolean
  results: HeapVal[]

  constructor(needRepeat: boolean, results: HeapVal[]) {
    this.needRepeat = needRepeat
    this.results = results
  }
}

// all builtin functions take in the current goroutine and a list of heap values as function parameters,
// then return a pair consisting of a boolean (whether instruction needs to be rerun i.e. block) and function result values (if any)
export function generateBuiltins(mem: HeapBuffer) {
  let builtins = {
    make: {
      func: (_: GoRoutine, ...x: HeapVal[]): BuiltinFuncOutput => {
        return new BuiltinFuncOutput(false, [])
      }
    },
    print: {
      func: (_: GoRoutine, ...x: HeapVal[]): BuiltinFuncOutput => {
        if (x.length > 0) {
          console.log(x[0].val)
        }
        // print needs to return a value as the compiler currently assumes it produces a value
        // since print is an identifier, the compiler appends a pop instruction after it
        // hence we need to add an undefined value to the stack to avoid other values getting popped
        return new BuiltinFuncOutput(false, [new HeapVal(0, ValType.Undefined)])
      }
    },
    makeSemaphore: {
      func: (_: GoRoutine, ...x: HeapVal[]): BuiltinFuncOutput => {
        if (x.length == 0) {
          // create default semaphore (binary semaphore)
          const semaphoreAddr = mem.heap_allocate_Semaphore()
          return new BuiltinFuncOutput(false, [new HeapVal(semaphoreAddr, ValType.Semaphore)])
        } else if (x[0].type === ValType.Int32) {
          // semaphore initial value specified
          const semaphoreAddr = mem.heap_allocate_Semaphore(x[0].val as number)
          return new BuiltinFuncOutput(false, [new HeapVal(semaphoreAddr, ValType.Semaphore)])
        } else {
          throw new BadBuiltinArgValError('makeSemaphore', x[0].val)
        }
      }
    },
    wait: {
      func: (currRoutine: GoRoutine, ...x: HeapVal[]): BuiltinFuncOutput => {
        if (x.length == 0) {
          throw new MissingBuiltinArgError('wait', 'semaphore')
        } else if (x[0].type === ValType.Semaphore) {
          const acquiredSem = mem.semaphoreWait(x[0].val as number) // wait should be an atomic operation? so this should never block at all
          if (!acquiredSem) {
            currRoutine.blocked = true
            // rerun this instruction next time
            return new BuiltinFuncOutput(true, [])
          }
        } else {
          throw new BadBuiltinArgValError('wait', x[0].val)
        }
        // lock acquired, no blocks
        return new BuiltinFuncOutput(false, [new HeapVal(0, ValType.Undefined)])
      }
    },
    signal: {
      func: (_: GoRoutine, ...x: HeapVal[]): BuiltinFuncOutput => {
        if (x.length == 0) {
          throw new MissingBuiltinArgError('signal', 'semaphore')
        } else if (x[0].type === ValType.Semaphore) {
          mem.semaphoreSignal(x[0].val as number)
        } else {
          throw new BadBuiltinArgValError('signal', x[0].val)
        }
        return new BuiltinFuncOutput(false, [new HeapVal(0, ValType.Undefined)])
      }
    },
    makeWg: {
      func: (_: GoRoutine, ...x: HeapVal[]): BuiltinFuncOutput => {
        const wgAddr = mem.heap_allocate_WaitGroup()
        return new BuiltinFuncOutput(false, [new HeapVal(wgAddr, ValType.WaitGroup)])
      }
    },
    incrementWg: {
      func: (currRoutine: GoRoutine, ...x: HeapVal[]): BuiltinFuncOutput => {
        if (x.length < 2) {
          throw new MissingBuiltinArgError('incrementWg', 'WaitGroup, increment number')
        } else if (x[0].type === ValType.WaitGroup && x[1].type === ValType.Int32) {
          const incStatus = mem.incrementWaitGroup(x[0].val as number, x[1].val as number)
          if (!incStatus) {
            currRoutine.blocked = true
            return new BuiltinFuncOutput(true, [new HeapVal(0, ValType.Undefined)])
          }
          return new BuiltinFuncOutput(false, [])
        } else {
          throw new BadBuiltinArgValError('incrementWg', x[0].val)
        }
      }
    },
    decrementWg: {
      func: (currRoutine: GoRoutine, ...x: HeapVal[]): BuiltinFuncOutput => {
        if (x.length == 0) {
          throw new MissingBuiltinArgError('decrementWg', 'WaitGroup')
        } else if (x[0].type === ValType.WaitGroup) {
          if (!currRoutine.wasBlocked) {
            // first time executing statement
            const isDecrease = mem.decrementWaitGroup(x[0].val as number)
            currRoutine.blocked = true
            if (isDecrease) {
              currRoutine.wasBlocked = true // when we execute this instruction again next time, do not decrement the conuter again
            }
            return new BuiltinFuncOutput(true, [])
          } else {
            const canLeave = mem.isWaitGroupCounterZero(x[0].val as number)
            if (canLeave) {
              currRoutine.wasBlocked = false // do not execute this instruction again next cycle
              return new BuiltinFuncOutput(false, [new HeapVal(0, ValType.Undefined)])
            }
            // counter is still not zero, continue blocking
            currRoutine.wasBlocked = true
            currRoutine.blocked = true
            return new BuiltinFuncOutput(true, [])
          }
        } else {
          throw new BadBuiltinArgValError('decrementWg', x[0].val)
        }
      }
    }
  }
  return Object.values(builtins)
}

export const builtin_keywords = ['make', 'print', 'makeSemaphore', 'wait', 'signal', 'makeWg', 'incrementWg', 'decrementWg']
