/*
Test Case:
Send on a buffered channel does not block

Expected output:
"Terminate" printed to console and VM terminates
*/
import { parseCompileAndRunGo } from '../..'

// Takes goslang string and converts it to AST in JSON format
let gslang_code = `
package main

func main() {
  chan1 := make(chan int, 10)
  chan1 <- 1
  print("Terminate")
}
`
parseCompileAndRunGo(gslang_code)
