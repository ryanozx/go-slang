import { compile, debugCompile } from '../../compiler/compiler'
import { parseFile } from '../../ast/ast'
import { GoVirtualMachine } from '../go-vm'
import { GoslangToAstJson } from '../../parser'

const goroutine_str = `
package main

import "fmt"

func f(x int, y int) {
  for i := 0; i < y; i++ {
  	print("Thread")
    print(x)
    print(2 * i)
  }
}

func main() {
  go f(1, 40)
  go f(2, 40)
  f(3, 40)
}
`

GoslangToAstJson(goroutine_str).then(res => {
  const instrs = compile(parseFile(res))
  debugCompile(instrs)
  const vm = new GoVirtualMachine(instrs, false)
  vm.run()
})
