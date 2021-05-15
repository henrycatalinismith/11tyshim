import { Logger } from "eazy-logger"
import { name, version } from "./package.json"

interface EleventyConfig {
  addTransform: (
    name: string,
    fn: (content: string, path: string) => string
  ) => void
}

interface Options {
  write?: (eleventyInstance: any) => void
  finish?: (eleventyInstance: any) => void
  serve?: (eleventyInstance: any) => void
  verbose?: boolean
}

export const shimPlugin = {
  initArguments: {},
  configFunction: function(eleventyConfig: EleventyConfig, options: Options) {
    const logger = Logger({
      prefix: `[{blue:${name}}@{blue:${version}}] `,
    })

    if (!options.verbose) {
      logger.info = () => {}
    }

    setImmediate(
      function() {
        const Eleventy = require(
          process.cwd()
          + '/node_modules/@11ty/eleventy/src/Eleventy.js'
        )

        if (options.write) {
          logger.info("monkeypatching {blue:write}")
          const write = Eleventy.prototype.write
          Eleventy.prototype.write = function() {
            logger.info("running {blue:write}")
            options.write.call(undefined, this)
            write.call(this)
          }
        }

        if (options.finish) {
          logger.info("monkeypatching {blue:finish}")
          const finish = Eleventy.prototype.finish
          Eleventy.prototype.finish = function() {
            logger.info("running {blue:finish}")
            options.finish.call(undefined, this)
            finish.call(this)
          }
        }

        if (options.serve) {
          logger.info("monkeypatching {blue:serve}")
          const serve = Eleventy.prototype.serve
          Eleventy.prototype.serve = function(port) {
            logger.info("running {blue:serve}")
            options.serve.call(undefined, this)
            serve.call(this, port)
          }
        }
      }
    )
  }
}

