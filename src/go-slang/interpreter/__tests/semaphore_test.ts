import { parseCompileAndRunGo } from '../..'

/*
  Test: Demonstrate ability to protect critical sections with semaphores

  Expected output: a sequence of length 100 containing "1" is printed, followed by a sequence of length
  100 containing "2" is printed, then a sequence of length 100 containing "3" is printed (sequence order
    may vary, but sequence integrity is maintained (no interleaving)
  )

  Explanation: the semaphore ensures only one goroutine executing f() can execute the for loop
*/

const waitGroup_test = `
package main

import "fmt"

func main() {
  sem := makeSemaphore()

  f := func(x int) {
    wait(sem)
    for i := 0; i < 100; i++ {
      print(x)
    }
    print("f DONE")
    signal(sem)
  }

  go f(1)
  go f(2)
  go f(3)
}`

parseCompileAndRunGo(waitGroup_test)
