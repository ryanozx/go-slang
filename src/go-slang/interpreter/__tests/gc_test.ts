import { parseCompileAndRunGo } from '../..'

/*
  Test: Demonstrate garbage collection ability

  Expected output: Several lines indicating that the GC has been executed (when the memory used has grown
    to approximately twice that of the amount at the end of the last GC cycle). After the garbage collection
    algorithm runs, the amount of memory used should decrease. Memory appears to be growing as the current
    algorithm ensures that all objects survive at least the first GC cycle encountered after existence, regardless
    of whether there is a reference to it or not
*/

const waitGroup_test = `
package main

import "fmt"

func main() {
  for i := 0; i < 1000; i++ {

  }
  print("DONE")
}`

parseCompileAndRunGo(waitGroup_test)