/*
Test Case:
VM terminates as there is no sending to a full channel

Expected output:
Nothing printed, but VM should terminate
*/
import { parseCompileAndRunGo } from '../..'


// Takes goslang string and converts it to AST in JSON format
let gslang_code = `
package main

func main() {
  chan1 := make(chan int, 5)
  print("Sending 1")
  chan1 <- 1
  print("Sent 1")
  print("Sending 2")
  chan1 <- 2
  print("Sent 2")
  print("Sending 3")
  chan1 <- 3
  print("Sent 3")
  print("Sending 4")
  chan1 <- 4
  print("Sent 4")
  print("Sending 5")
  chan1 <- 5 
  print("Sent 5")
}
`

parseCompileAndRunGo(gslang_code)