import { parser } from "./parser.js"

const tree = parser.parse(`
print("Hello, World!")
`)

let depth = 0
tree.iterate({
    enter(node) {
        console.log("| ".repeat(depth++) + node.name)
    },
    leave(node) {
        depth--
    }
})
