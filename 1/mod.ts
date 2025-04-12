import { parser } from "./parser.js"

console.log(parser.parse(`
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
`))
