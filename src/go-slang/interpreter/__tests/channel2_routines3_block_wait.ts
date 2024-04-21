/*
Test Case:
main routine will block until the 2 other routines passed values using chan2 to completion.
main routine waiting for receiver for chan1 which are in the 2 goroutines at the end, thus main routine will block and skip its quanta until the other 2 goroutines finishes communication using chan2
Visible to see that routine 1 will run instruction 36 repeatedly and pass its quanta repeatedly for some time.
*/
import { GoslangToAstJson } from '../../parser'
import { parseFile } from '../../ast/ast'
import * as nodes from '../../ast/nodes'
import { compile } from '../../compiler/compiler'
import { GoVirtualMachine } from '../go-vm'

// Takes goslang string and converts it to AST in JSON format
let gslang_code = `
package main

func GetFoo(chan1 chan int, chan2 chan int) {
  chan2 <- 100
  <-chan2
  var a = 1
  var b = 2
  var c = 3
  var d = 4
  var e = 5
  <-chan1
}

func main() {
  chan1 := make(chan int)
  chan2 := make(chan int)
  go GetFoo(chan1, chan2);
  go foo(chan1, chan2);
  chan1 <- 232
  chan1 <- 323
}

func foo(chan1 chan int, chan2 chan int) int {
  <-chan2
  chan2<-111
  <-chan1
  return 0
}
`

GoslangToAstJson(gslang_code).then((result: any) => {
  const parsed_ast: nodes.File = parseFile(result)
  const compiled_parsed_ast = compile(parsed_ast)
  const vm: GoVirtualMachine = new GoVirtualMachine(compiled_parsed_ast, true)
  vm.run()
})
