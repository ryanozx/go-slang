import { parseCompileAndRunGo } from '../..'


/*
  Test: Demonstrate ability to use wait groups to synchronise goroutines

  Expected output: sequences containing 1 and 2 (interleaving goroutines executing for loops), then followed
  by 2 "f DONE" and terminated with "Main done"

  Explanation: the parent goroutine has to wait for all child goroutines to complete before it can print "Main done"
*/

const waitGroup_test = `
package main

import "fmt"

func main() {
  wg := makeWg()
  incrementWg(wg, 3)

  f := func(x int) {
    for i := 0; i < 20; i++ {
      print(x)
    }
    print("f DONE")
    decrementWg(wg)
  }

  go f(1)
  go f(2)
  decrementWg(wg)
  print("Main done")
}`

parseCompileAndRunGo(waitGroup_test)