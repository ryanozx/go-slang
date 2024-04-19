import { stringToAst } from '../../ast/ast'
import { compile, debugCompile } from '../../compiler/compiler'
import { GoVirtualMachine } from '../go-vm'

const prog3_json = `
{
    "Comments": [],
    "Decls": [
      {
        "Loc": {
          "End": {
            "Filename": "main.go",
            "Offset": 26,
            "Line": 3,
            "Column": 13
          },
          "Start": {
            "Filename": "main.go",
            "Offset": 14,
            "Line": 3,
            "Column": 1
          }
        },
        "Lparen": 0,
        "Rparen": 0,
        "Specs": [
          {
            "Loc": {
              "End": {
                "Filename": "main.go",
                "Offset": 26,
                "Line": 3,
                "Column": 13
              },
              "Start": {
                "Filename": "main.go",
                "Offset": 21,
                "Line": 3,
                "Column": 8
              }
            },
            "Path": {
              "Kind": "STRING",
              "Loc": {
                "End": {
                  "Filename": "main.go",
                  "Offset": 26,
                  "Line": 3,
                  "Column": 13
                },
                "Start": {
                  "Filename": "main.go",
                  "Offset": 21,
                  "Line": 3,
                  "Column": 8
                }
              },
              "Value": "fmt",
              "NodeType": "BasicLit"
            },
            "NodeType": "ImportSpec"
          }
        ],
        "Tok": "import",
        "NodeType": "GenDecl"
      },
      {
        "Body": {
          "Lbrace": 41,
          "List": [
            {
              "Body": {
                "Lbrace": 69,
                "List": [
                  {
                    "Lhs": [
                      {
                        "Loc": {
                          "End": {
                            "Filename": "main.go",
                            "Offset": 74,
                            "Line": 7,
                            "Column": 5
                          },
                          "Start": {
                            "Filename": "main.go",
                            "Offset": 73,
                            "Line": 7,
                            "Column": 4
                          }
                        },
                        "Name": "f",
                        "NodeType": "Ident"
                      }
                    ],
                    "Loc": {
                      "End": {
                        "Filename": "main.go",
                        "Offset": 127,
                        "Line": 10,
                        "Column": 4
                      },
                      "Start": {
                        "Filename": "main.go",
                        "Offset": 73,
                        "Line": 7,
                        "Column": 4
                      }
                    },
                    "Rhs": [
                      {
                        "Body": {
                          "Lbrace": 95,
                          "List": [
                            {
                              "Lhs": [
                                {
                                  "Loc": {
                                    "End": {
                                      "Filename": "main.go",
                                      "Offset": 101,
                                      "Line": 8,
                                      "Column": 6
                                    },
                                    "Start": {
                                      "Filename": "main.go",
                                      "Offset": 100,
                                      "Line": 8,
                                      "Column": 5
                                    }
                                  },
                                  "Name": "z",
                                  "NodeType": "Ident"
                                }
                              ],
                              "Loc": {
                                "End": {
                                  "Filename": "main.go",
                                  "Offset": 110,
                                  "Line": 8,
                                  "Column": 15
                                },
                                "Start": {
                                  "Filename": "main.go",
                                  "Offset": 100,
                                  "Line": 8,
                                  "Column": 5
                                }
                              },
                              "Rhs": [
                                {
                                  "Loc": {
                                    "End": {
                                      "Filename": "main.go",
                                      "Offset": 110,
                                      "Line": 8,
                                      "Column": 15
                                    },
                                    "Start": {
                                      "Filename": "main.go",
                                      "Offset": 105,
                                      "Line": 8,
                                      "Column": 10
                                    }
                                  },
                                  "Op": "*",
                                  "X": {
                                    "Kind": "INT",
                                    "Loc": {
                                      "End": {
                                        "Filename": "main.go",
                                        "Offset": 106,
                                        "Line": 8,
                                        "Column": 11
                                      },
                                      "Start": {
                                        "Filename": "main.go",
                                        "Offset": 105,
                                        "Line": 8,
                                        "Column": 10
                                      }
                                    },
                                    "Value": "2",
                                    "NodeType": "BasicLit"
                                  },
                                  "Y": {
                                    "Loc": {
                                      "End": {
                                        "Filename": "main.go",
                                        "Offset": 110,
                                        "Line": 8,
                                        "Column": 15
                                      },
                                      "Start": {
                                        "Filename": "main.go",
                                        "Offset": 109,
                                        "Line": 8,
                                        "Column": 14
                                      }
                                    },
                                    "Name": "y",
                                    "NodeType": "Ident"
                                  },
                                  "NodeType": "BinaryExpr"
                                }
                              ],
                              "Tok": ":=",
                              "NodeType": "AssignStmt"
                            },
                            {
                              "Loc": {
                                "End": {
                                  "Filename": "main.go",
                                  "Offset": 123,
                                  "Line": 9,
                                  "Column": 13
                                },
                                "Start": {
                                  "Filename": "main.go",
                                  "Offset": 115,
                                  "Line": 9,
                                  "Column": 5
                                }
                              },
                              "Results": [
                                {
                                  "Loc": {
                                    "End": {
                                      "Filename": "main.go",
                                      "Offset": 123,
                                      "Line": 9,
                                      "Column": 13
                                    },
                                    "Start": {
                                      "Filename": "main.go",
                                      "Offset": 122,
                                      "Line": 9,
                                      "Column": 12
                                    }
                                  },
                                  "Name": "z",
                                  "NodeType": "Ident"
                                }
                              ],
                              "Return": 116,
                              "NodeType": "ReturnStmt"
                            }
                          ],
                          "Loc": {
                            "End": {
                              "Filename": "main.go",
                              "Offset": 127,
                              "Line": 10,
                              "Column": 4
                            },
                            "Start": {
                              "Filename": "main.go",
                              "Offset": 94,
                              "Line": 7,
                              "Column": 25
                            }
                          },
                          "Rbrace": 127,
                          "NodeType": "BlockStmt"
                        },
                        "Loc": {
                          "End": {
                            "Filename": "main.go",
                            "Offset": 127,
                            "Line": 10,
                            "Column": 4
                          },
                          "Start": {
                            "Filename": "main.go",
                            "Offset": 78,
                            "Line": 7,
                            "Column": 9
                          }
                        },
                        "Type": {
                          "Func": 79,
                          "Loc": {
                            "End": {
                              "Filename": "main.go",
                              "Offset": 93,
                              "Line": 7,
                              "Column": 24
                            },
                            "Start": {
                              "Filename": "main.go",
                              "Offset": 78,
                              "Line": 7,
                              "Column": 9
                            }
                          },
                          "Params": {
                            "Closing": 89,
                            "List": [
                              {
                                "Loc": {
                                  "End": {
                                    "Filename": "main.go",
                                    "Offset": 88,
                                    "Line": 7,
                                    "Column": 19
                                  },
                                  "Start": {
                                    "Filename": "main.go",
                                    "Offset": 83,
                                    "Line": 7,
                                    "Column": 14
                                  }
                                },
                                "Names": [
                                  {
                                    "Loc": {
                                      "End": {
                                        "Filename": "main.go",
                                        "Offset": 84,
                                        "Line": 7,
                                        "Column": 15
                                      },
                                      "Start": {
                                        "Filename": "main.go",
                                        "Offset": 83,
                                        "Line": 7,
                                        "Column": 14
                                      }
                                    },
                                    "Name": "y",
                                    "NodeType": "Ident"
                                  }
                                ],
                                "Type": {
                                  "Loc": {
                                    "End": {
                                      "Filename": "main.go",
                                      "Offset": 88,
                                      "Line": 7,
                                      "Column": 19
                                    },
                                    "Start": {
                                      "Filename": "main.go",
                                      "Offset": 85,
                                      "Line": 7,
                                      "Column": 16
                                    }
                                  },
                                  "Name": "int",
                                  "NodeType": "Ident"
                                },
                                "NodeType": "Field"
                              }
                            ],
                            "Loc": {
                              "End": {
                                "Filename": "main.go",
                                "Offset": 89,
                                "Line": 7,
                                "Column": 20
                              },
                              "Start": {
                                "Filename": "main.go",
                                "Offset": 82,
                                "Line": 7,
                                "Column": 13
                              }
                            },
                            "Opening": 83,
                            "NodeType": "FieldList"
                          },
                          "Results": {
                            "Closing": 0,
                            "List": [
                              {
                                "Loc": {
                                  "End": {
                                    "Filename": "main.go",
                                    "Offset": 93,
                                    "Line": 7,
                                    "Column": 24
                                  },
                                  "Start": {
                                    "Filename": "main.go",
                                    "Offset": 90,
                                    "Line": 7,
                                    "Column": 21
                                  }
                                },
                                "Names": [],
                                "Type": {
                                  "Loc": {
                                    "End": {
                                      "Filename": "main.go",
                                      "Offset": 93,
                                      "Line": 7,
                                      "Column": 24
                                    },
                                    "Start": {
                                      "Filename": "main.go",
                                      "Offset": 90,
                                      "Line": 7,
                                      "Column": 21
                                    }
                                  },
                                  "Name": "int",
                                  "NodeType": "Ident"
                                },
                                "NodeType": "Field"
                              }
                            ],
                            "Loc": {
                              "End": {
                                "Filename": "main.go",
                                "Offset": 93,
                                "Line": 7,
                                "Column": 24
                              },
                              "Start": {
                                "Filename": "main.go",
                                "Offset": 90,
                                "Line": 7,
                                "Column": 21
                              }
                            },
                            "Opening": 0,
                            "NodeType": "FieldList"
                          },
                          "NodeType": "FuncType"
                        },
                        "NodeType": "FuncLit"
                      }
                    ],
                    "Tok": ":=",
                    "NodeType": "AssignStmt"
                  }
                ],
                "Loc": {
                  "End": {
                    "Filename": "main.go",
                    "Offset": 131,
                    "Line": 11,
                    "Column": 4
                  },
                  "Start": {
                    "Filename": "main.go",
                    "Offset": 68,
                    "Line": 6,
                    "Column": 27
                  }
                },
                "Rbrace": 131,
                "NodeType": "BlockStmt"
              },
              "Cond": {
                "Loc": {
                  "End": {
                    "Filename": "main.go",
                    "Offset": 62,
                    "Line": 6,
                    "Column": 21
                  },
                  "Start": {
                    "Filename": "main.go",
                    "Offset": 56,
                    "Line": 6,
                    "Column": 15
                  }
                },
                "Op": "<",
                "X": {
                  "Loc": {
                    "End": {
                      "Filename": "main.go",
                      "Offset": 57,
                      "Line": 6,
                      "Column": 16
                    },
                    "Start": {
                      "Filename": "main.go",
                      "Offset": 56,
                      "Line": 6,
                      "Column": 15
                    }
                  },
                  "Name": "x",
                  "NodeType": "Ident"
                },
                "Y": {
                  "Kind": "INT",
                  "Loc": {
                    "End": {
                      "Filename": "main.go",
                      "Offset": 62,
                      "Line": 6,
                      "Column": 21
                    },
                    "Start": {
                      "Filename": "main.go",
                      "Offset": 60,
                      "Line": 6,
                      "Column": 19
                    }
                  },
                  "Value": "10",
                  "NodeType": "BasicLit"
                },
                "NodeType": "BinaryExpr"
              },
              "For": 45,
              "Init": {
                "Lhs": [
                  {
                    "Loc": {
                      "End": {
                        "Filename": "main.go",
                        "Offset": 49,
                        "Line": 6,
                        "Column": 8
                      },
                      "Start": {
                        "Filename": "main.go",
                        "Offset": 48,
                        "Line": 6,
                        "Column": 7
                      }
                    },
                    "Name": "x",
                    "NodeType": "Ident"
                  }
                ],
                "Loc": {
                  "End": {
                    "Filename": "main.go",
                    "Offset": 54,
                    "Line": 6,
                    "Column": 13
                  },
                  "Start": {
                    "Filename": "main.go",
                    "Offset": 48,
                    "Line": 6,
                    "Column": 7
                  }
                },
                "Rhs": [
                  {
                    "Kind": "INT",
                    "Loc": {
                      "End": {
                        "Filename": "main.go",
                        "Offset": 54,
                        "Line": 6,
                        "Column": 13
                      },
                      "Start": {
                        "Filename": "main.go",
                        "Offset": 53,
                        "Line": 6,
                        "Column": 12
                      }
                    },
                    "Value": "0",
                    "NodeType": "BasicLit"
                  }
                ],
                "Tok": ":=",
                "NodeType": "AssignStmt"
              },
              "Loc": {
                "End": {
                  "Filename": "main.go",
                  "Offset": 131,
                  "Line": 11,
                  "Column": 4
                },
                "Start": {
                  "Filename": "main.go",
                  "Offset": 44,
                  "Line": 6,
                  "Column": 3
                }
              },
              "Post": {
                "Loc": {
                  "End": {
                    "Filename": "main.go",
                    "Offset": 67,
                    "Line": 6,
                    "Column": 26
                  },
                  "Start": {
                    "Filename": "main.go",
                    "Offset": 64,
                    "Line": 6,
                    "Column": 23
                  }
                },
                "Tok": "++",
                "X": {
                  "Loc": {
                    "End": {
                      "Filename": "main.go",
                      "Offset": 65,
                      "Line": 6,
                      "Column": 24
                    },
                    "Start": {
                      "Filename": "main.go",
                      "Offset": 64,
                      "Line": 6,
                      "Column": 23
                    }
                  },
                  "Name": "x",
                  "NodeType": "Ident"
                },
                "NodeType": "IncDecStmt"
              },
              "NodeType": "ForStmt"
            }
          ],
          "Loc": {
            "End": {
              "Filename": "main.go",
              "Offset": 133,
              "Line": 12,
              "Column": 2
            },
            "Start": {
              "Filename": "main.go",
              "Offset": 40,
              "Line": 5,
              "Column": 13
            }
          },
          "Rbrace": 133,
          "NodeType": "BlockStmt"
        },
        "Loc": {
          "End": {
            "Filename": "main.go",
            "Offset": 133,
            "Line": 12,
            "Column": 2
          },
          "Start": {
            "Filename": "main.go",
            "Offset": 28,
            "Line": 5,
            "Column": 1
          }
        },
        "Name": {
          "Loc": {
            "End": {
              "Filename": "main.go",
              "Offset": 37,
              "Line": 5,
              "Column": 10
            },
            "Start": {
              "Filename": "main.go",
              "Offset": 33,
              "Line": 5,
              "Column": 6
            }
          },
          "Name": "main",
          "NodeType": "Ident"
        },
        "Type": {
          "Func": 29,
          "Loc": {
            "End": {
              "Filename": "main.go",
              "Offset": 39,
              "Line": 5,
              "Column": 12
            },
            "Start": {
              "Filename": "main.go",
              "Offset": 28,
              "Line": 5,
              "Column": 1
            }
          },
          "Params": {
            "Closing": 39,
            "List": [],
            "Loc": {
              "End": {
                "Filename": "main.go",
                "Offset": 39,
                "Line": 5,
                "Column": 12
              },
              "Start": {
                "Filename": "main.go",
                "Offset": 37,
                "Line": 5,
                "Column": 10
              }
            },
            "Opening": 38,
            "NodeType": "FieldList"
          },
          "NodeType": "FuncType"
        },
        "NodeType": "FuncDecl"
      }
    ],
    "Imports": [
      {
        "Loc": {
          "End": {
            "Filename": "main.go",
            "Offset": 26,
            "Line": 3,
            "Column": 13
          },
          "Start": {
            "Filename": "main.go",
            "Offset": 21,
            "Line": 3,
            "Column": 8
          }
        },
        "Path": {
          "Kind": "STRING",
          "Loc": {
            "End": {
              "Filename": "main.go",
              "Offset": 26,
              "Line": 3,
              "Column": 13
            },
            "Start": {
              "Filename": "main.go",
              "Offset": 21,
              "Line": 3,
              "Column": 8
            }
          },
          "Value": "fmt",
          "NodeType": "BasicLit"
        },
        "NodeType": "ImportSpec"
      }
    ],
    "Loc": {
      "End": {
        "Filename": "main.go",
        "Offset": 133,
        "Line": 12,
        "Column": 2
      },
      "Start": {
        "Filename": "main.go",
        "Offset": 0,
        "Line": 1,
        "Column": 1
      }
    },
    "Name": {
      "Loc": {
        "End": {
          "Filename": "main.go",
          "Offset": 12,
          "Line": 1,
          "Column": 13
        },
        "Start": {
          "Filename": "main.go",
          "Offset": 8,
          "Line": 1,
          "Column": 9
        }
      },
      "Name": "main",
      "NodeType": "Ident"
    },
    "Package": 1,
    "Unresolved": [
      {
        "Loc": {
          "End": {
            "Filename": "main.go",
            "Offset": 88,
            "Line": 7,
            "Column": 19
          },
          "Start": {
            "Filename": "main.go",
            "Offset": 85,
            "Line": 7,
            "Column": 16
          }
        },
        "Name": "int",
        "NodeType": "Ident"
      },
      {
        "Loc": {
          "End": {
            "Filename": "main.go",
            "Offset": 93,
            "Line": 7,
            "Column": 24
          },
          "Start": {
            "Filename": "main.go",
            "Offset": 90,
            "Line": 7,
            "Column": 21
          }
        },
        "Name": "int",
        "NodeType": "Ident"
      }
    ],
    "NodeType": "File"
  }`

const prog3_inst = compile(stringToAst(prog3_json))
debugCompile(prog3_inst)
const vm = new GoVirtualMachine(prog3_inst, true)
vm.run()
