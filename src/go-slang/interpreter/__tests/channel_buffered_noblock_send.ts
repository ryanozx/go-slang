/*
Test Case:
Send on a buffered channel does not block

Expected output:
"Terminate" printed to console and VM terminates
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
  chan1 := make(chan int, 10)
  chan1 <- 1
  print("Terminate")
}
`
GoslangToAstJson(gslang_code).then((result: any) => {
  const parsed_ast: nodes.File = parseFile(result)
  const compiled_parsed_ast = compile(parsed_ast)
  const vm: GoVirtualMachine = new GoVirtualMachine(compiled_parsed_ast, false)
  vm.run()
})
