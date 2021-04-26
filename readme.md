<p align="center">
  <img
    alt="11tyshim"
    src="https://github.com/hendotcat/11tyshim/raw/trunk/11tyshim.svg"
    height="64"
  />
</p>

<p align="center">
  <strong>
    Eleventy monkeypatch plugin
  </strong>
</p>

<p align="center">
  <img
    src="https://github.com/hendotcat/11tyshim/actions/workflows/publish.yml/badge.svg"
    alt="Build status"
  />
</p>

Need to monkeypatch Eleventy to listen to lifecycle events for your plugin?
Need access to `eleventyInstance` so you can read config variables or reload
the dev server? Tired of copypasting around that same `monkeypatch()` function
everyone else is using? This is the plugin you're looking for!

## Installation

```
yarn add -D @hendotcat/11tyshim
```

## Usage

```javascript
const { shimPlugin } = require("@hendotcat/11tyshim")

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(shimPlugin, {
    finish: (eleventyInstance) => {
      console.log("11ty build complete!")
    },

    serve: (eleventyInstance) => {
      console.log("11ty dev server started!")
    },
  })
}
```

## Options

### `finish`

Pass a `finish` function to the plugin and it'll run just before an Eleventy
build finishes. This function only runs in one-off builds of Eleventy sites,
not in the dev server.

It receives the `eleventyInstance` as an argument.

```javascript
const { shimPlugin } = require("@hendotcat/11tyshim")

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(shimPlugin, {
    finish: (eleventyInstance) => {
      console.log("11ty build complete!")
      console.log(`site written to ${eleventyInstance.config.dir.output}`)
    },
  })
}
```

### `serve`

Pass a `serve` function to the plugin and it'll run just before an Eleventy dev
server starts up. This function only runs in the Eleventy server, never during
one-off builds. Most plugin authors who monkeypatch this method do so to set up
development tools which watch files, rebuild them when they change, and then
reload the Eleventy server.

It receives the `eleventyInstance` as an argument.

```javascript
const { shimPlugin } = require("@hendotcat/11tyshim")
const chokidar = require("chokidar")
const fs = require("fs")
const sass = require("sass")

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(shimPlugin, {
    serve: (eleventyInstance) => {
      console.log("11ty dev server started!")
      chokidar.watch("style.scss").on("all", (event, path) => {
        fs.writeFileSync(
          sass.renderSync({ file: "style.scss" }).css
        )
        eleventyInstance.eleventyServe.reload()
      })
    },
  })
}
```

### `verbose`

Pass `verbose: true` to the plugin and it'll output a whole bunch of
information about what it's doing. This is mostly useful for debugging. Please
enable this this option if you're reporting a bug in `11tyshim`.

## Contributing

<p>
  <a href="https://www.contributor-covenant.org/version/2/0/code_of_conduct/">
    Contributor Covenant v2.0
 </a>
</p>

## License

MIT

