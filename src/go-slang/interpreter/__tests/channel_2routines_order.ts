/*
Test Case:
Blocking situations:
- When both channels are unbuffered and in wrong order. Due to order of send and receive between the goroutines on the channels.

No blocking ituations:
- Unbuffered channel to allow for completion of program without blocking due to the presence of a buffer to allow sending.
- The order of send and receive for each channel matches for the goroutines so the send and receive can execute to completion.
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
  chan1 := make(chan int)
  //chan1 := make(chan int, 10)
  chan2 := make(chan int)
  go foo(chan1, chan2);
  chan1 <- 1
  chan2 <- 2
}
func foo(chan1 chan int, chan2 chan int) int {
  <-chan2
  <-chan1
  //<-chan2
  return 0
}
`
GoslangToAstJson(gslang_code).then((result: any) => {
  const parsed_ast: nodes.File = parseFile(result)
  const compiled_parsed_ast = compile(parsed_ast)
  const vm: GoVirtualMachine = new GoVirtualMachine(compiled_parsed_ast, true)
  vm.run()
})