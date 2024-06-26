import { parseCompileAndRunGo } from '../..'


/*
  Test: Demonstrate ability of language to store and print strings, as well as the ability to concatenate strings

  Expected output: "abc", "def", "abcdef", "abcabc"
*/

const string_test_str = `
package main

import "fmt"

func main() {
  x, y := "abc", "def"
  print(x) // should print "abc"
  print(y) // should print "def"
  print(x + y) // should print "abcdef" to console
  x += x
  print(x) // should print "abcabc" to console
}`

parseCompileAndRunGo(string_test_str)
