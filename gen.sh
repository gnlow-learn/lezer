name=$1

deno run -A npm:@lezer/generator $name/.grammar -o $name/parser.js
