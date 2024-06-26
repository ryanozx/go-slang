import { parseCompileAndRunGo } from '../..'


const goroutine_str = `
package main

import "fmt"

func f1(y int) {
  for i := 0; i < y; i++ {
  	print("Thread 1")
  }
}

func f2(y int) {
  for i := 0; i < y; i++ {
  	print("Thread 2")
  }
}

func f3(y int) {
  for i := 0; i < y; i++ {
  	print("Main")
  }
}

func main() {
  go f1(40)
  go f2(40)
  f3(40)
}
`

parseCompileAndRunGo(goroutine_str)
