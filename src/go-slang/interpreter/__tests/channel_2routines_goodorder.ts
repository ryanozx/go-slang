/*
Test Case: Order of sends and receive are correct

For an unbuffered channel,
- sends are blocked if there are no receivers
- receives are blocked if there is no sender (i.e. no values sent)

Expected output:
- prints 1, then 2, then VM terminates

Explanation:
chan1 sends and receives first, then chan2 sends and receives
*/
import { parseCompileAndRunGo } from '../..'

// Takes goslang string and converts it to AST in JSON format
let gslang_code = `
package main

func main() {
  chan1 := make(chan int)
  //chan1 := make(chan int, 10)
  chan2 := make(chan int)
  go foo(chan1, chan2);
  chan1 <- 1
  chan2 <- 2
}
func foo(chan1 chan int, chan2 chan int) {
  print(<-chan1)
  print(<-chan2)
  //<-chan2
}
`
parseCompileAndRunGo(gslang_code)
