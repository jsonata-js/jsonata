# jsonata

[![NPM statistics](https://nodei.co/npm/jsonata.png?downloads=true&downloadRank=true)](https://nodei.co/npm/jsonata/)

[![Build Status](https://travis-ci.org/jsonata-js/jsonata.svg)](https://travis-ci.org/jsonata-js/jsonata)
[![Coverage Status](https://coveralls.io/repos/github/jsonata-js/jsonata/badge.svg?branch=master)](https://coveralls.io/github/jsonata-js/jsonata?branch=master)

JavaScript implementation of the [JSONata query and transformation language](http://jsonata.org/).

* [JSONata tutorial](tutorial.md)
* [JSONata language documentation](http://docs.jsonata.org/)
* [Try it out!](http://try.jsonata.org/)

## Installation

- `npm install jsonata`

## Usage

In Node.js:

```javascript
var jsonata = require("jsonata");

var data = {
  example: [
    {value: 4},
    {value: 7},
    {value: 13}
  ]
};
var expression = jsonata("$sum(example.value)");
var result = expression.evaluate(data);  // returns 24
```

In a browser:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>JSONata test</title>
    <script src="lib/jsonata.js"></script>
    <script>
      function greeting() {
        var json = JSON.parse(document.getElementById('json').value);
        var result = jsonata('"Hello, " & name').evaluate(json);
        document.getElementById('greeting').innerHTML = result;
      }
    </script>
  </head>
  <body>
    <textarea id="json">{ "name": "Wilbur" }</textarea>
    <button onclick="greeting()">Click me</button>
    <p id="greeting"></p>
  </body>
</html>
```

`jsonata` uses ES2015 features such as [generators](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/function*). For browsers lacking these features, try `lib/jsonata-es5.js`.

## API

### jsonata(str)

Parse a string `str` as a JSONata expression and return a compiled JSONata expression object.

```javascript
var expression = jsonata("$sum(example.value)");
```

If the expression is not valid JSONata, an `Error` is thrown containing information about the nature of the syntax error, for example:

```
{
  code: "S0202",
  stack: "...",
  position: 16,
  token: "}",
  value: "]",
  message: "Syntax error: expected ']' got '}'"
}
```

`expression` has three methods:

#### expression.evaluate(input[, bindings[, callback]])

Run the compiled JSONata expression against object `input` and return the result as a new object.

```javascript
var result = expression.evaluate({example: [{value: 4}, {value: 7}, {value: 13}]});
```

`input` should be a JavaScript value such as would be returned from `JSON.parse()`. If `input` could not have been parsed from a JSON string (is circular, contains functions, ...), `evaluate`'s behaviour is not defined. `result` is a new JavaScript value suitable for `JSON.stringify()`ing.

`bindings` allows variables to be registered, e.g.:

```javascript
jsonata("$a + $b").evaluate({}, {a: 4, b: 78});
// returns 82
```

`expression.evaluate()` may throw a run-time `Error`:

```javascript
var expression = jsonata("$notafunction()"); // OK, valid JSONata
expression.evaluate({}); // Throws
```

The `Error` contains information about the nature of the run-time error, for example:

```
{
  code: "T1006",
  stack: "...",
  position: 14,
  token: "notafunction",
  message: "Attempted to invoke a non-function"
}
```

If `callback(err, value)` is supplied, `expression.evaluate()` returns `undefined`, the expression is run asynchronously and the `Error` or result is passed to `callback`.

```javascript
jsonata("7 + 12").evaluate({}, {}, function(error, result) {
  console.log("Finished with", result);
});
console.log("Started");

// Prints "Started", then "Finished with 19"
```

#### expression.assign(name, value)

#### expression.registerFunction(name, implementation, signature)

### jsonata.parser(str)

Parse a string `str` as a JSONata expression and return the abstract syntax tree (AST).

## More information
- JSONata [language documentation](http://docs.jsonata.org/)
- JSONata [tech talk](https://developer.ibm.com/open/videos/dw-open-tech-talk-jsonata/) 

## Contributing

See the [CONTRIBUTING.md](CONTRIBUTING.md) for details of how to contribute to this repo.
