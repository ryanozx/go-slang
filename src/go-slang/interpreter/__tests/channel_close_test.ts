/*
Test Case:
After a channel is closed, receivers will read whatever remaining values are in the channel.
If there are no more values in the channel, receiver should receive default 0 value

Expected output:
1, 3, 5, 0 (default value) printed to screen
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
  chan1 := make(chan int, 5)

  chan1 <- 1
  chan1 <- 3
  chan1 <- 5

  close(chan1)

  print(<-chan1) // prints 1
  print(<-chan1) // prints 3
  print(<-chan1) // prints 5
  print(<-chan1) // prints 0 (default value)

}
`

GoslangToAstJson(gslang_code).then((result: any) => {
  const parsed_ast: nodes.File = parseFile(result)
  const compiled_parsed_ast = compile(parsed_ast)
  const vm: GoVirtualMachine = new GoVirtualMachine(compiled_parsed_ast, false)
  vm.run()
})
