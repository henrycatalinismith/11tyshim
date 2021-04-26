import { spawn } from "child_process"
import { name, version } from "./package.json"

describe(`${name}@${version}`, () => {
  let child

  afterEach(done => {
    child.kill()
    done()
  })

  test("finish", (done) => {
    child = spawn("yarn", [
      "eleventy",
      "--config=test.eleventy.js",
    ])

    let output
    child.stdout.on("data", data => {
      output += data
    })

    child.stderr.on("data", data => {
      console.error(data)
    })

    child.on("exit", function (code, signal) {
      expect(output).toContain("--finish--")
      done()
    })
  })

  test("serve", (done) => {
    child = spawn("yarn", [
      "eleventy",
      "--config=test.eleventy.js",
      "--serve",
    ])

    child.stdout.on("data", data => {
      if (data.toString().includes("--serve--")) {
        child.kill()
        done()
      }
    })

    child.stderr.on("data", data => {
      console.error(data)
    })
  })
})

