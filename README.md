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

### func WebpackJsdomTapePlugin({ string: url, string: entry})

creates a test runner for when the given entry, at the given URL.

when the test is done, process exits with 0 if passed, and 1 if any errors occured.

## example

```javascript
// tape is included as a global
tape("test name", (test) => {
  test.equal(1, 1, "ok")
  test.end()
})
```
