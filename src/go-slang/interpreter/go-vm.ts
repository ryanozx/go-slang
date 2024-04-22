import * as Inst from '../compiler/instructions'
import * as Token from '../tokens/tokens'
import { HeapBuffer } from '../heap/heap'
import { HeapVal, ValType } from '../heap/heapVals'
import { UnassignedVarError } from '../heap/errors'
import { GoRoutine } from './goroutine'
import { EmptyOsError, EmptyRtsError } from './errors'
import { binop_microcode, unop_microcode } from './microcode'
import { generateBuiltins } from './builtins'

const TIME_QUANTUM = 50 // switch goroutines after 50 lines executed

export class GoVirtualMachine {
  memory: HeapBuffer
  instrs: Inst.Instruction[]
  debugMode: boolean

  constructor(instrs: Inst.Instruction[], debugMode?: boolean) {
    this.instrs = instrs
    this.memory = new HeapBuffer()
    this.debugMode = debugMode !== undefined && debugMode
  }

  run() {
    const mem = this.memory
    let routineId = 1
    let globalEnv = mem.heap_allocate_Environment(0)
    // load literal frame
    globalEnv = mem.heap_Environment_extend(mem.allocate_literals_frame(), globalEnv)
    // load builtin frame
    globalEnv = mem.heap_Environment_extend(mem.allocate_builtin_frame(), globalEnv)
    const rootRoutine = new GoRoutine(globalEnv, routineId++)
    mem.grQueue.push(rootRoutine)

    const builtin_func = generateBuiltins(mem)

    while (!mem.grQueue.isEmpty()) {
      const currRoutine = mem.grQueue.peek()
      if (currRoutine === undefined) {
        break
      }
      if (this.debugMode) {
        console.log('Running routine %d', currRoutine.id)
        //console.log(mem.grQueue.size)
        //if (mem.grQueue.size === 3){return}
      }
      let step = 0
      let inst: Inst.Instruction
      const OS = currRoutine.OS
      const RTS = currRoutine.RTS
      currRoutine.blocked = false
      while (step < TIME_QUANTUM && !currRoutine.blocked && !currRoutine.terminate) {
        if (this.debugMode) {
          console.log('Executing instruction %d', currRoutine.PC)
        }
        inst = this.instrs[currRoutine.PC++]
        switch (inst.getType()) {
          case Inst.InstType.DONE:
            currRoutine.terminate = true
            break
          case Inst.InstType.LDC:
            const basicInst = inst as Inst.BasicLitInstruction
            switch (basicInst.tokenType) {
              case Token.token.STRING:
                OS.push(mem.valToAddr(new HeapVal(basicInst.value as string, ValType.String)))
                break
              case Token.token.CHAR:
                OS.push(
                  mem.valToAddr(
                    new HeapVal((basicInst.value as string).charCodeAt(1), ValType.Char)
                  )
                )
                break
              case Token.token.INT:
                OS.push(
                  mem.valToAddr(new HeapVal(Number(basicInst.value as string), ValType.Int32))
                )
                break
            }
            break
          case Inst.InstType.UNOP:
            const unxAddr = OS.pop()
            if (unxAddr === undefined) {
              throw new EmptyOsError()
            }
            const un_op_type = (inst as Inst.UnOpInstruction).op
            if (un_op_type === Token.token.ARROW) {
              const receving_channel_address = unxAddr
              // console.log("Requesting from %d", unxAddr)
              //console.log(currRoutine.id, "receiving")
              const received = mem.heap_recv_channel(receving_channel_address)
              if (received !== undefined) {
                OS.push(received)
                //return
                //currRoutine.PC++
              } else {
                OS.push(receving_channel_address)
                currRoutine.blocked = true
              }
            } else {
              const unop = unop_microcode.get(un_op_type)
              if (unop !== undefined) {
                const res = unop(mem.addrToVal(unxAddr))
                OS.push(mem.valToAddr(res))
              } else {
                throw new Error('Unary operation not found!')
              }
            }
            break

          case Inst.InstType.BINOP:
            const binyAddr = OS.pop()
            if (binyAddr === undefined) {
              throw new EmptyOsError()
            }
            const binxAddr = OS.pop()
            if (binxAddr === undefined) {
              throw new EmptyOsError()
            }
            const binop = binop_microcode.get((inst as Inst.BinOpInstruction).op)
            if (binop !== undefined) {
              const res = binop(mem.addrToVal(binxAddr), mem.addrToVal(binyAddr))
              OS.push(mem.valToAddr(res))
            } else {
              throw new Error('Binary operation not found!')
            }
            break
          case Inst.InstType.LD:
            const item = mem.heap_get_Environment_value(
              currRoutine.ENV,
              (inst as Inst.IdentInstruction).pos
            )
            if (mem.isUnassigned(item)) {
              throw new UnassignedVarError()
            }
            OS.push(item)
            break
          case Inst.InstType.POP:
            OS.pop()
            break
          case Inst.InstType.JOF:
            const jofXAddr = OS.pop()
            if (jofXAddr === undefined) {
              throw new EmptyOsError()
            }
            if (!(mem.addrToVal(jofXAddr).val as boolean)) {
              currRoutine.PC = (inst as Inst.JumpOnFalseInstruction).dest
            }
            break
          case Inst.InstType.GOTO:
            currRoutine.PC = (inst as Inst.GotoInstruction).dest
            break
          case Inst.InstType.ITER_END:
            break
          case Inst.InstType.FOR_END:
            break
          case Inst.InstType.CALL:
            const callArgs: number[] = []
            const callInst = inst as Inst.CallInstruction
            for (let i = callInst.arity - 1; i >= 0; --i) {
              const arg = OS.pop()
              if (arg === undefined) {
                throw new EmptyOsError()
              }
              callArgs.push(arg)
            }
            const funcAddr = OS.pop()
            if (funcAddr === undefined) {
              throw new EmptyOsError()
            }
            if (mem.isBuiltin(funcAddr)) {
              const builtinId = mem.heap_get_builtin_id(funcAddr)
              let builtinCallArgs: HeapVal[] = []
              callArgs.forEach(argAddr => builtinCallArgs.push(mem.addrToVal(argAddr)))

              builtinCallArgs = builtinCallArgs.reverse()
              // pass in currRoutine, so that builtin functions can access goroutine properties
              const builtinRes = builtin_func[builtinId].func(currRoutine, ...builtinCallArgs)
              if (builtinRes.needRepeat) {
                // CALL instruction will be executed next cycle, ensure the closure address and the argument values are in operand stack
                OS.push(funcAddr)
                for (let i = callArgs.length - 1; i >= 0; --i) {
                  // args must be pushed in reverse of the order they were popped in
                  OS.push(callArgs[i])
                }
              } else {
                for (var res of builtinRes.results) {
                  OS.push(mem.valToAddr(res))
                }
              }
            } else {
              const frameSize = mem.heap_get_Closure_arity(funcAddr)
              const frameAddr = mem.heap_allocate_Frame(frameSize)
              for (let i = callInst.arity - 1; i >= 0; --i) {
                // need to reverse order since callArgs was filled by popping the operand stack
                mem.heap_set_frame_child(frameAddr, callInst.arity - 1 - i, callArgs[i])
              }
              const newCallEnv = mem.heap_Environment_extend(
                frameAddr,
                mem.heap_get_Closure_env(funcAddr)
              )
              const newPC = mem.heap_get_Closure_pc(funcAddr)
              RTS.push(mem.heap_allocate_Callframe(currRoutine.PC, currRoutine.ENV))
              currRoutine.ENV = newCallEnv
              currRoutine.PC = newPC
            }
            break
          case Inst.InstType.ENTER_SCOPE:
            const blockFrame = mem.heap_allocate_Blockframe(currRoutine.ENV)
            RTS.push(blockFrame)
            const scopeFrame = mem.heap_allocate_Frame(
              (inst as Inst.EnterScopeInstruction).varCount
            )
            currRoutine.ENV = mem.heap_Environment_extend(scopeFrame, currRoutine.ENV)
            break
          case Inst.InstType.EXIT_SCOPE:
            const prevEnvAddr = RTS.pop()
            if (prevEnvAddr === undefined) {
              throw new EmptyRtsError()
            }
            currRoutine.ENV = mem.heap_get_Blockframe_environment(prevEnvAddr)
            break
          case Inst.InstType.ASSIGN:
            const assignVal = OS.pop()
            if (assignVal === undefined) {
              throw new EmptyOsError()
            }
            mem.heap_set_Environment_value(
              currRoutine.ENV,
              (inst as Inst.AssignInstruction).pos,
              assignVal
            )
            break
          case Inst.InstType.LDF:
            const loadFuncInst = inst as Inst.LoadFunctionInstruction
            const closureAddr = mem.heap_allocate_Closure(
              loadFuncInst.arity,
              loadFuncInst.addr,
              currRoutine.ENV
            )
            OS.push(closureAddr)
            break
          case Inst.InstType.BREAK:
            while (
              currRoutine.PC < this.instrs.length &&
              this.instrs[currRoutine.PC].getType() !== Inst.InstType.FOR_END
            ) {
              currRoutine.PC++
            }
            currRoutine.PC++
            break
          case Inst.InstType.CONT:
            while (
              currRoutine.PC < this.instrs.length &&
              this.instrs[currRoutine.PC].getType() !== Inst.InstType.ITER_END
            ) {
              currRoutine.PC++
            }
            currRoutine.PC++
            break
          case Inst.InstType.RESET:
            const top_frame = RTS.pop()
            if (top_frame === undefined) {
              throw new EmptyRtsError()
            }
            if (mem.isCallframe(top_frame)) {
              currRoutine.PC = mem.heap_get_Callframe_pc(top_frame)
              currRoutine.ENV = mem.heap_get_Callframe_env(top_frame)
            } else {
              currRoutine.PC--
            }
            break
          case Inst.InstType.GO_DEST:
            currRoutine.terminate = true
            break
          case Inst.InstType.GO:
            const newGrOs: number[] = []
            // push args and function to call
            for (let i = 0; i < (inst as Inst.GoInstruction).arity + 1; ++i) {
              const addr = OS.pop()
              if (addr === undefined) {
                throw new EmptyOsError()
              }
              newGrOs.push(addr)
            }
            const newRoutine = new GoRoutine(currRoutine.ENV, routineId++, currRoutine.PC + 1)
            newRoutine.OS = newGrOs.reverse()
            mem.grQueue.push(newRoutine)
            break
          case Inst.InstType.CHAND:
            const ChannelDeclareInst: Inst.ChannelDeclarationInstruction =
              inst as Inst.ChannelDeclarationInstruction
            const declared_channel_address = mem.heap_allocate_channel(
              ChannelDeclareInst.BufferSize
            )
            OS.push(declared_channel_address) // no type yet...
            break
          case Inst.InstType.SEND:
            //console.log(currRoutine.id, "sending")
            //const ChanSendInst: Inst.SendInstruction = (inst as Inst.SendInstruction)

            const sending_val = OS.pop()
            const send_channel_address = OS.pop()
            if (sending_val === undefined || send_channel_address === undefined) {
              throw new EmptyOsError()
            }
            if (!mem.heap_send_channel(send_channel_address, sending_val)) {
              //currRoutine.PC++
              //console.log("SENTED")
              //return
              OS.push(send_channel_address)
              OS.push(sending_val)
              currRoutine.blocked = true
            }
            break
          case Inst.InstType.CHANU:
            const ChannelUseInst: Inst.ChannelUseInstruction = inst as Inst.ChannelUseInstruction
            const channel_address = Number(OS.pop())
            if (ChannelUseInst.ChannelDirection === 'BOTH') {
              OS.push(channel_address)
            }
            break
          case Inst.InstType.CLOSE_CHAN:
            const closing_channel_address = Number(OS.pop())
            mem.heap_close_channel(closing_channel_address)
            OS.push(-1)
            break
        }
        ++step
        if (currRoutine.blocked) {
          --currRoutine.PC // rollback increment, retry instruction next time
        }
      }
      // gc should not trigger here since no allocation occurs
      mem.grQueue.pop()
      if (!currRoutine.terminate) {
        mem.grQueue.push(currRoutine)
      }
    }
  }
}
