# WebpackJsdomTapePlugin

## install

```console
$ npm install --save-dev webpack-jsdom-tape-plugin
```

## import

```javascript
import WebpackJsdomTapePlugin from "webpack-jsdom-tape-plugin"
```

## api

### func WebpackJsdomTapePlugin({ string: url, string: entry, bool: exit = true, bool: errorsOnly = false})

creates a test runner for when the given `entry`, at the given `url`.

when the test is done, process exits with 0 if passed, and 1 if any errors occured.
`exit` option allow you to change this behavior of this plugin.
Note that using `exit: false` might introduce a memory leak since jsdom might
not clean everything properly.

`errorsOnly` option allow to only show tests on error allowing clean ouput.


## test example

```javascript
// tape is included as a global
tape("test name", (test) => {
  test.equal(1, 1, "ok")
  test.end()
})
```

## integration example

You will need a webpack entry that require all tests files and an html file that will include this entry

src/tests.js

```js
// where you might need to use webpack file-loader for the following html file
import "./tests.html"

// you may need to include your polyfill here
// eg: import "babel/polyfills"

var context = require.context(
  // place where your modules are
  "../web_modules",
  true,
  // you pattern to glob the test files
  /__tests__\/.*\.js$/
)

context.keys().forEach(context)
```

src/tests.html
```html
<!doctype html>
<meta charset="utf-8">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<title>Tests</title>
<h1>TAP</h1>
<pre id="test-Pre"></pre>
<script>
  var log = console.log
  var target = document.getElementById("test-Pre")
  window.console.log = function(message) {
    target.appendChild(document.createTextNode(message + "\n"))
    log.apply(console, arguments)
  }
</script>
<script src="./tests.js"></script>
```

es6 webpack.config.js
```js
import WebpackJsdomTapePlugin from "webpack-jsdom-tape-plugin"
//...
export default {
  // ...
  plugins: [
    WebpackJsdomTapePlugin({
      url: "http://localhost:8080/",
      entry: ["tests.js"],
      // NOTE HERE THAT YOU WILL NEED AN ENTRY THAT SHOULD BE "tests"
      // to be sure a "tests.js" is in the assets list
      exit: false,
      errorsOnly: false,
    })
  ]
}
```
