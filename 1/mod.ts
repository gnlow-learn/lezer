import {
    SyntaxNodeRef,
    SyntaxNode,
} from "https://esm.sh/@lezer/common@1.2.3"
import { parser } from "./parser.js"
import { Expression, FunctionCall } from "./parser.terms.js";

const code = `
print("Hello, World!")
`

const tree = parser.parse(code)

let depth = 0
tree.iterate({
    enter(node) {
        console.log("| ".repeat(depth++) + node.name)
    },
    leave(node) {
        depth--
    }
})

console.log("\n")

const getVarName =
(n: number) => {
    if (n == 0) return "vva"
    let res = ""
    while (n > 0) {
        res = String.fromCharCode(97 + (n % 26)) + res
        n = Math.floor(n / 26)
    }
    return "vv"+res
}

const stack: string[] = []
const table: string[] = []

const addSymbol =
(str: string) => {
    table.push(`${getVarName(table.length)}\t${str}`)
}

const terminal =
(node: SyntaxNodeRef | SyntaxNode) => {
    return ({
        Identifier() {
            const content = code.slice(node.from, node.to)
            if (node.node.parent?.name == "Expression") {
                stack.push(content)
            }
            return content
        },
        String() {
            const content = code.slice(node.from+1, node.to-1)
            const varName = getVarName(table.length)
            if (node.node.parent?.name == "Expression") {
                addSymbol(`BYTE\tC'${content}'`)
            }
            return "#"+varName
        },
        Expression() {
            return terminal(node.node.firstChild!)
        }
    } as Record<string, () => string>)[node.name]?.()
}

tree.iterate({
    enter(node) {
        ({
            FunctionCall() {
                const funcName = terminal(node.node.getChild("Identifier")!)
                const params = node.node.getChildren("Expression").map(terminal)

                params.forEach(param => {
                    stack.push(`\tLDA\t${param}`)
                    stack.push(`\tJSUB\tpush`)
                })
                stack.push(`\tJSUB\tpushr`)
                stack.push(`\tJSUB\t${funcName}`)
            }
        } as Record<string, () => void>)[node.name]?.()
    },
    leave(node) {

    }
})

console.log(stack.concat(table).join("\n"))
