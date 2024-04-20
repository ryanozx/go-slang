import { parseFile } from '../../ast/ast'
import { compile, debugCompile } from '../../compiler/compiler'
import { GoslangToAstJson } from '../../parser'
import { GoVirtualMachine } from '../go-vm'

const string_test_str = `
package main

import "fmt"

func main() {
  x, y := "abc", "def"
  print(x + y)
}
`

GoslangToAstJson(string_test_str).then(res => {
  const instrs = compile(parseFile(res))
  debugCompile(instrs)
  const vm = new GoVirtualMachine(instrs, true)
  vm.run()
})