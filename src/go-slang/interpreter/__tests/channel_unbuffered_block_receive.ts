/*
Test Case:
block on receive on a empty unbuffered channel

Expected output:
no output is printed to the screen
*/
import { parseCompileAndRunGo } from '../..'


// Takes goslang string and converts it to AST in JSON format
let gslang_code = `
package main

func main() {
  chan1 := make(chan int)
  <-chan1
}
`
parseCompileAndRunGo(gslang_code)