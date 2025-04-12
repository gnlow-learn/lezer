import { parser } from "./parser.js"

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
    if (n == 0) return "a"
    let res = ""
    while (n > 0) {
        res = String.fromCharCode(97 + (n % 26)) + res
        n = Math.floor(n / 26)
    }
    return res
}

const stack: string[] = []
const table: string[] = []

const pstack: string[] = []

const addSymbol =
(str: string) => {
    table.push(`vv${getVarName(table.length)}\t${str}`)
}

tree.iterate({
    enter(node) {
        ({
            FunctionCall() {
                console.log(node.node.firstChild.name)
            },
        } as Record<string, () => void>)[node.name]?.()
    },
    leave(node) {
        ({
            Identifier() {
                const content = code.slice(node.from, node.to)
                stack.push(content)
            },
            String() {
                const content = code.slice(node.from+1, node.to-1)
                addSymbol(`BYTE\tC'${content}'`)
            },

            FunctionCall() {

            },
        } as Record<string, () => void>)[node.name]?.()
    }
})

console.log(stack.concat(table).join("\n"))
