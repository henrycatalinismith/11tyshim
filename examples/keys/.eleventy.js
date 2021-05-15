const { shimPlugin } = require("../../")

module.exports = function(eleventyConfig) {
  let keys = []

  eleventyConfig.addCollection(
    "keys",
    () => keys,
  )

  eleventyConfig.addPlugin(shimPlugin, {
    write: (eleventyInstance) => {
      keys = Object.keys(eleventyInstance)
    },
    verbose: true,
  })
}
