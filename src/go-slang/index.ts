import { parseFile } from "./ast/ast";
import { compile } from "./compiler/compiler";
import { GoVirtualMachine } from "./interpreter/go-vm";

export function compileAndRunGo(code : JSON) {
    const instrs = compile(parseFile(code))
    const vm = new GoVirtualMachine(instrs, false)
    vm.run()
}