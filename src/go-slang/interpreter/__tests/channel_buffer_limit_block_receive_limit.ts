/*
Test Case:
Blocking should occur when there is an attempt to input more when the channel buffer is full.
Receiving should free up buffer to prevent blocking on another send
Receiving is limited to number of items in the buffer, attempting to receive beyond the number of items in buffer will block
*/
import { GoslangToAstJson } from '../../parser'
import { parseFile } from '../../ast/ast'
import * as nodes from '../../ast/nodes'
import { compile } from '../../compiler/compiler'
import { GoVirtualMachine } from "../go-vm"

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

  <-chan1
  <-chan1
  <-chan1
  <-chan1
  <-chan1
  
  //<-chan1 // should block if this is not commented out, since it would be receiving on a channel with an empty buffer
}
`

GoslangToAstJson(gslang_code).then((result: any) => {
  const parsed_ast: nodes.File = parseFile(result)
  const compiled_parsed_ast = compile(parsed_ast)
  const vm: GoVirtualMachine = new GoVirtualMachine(compiled_parsed_ast, true)
  vm.run()
})