/*
Test Case:
Send on a unbuffered channel blocks if there is no receiver

Expected output:
VM does not terminate and nothing is printed to the screen
*/
import { parseCompileAndRunGo } from '../..'


// Takes goslang string and converts it to AST in JSON format
let gslang_code = `
package main

func main() {
  chan1 := make(chan int)
  chan1 <- 1
  print("Terminate")
}
`
parseCompileAndRunGo(gslang_code)
