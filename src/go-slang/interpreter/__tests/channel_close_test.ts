/*
Test Case:
Closed channels should be able to be received from constantly to receive default value 0
Closed channels should panic when there is an attempt to send to a closed channel
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
  chan1 <- 3
  chan1 <- 5

  close(chan1)

  <-chan1
  <-chan1
  <-chan1
  <-chan1
  <-chan1
  <-chan1

  //chan1<-1  // if not commented out, should Panic Error since there is an attempt to send to a closed channel!
}
`

GoslangToAstJson(gslang_code).then((result: any) => {
  const parsed_ast: nodes.File = parseFile(result)
  const compiled_parsed_ast = compile(parsed_ast)
  console.log(compiled_parsed_ast)
  const vm: GoVirtualMachine = new GoVirtualMachine(compiled_parsed_ast, true)
  vm.run()
})