import { GoslangToAstJson } from './parser'
import { parseFile } from './ast/ast'
import * as nodes from './ast/nodes'
import { compile, debugCompile } from './compiler/compiler'
import { GoVirtualMachine } from './interpreter/go-vm'

//import { writeFile } from "fs";

// Takes goslang string and converts it to AST in JSON format
let gslang_code = `package main

import (
    "fmt"
)

func GetFoo() {
    var abc = 123;
    hello := make(chan int, 10)
    hello <- 123
    abc = <-hello
    test := foo()
    //fmt.Println(test)
}
func main() {
  GetFoo();
  foo();
}
func foo() int {
    return 0
}

func main() {
  GetFoo()
}
`

// make needs to be defined and implemented like the mutexes and etc, else will crash since undefined!

GoslangToAstJson(gslang_code).then(result => {
  //console.log(result);
  const parsed_ast: nodes.File = parseFile(result)
  const compiled_parsed_ast = compile(parsed_ast)
  debugCompile(compiled_parsed_ast)
  const vm: GoVirtualMachine = new GoVirtualMachine(compiled_parsed_ast, true)
  vm.run()
})

/*
{
  "Decls": [
    {
      "Name": {
        "Name": "GetFoo"
      },
      "Type": {
        "Params": {}
      },
      "Body": {
        "List": [
          {
            "Decl": {
              "Tok": 85,
              "Specs": [
                {
                  "Names": [
                    {
                      "Name": "abc"
                    }
                  ],
                  "Values": [
                    {
                      "Kind": 5,
                      "Value": "123"
                    }
                  ]
                }
              ]
            }
          },
          {
            "LeftHandSide": [
              {
                "Name": "hello"
              }
            ],
            "Tok": 47,
            "RightHandSide": [
              {
                "Func": {
                  "Name": "make"
                },
                "Args": [
                  {
                    "Dir": "BOTH",
                    "PassType": "int"
                  },
                  {
                    "Kind": 5,
                    "Value": "10"
                  }
                ]
              }
            ]
          },
          {
            "LeftHandSide": [
              {
                "Name": "abc"
              }
            ],
            "Tok": 42,
            "RightHandSide": [
              {
                "Op": 36,
                "X": {
                  "Name": "hello"
                }
              }
            ]
          },
          {
            "Chan": {
              "Name": "hello"
            },
            "Value": {
              "Kind": 5,
              "Value": "123"
            }
          },
          {
            "LeftHandSide": [
              {
                "Name": "test"
              }
            ],
            "Tok": 47,
            "RightHandSide": [
              {
                "Func": {
                  "Name": "foo"
                }
              }
            ]
          }
        ]
      }
    },
    {
      "Name": {
        "Name": "main"
      },
      "Type": {
        "Params": {}
      },
      "Body": {
        "List": [
          {
            "Expr": {
              "Func": {
                "Name": "GetFoo"
              }
            }
          },
          {
            "Expr": {
              "Func": {
                "Name": "foo"
              }
            }
          }
        ]
      }
    },
    {
      "Name": {
        "Name": "foo"
      },
      "Type": {
        "Params": {},
        "Results": {
          "List": [
            {
              "Names": [],
              "Type": {
                "Name": "int"
              }
            }
          ]
        }
      },
      "Body": {
        "List": [
          {
            "Results": [
              {
                "Kind": 5,
                "Value": "0"
              }
            ]
          }
        ]
      }
    }
  ],
  "Name": {
    "Name": "main"
  },
  "Unresolved": []
}
[
  EnterScopeInstruction { varCount: 3 },
  LoadFunctionInstruction { arity: 3, addr: 3 },
  GotoInstruction { dest: 15 },
  ChannelDeclarationInstruction {
    BufferSize: 10,
    ChannelPassType: 'int'
  },
  AssignInstruction {
    pos: EnvironmentPos { env_offset: 3, frame_offset: 1 }
  },
  IdentInstruction {
    sym: 'hello',
    pos: EnvironmentPos { env_offset: 3, frame_offset: 1 }
  },
  UnOpInstruction { op: 36 },
  AssignInstruction {
    pos: EnvironmentPos { env_offset: 3, frame_offset: 0 }
  },
  IdentInstruction {
    sym: 'hello',
    pos: EnvironmentPos { env_offset: 3, frame_offset: 1 }
  },
  BasicLitInstruction { tokenType: 5, value: 123 },
  SendInstruction {},
  IdentInstruction {
    sym: 'foo',
    pos: EnvironmentPos { env_offset: 2, frame_offset: 2 }
  },
  CallInstruction { arity: 0 },
  AssignInstruction {
    pos: EnvironmentPos { env_offset: 3, frame_offset: 2 }
  },
  ResetInstruction {},
  AssignInstruction {
    pos: EnvironmentPos { env_offset: 2, frame_offset: 0 }
  },
  LoadFunctionInstruction { arity: 0, addr: 18 },
  GotoInstruction { dest: 25 },
  IdentInstruction {
    sym: 'GetFoo',
    pos: EnvironmentPos { env_offset: 2, frame_offset: 0 }
  },
  CallInstruction { arity: 0 },
  PopInstruction {},
  IdentInstruction {
    sym: 'foo',
    pos: EnvironmentPos { env_offset: 2, frame_offset: 2 }
  },
  CallInstruction { arity: 0 },
  PopInstruction {},
  ResetInstruction {},
  AssignInstruction {
    pos: EnvironmentPos { env_offset: 2, frame_offset: 1 }
  },
  LoadFunctionInstruction { arity: 0, addr: 28 },
  GotoInstruction { dest: 31 },
  BasicLitInstruction { tokenType: 5, value: 0 },
  ResetInstruction {},
  ResetInstruction {},
  AssignInstruction {
    pos: EnvironmentPos { env_offset: 2, frame_offset: 2 }
  },
  IdentInstruction {
    sym: 'main',
    pos: EnvironmentPos { env_offset: 2, frame_offset: 1 }
  },
  CallInstruction { arity: 0 },
  ExitScopeInstruction {},
  DoneInstruction {}
]
*/
