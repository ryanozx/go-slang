/*
Test Case:
Blocking occurs when a sender tries to send into a full channel

Expected output: VM is unable to terminate as busy waiting occurs
*/
import { GoslangToAstJson } from '../../parser'
import { parseFile } from '../../ast/ast'
import { File } from '../../ast/nodes'
import { compile } from '../../compiler/compiler'
import { GoVirtualMachine } from '../go-vm'

// Takes goslang string and converts it to AST in JSON format
let gslang_code = `
package main

func main() {
  chan1 := make(chan int, 5)
  chan1 <- 1
  chan1 <- 2
  chan1 <- 3
  chan1 <- 4
  chan1 <- 5 
  chan1 <- 6 // channel full, unable to send this value
}
`

GoslangToAstJson(gslang_code).then((result: any) => {
  const parsed_ast: File = parseFile(result)
  const compiled_parsed_ast = compile(parsed_ast)
  const vm: GoVirtualMachine = new GoVirtualMachine(compiled_parsed_ast, false)
  vm.run()
})
