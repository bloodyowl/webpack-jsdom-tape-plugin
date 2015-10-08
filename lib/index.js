import jsdom from "jsdom"
import tape from "tape-catch"
import chalk from "chalk"

export default ({ url, entry, exit = true }) =>
  function(compilation) {
    this.plugin("done", ({ compilation }) => test({
      compilation, url, entry, exit
    }))
  }

const hasError =
  (item) => item.includes("# fail") || item.trim().indexOf("not ok") === 0

const isOk =
  (item) => item.includes("# pass") || item.trim().indexOf("ok") === 0

const test = ({ compilation, url, entry, exit }) => {
  jsdom.env({
    url: url,
    src: entry.map((e) => {
      return compilation.assets[e]._cachedSource
    }),
    created: (err, window) => {
      const harness = tape.createHarness()
      const stream = harness.createStream()
      const chunks = []
      stream.on("data", (chunk) => {
        if(!chunk) {
          return
        }
        chunks.push(chunk)
        if(hasError(chunk)) {
          console.log(chalk.red(chunk.trim()))
          return
        }
        if(isOk(chunk)) {
          console.log(chalk.green("✔︎") + " " + chalk.gray(chunk.trim()))
          return
        }
        console.log(chalk.gray(chunk.trim()))
      })
      stream.on("end", () => {
        if (exit) {
          if(chunks.find(hasError)) {
            process.exit(1)
          }
          process.exit(0)
        }
      })
      window.tape = harness
    },
  })
}
