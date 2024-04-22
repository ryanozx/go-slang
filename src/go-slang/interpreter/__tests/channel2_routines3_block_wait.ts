/*
Test Case:
In an unbuffered channel, sends are blocked until receivers are available, and receives are blocked
until sends are available

Expected output:
232 prints first, then 111 and 323 (order not deterministic). "GetFoo" should print before "foo"

Explanation: 
main sends 232 to chan1; only foo() can receive it and therefore prints 232.
foo() sends 111 to chan2, which is receivable only by GetFoo().

Next, either main() sends 323 to chan1 as it is no longer blocked or GetFoo() prints 323 first.
Later, foo() receives 323 and prints it.
*/
import { parseCompileAndRunGo } from '../..'


// Takes goslang string and converts it to AST in JSON format
let gslang_code = `
package main

func GetFoo(chan1 chan int, chan2 chan int) {
  print(<-chan2)
  var a = 1
  var b = 2
  var c = 3
  var d = 4
  var e = 5
  print("GetFoo done")
}

func main() {
  chan1 := make(chan int)
  chan2 := make(chan int)
  go GetFoo(chan1, chan2);
  go foo(chan1, chan2);
  chan1 <- 232
  chan1 <- 323
  print("Main done")
}

func foo(chan1 chan int, chan2 chan int) {
  print(<-chan1)
  chan2<-111
  print(<-chan1)
  print("foo done")

}
`

parseCompileAndRunGo(gslang_code)
