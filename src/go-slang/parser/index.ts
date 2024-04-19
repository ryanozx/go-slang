

export async function GoslangToAstJson(go_code: string): Promise<JSON> {
  console.log(go_code)
  return async function() {
    const res = await fetch('http://localhost:8080/goslang-ast_json', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
      },
      method: 'POST',
      body: JSON.stringify({ goslang_code: go_code })
    }).then(res => res.json())
    return res
  }()
}

/*
let gslang_code = `package main

import (
    "fmt"
)

func GetFoo() {
    hello := make(chan int, 10)
    test := foo()
    fmt.Println(test)
}

func foo() int {
    return 0
}`;

GoslangToAstJson(gslang_code).then((res) => {console.log(res); console.log(Object.keys(res))});
*/
/*
console.log(res.Decls[1].Body.List); console.log(Object.keys(res.Decls[1].Body.List));})
*/
