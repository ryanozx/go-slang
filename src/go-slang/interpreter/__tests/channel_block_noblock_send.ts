/*
Test Case:
block on send on a unbuffered channel
no blocking and execute to completion when sending on a buffered channel

(Buffered and Unbuffered channels by commenting out the different channel types)
*/
import { GoslangToAstJson } from '../../parser'
import { parseFile } from '../../ast/ast'
import * as nodes from '../../ast/nodes'
import { compile } from '../../compiler/compiler'
import { GoVirtualMachine } from '../go-vm'

// Takes goslang string and converts it to AST in JSON format
let gslang_code = `
package main

func main() {
  //chan1 := make(chan int)
  chan1 := make(chan int, 10)
  chan1 <- 1
}
`
GoslangToAstJson(gslang_code).then((result: any) => {
  const parsed_ast: nodes.File = parseFile(result)
  const compiled_parsed_ast = compile(parsed_ast)
  const vm: GoVirtualMachine = new GoVirtualMachine(compiled_parsed_ast, true)
  vm.run()
})
