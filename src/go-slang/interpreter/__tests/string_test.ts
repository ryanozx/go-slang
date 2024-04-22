import { parseFile } from '../../ast/ast'
import { compile, debugCompile } from '../../compiler/compiler'
import { GoslangToAstJson } from '../../parser'
import { GoVirtualMachine } from '../go-vm'

/*
  Test: Demonstrate ability of language to store and print strings, as well as the ability to concatenate strings
*/

const string_test_str = `
package main

import "fmt"

func main() {
  x, y := "abc", "def"
  print(x) // should print "abc"
  print(y) // should print "def"
  print(x + y) // should print "abcdef" to console
  x += x
  print(x) // should print "abcabc" to console
}`

GoslangToAstJson(string_test_str).then(res => {
  const instrs = compile(parseFile(res))
  const vm = new GoVirtualMachine(instrs, false)
  vm.run()
})
