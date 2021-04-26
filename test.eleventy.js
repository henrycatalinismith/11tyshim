const { shimPlugin } = require("./index.js")

module.exports = function(eleventyConfig) {
  console.log("shim test")
  eleventyConfig.addPlugin(shimPlugin, {
    finish: (eleventyInstance) => {
      console.log("--finish--")
    },

    serve: (eleventyInstance) => {
      console.log("--serve--")
    },

    verbose: true,
  })
}
