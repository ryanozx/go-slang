import { parseFile } from './ast/ast'
import { compile } from './compiler/compiler'
import { GoVirtualMachine } from './interpreter/go-vm'
import { GoslangToAstJson } from './parser'

export function compileAndRunGo(code: JSON) {
  const instrs = compile(parseFile(code))
  const vm = new GoVirtualMachine(instrs, false)
  vm.run()
}

export async function parseCompileAndRunGo(codeStr : string) {
  await GoslangToAstJson(codeStr).then(ast => compileAndRunGo(ast))
}
