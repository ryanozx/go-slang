/*
Test Case: Order of sends and receives is wrong

For an unbuffered channel,
- sends are blocked if there are no receivers
- receives are blocked if there is no sender (i.e. no values sent)


Expected output:
- nothing printed, VM does not terminate

Explanation:
chan1 <- 1 is blocked since there is no receiver, thus chan2 <- 2 does not execute. Since foo() calls print(<-chan2) first, and
chan2 is empty, it does not print and is blocked
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
  print(<-chan2)
  print(<-chan1)
  //<-chan2
}
`

parseCompileAndRunGo(gslang_code)
