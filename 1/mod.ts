import { parser } from "./parser.js"

const tree = parser.parse(`
    fun cloop() {
        if (rdrec() == 0) {
            endfil()
        }
        wrrec()
        cloop()
    }

    buffer = resb(4096)

    fun endfil() {
        if (buffer == eof) {

        }
    }
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
