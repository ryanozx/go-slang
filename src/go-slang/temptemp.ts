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

func GetFoo(cc chan int, gg chan int) {
  gg <- 100
  var abc = 123;
  abc = <-gg
  var aaa = 10
  var bbb = 10
  a := <-cc
}
func main() {
  gogo := make(chan int, 10)
  gggg := make(chan int)
  go GetFoo(gogo, gggg);
  foo(gogo, gggg);
  gogo <- 19
  gogo <- 11
}
func foo(cc chan int, gg chan int) int {
  <-gg
  gg<-11
  <-cc
  var ccc = 111;
  car ddd = 11111;
  print(ccc)
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
  //console.log(JSON.stringify(parsed_ast, null, "  "))
  const compiled_parsed_ast = compile(parsed_ast)
  //console.log(compiled_parsed_ast)
  debugCompile(compiled_parsed_ast)
  const vm: GoVirtualMachine = new GoVirtualMachine(compiled_parsed_ast, true)
  vm.run()
})

/*
[
  EnterScopeInstruction { varCount: 3 },
  LoadFunctionInstruction { arity: 5, addr: 3 },
  GotoInstruction { dest: 20 },
  IdentInstruction {
    sym: 'cc',
    pos: EnvironmentPos { env_offset: 3, frame_offset: 0 }
  },
  BasicLitInstruction { tokenType: 5, value: 10 },
  SendInstruction {},
  ChannelDeclarationInstruction {
    BufferSize: 10,
    ChannelPassType: 'int'
  },
  AssignInstruction {
    pos: EnvironmentPos { env_offset: 3, frame_offset: 2 }
  },
  IdentInstruction {
    sym: 'hello',
    pos: EnvironmentPos { env_offset: 3, frame_offset: 2 }
  },
  BasicLitInstruction { tokenType: 5, value: 123 },
  SendInstruction {},
  IdentInstruction {
    sym: 'hello',
    pos: EnvironmentPos { env_offset: 3, frame_offset: 2 }
  },
  UnOpInstruction { op: 36 },
  AssignInstruction {
    pos: EnvironmentPos { env_offset: 3, frame_offset: 1 }
  },
  ChannelDeclarationInstruction {
    BufferSize: undefined,
    ChannelPassType: 'int'
  },
  AssignInstruction {
    pos: EnvironmentPos { env_offset: 3, frame_offset: 3 }
  },
  IdentInstruction {
    sym: 'foo',
    pos: EnvironmentPos { env_offset: 2, frame_offset: 2 }
  },
  CallInstruction { arity: 0 },
  AssignInstruction {
    pos: EnvironmentPos { env_offset: 3, frame_offset: 4 }
  },
  ResetInstruction {},
  AssignInstruction {
    pos: EnvironmentPos { env_offset: 2, frame_offset: 0 }
  },
  LoadFunctionInstruction { arity: 1, addr: 23 },
  GotoInstruction { dest: 38 },
  ChannelDeclarationInstruction {
    BufferSize: undefined,
    ChannelPassType: 'int'
  },
  AssignInstruction {
    pos: EnvironmentPos { env_offset: 3, frame_offset: 0 }
  },
  IdentInstruction {
    sym: 'GetFoo',
    pos: EnvironmentPos { env_offset: 2, frame_offset: 0 }
  },
  IdentInstruction {
    sym: 'gogo',
    pos: EnvironmentPos { env_offset: 3, frame_offset: 0 }
  },
  GoInstruction { arity: 1 },
  GotoInstruction { dest: 31 },
  CallInstruction { arity: 1 },
  DestroyGoroutineInstruction {},
  IdentInstruction {
    sym: 'foo',
    pos: EnvironmentPos { env_offset: 2, frame_offset: 2 }
  },
  IdentInstruction {
    sym: 'gogo',
    pos: EnvironmentPos { env_offset: 3, frame_offset: 0 }
  },
  GoInstruction { arity: 1 },
  GotoInstruction { dest: 37 },
  CallInstruction { arity: 1 },
  DestroyGoroutineInstruction {},
  ResetInstruction {},
  AssignInstruction {
    pos: EnvironmentPos { env_offset: 2, frame_offset: 1 }
  },
  LoadFunctionInstruction { arity: 1, addr: 41 },
  GotoInstruction { dest: 47 },
  IdentInstruction {
    sym: 'cc',
    pos: EnvironmentPos { env_offset: 3, frame_offset: 0 }
  },
  UnOpInstruction { op: 36 },
  PopInstruction {},
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

/*
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
  BasicLitInstruction { tokenType: 5, value: 123 },
  SendInstruction {},
  IdentInstruction {
    sym: 'abc',
    pos: EnvironmentPos { env_offset: 3, frame_offset: 0 }
  },
  IdentInstruction {
    sym: 'hello',
    pos: EnvironmentPos { env_offset: 3, frame_offset: 1 }
  },
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

/*
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
  BasicLitInstruction { tokenType: 5, value: 123 },
  SendInstruction {},
  IdentInstruction {
    sym: 'hello',
    pos: EnvironmentPos { env_offset: 3, frame_offset: 1 }
  },
  UnOpInstruction { op: 36 },
  AssignInstruction {
    pos: EnvironmentPos { env_offset: 3, frame_offset: 0 }
  },
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
