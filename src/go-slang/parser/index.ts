import * as dotenv from 'dotenv'

dotenv.config({path: __dirname + "/../../../.env"})

export async function GoslangToAstJson(goslang_code: string): Promise<JSON> {
  return fetch(process.env.BACKEND_SERVER_URL + '/go-parse', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    body: JSON.stringify({ Code: goslang_code })
  }).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json() as Promise<JSON>
  })
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
