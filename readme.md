# 11tyshim

Eleventy monkeypatch plugin

> [!NOTE]
> In version 1.0.0 of Eleventy, an event listener API was added to eleventyConfig.
> You're better off using that API rather than this plugin.
>
> https://www.11ty.dev/docs/events/

Need to monkeypatch Eleventy to listen to lifecycle events for your plugin?
Need access to `eleventyInstance` so you can read config variables or reload
the dev server? Tired of copypasting around that same `monkeypatch()` function
everyone else is using? This is the plugin you're looking for!

## Installation

```
yarn add -D @henrycatalinismith/11tyshim
```

## Usage

```javascript
const { shimPlugin } = require("@henrycatalinismith/11tyshim")

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

### `write`

Pass a `write` function to the plugin and it'll run at the start of an Eleventy
build. This function runs for both one-off Eleventy builds and the `--serve` dev
server.

It receives the `eleventyInstance` as an argument.

```javascript
const { shimPlugin } = require("@henrycatalinismith/11tyshim")

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(shimPlugin, {
    write: (eleventyInstance) => {
      console.log("11ty build starting!")
    },
  })
}
```

### `finish`

Pass a `finish` function to the plugin and it'll run just before an Eleventy
build finishes. This function only runs in one-off builds of Eleventy sites,
not in the dev server.

It receives the `eleventyInstance` as an argument.

```javascript
const { shimPlugin } = require("@henrycatalinismith/11tyshim")

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
const { shimPlugin } = require("@henrycatalinismith/11tyshim")
const chokidar = require("chokidar")
const fs = require("fs")
const sass = require("sass")

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(shimPlugin, {
    serve: (eleventyInstance) => {
      console.log("11ty dev server started!")
      chokidar.watch("style.scss").on("all", (event, path) => {
        const { css } = sass.renderSync({ file: "style.scss" })
        fs.writeFileSync(
          `${eleventyInstance.outputDir}/style.css`,
          css
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

* [Tips][Contributing]
* [Code of Conduct]

## License

[MIT]

[Contributing]: https://codeberg.org/henrycatalinismith/11tyshim/src/branch/main/contributing.md
[Code of Conduct]: https://codeberg.org/henrycatalinismith/11tyshim/src/branch/main/code_of_conduct.md
[MIT]: https://codeberg.org/henrycatalinismith/11tyshim/src/branch/main/license
