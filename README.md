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

`jsonata` uses ES2015 features such as [generators](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/function*). For browsers lacking these features, `lib/jsonata-es5.js` is provided.

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

`bindings`, if present, contains variable names and values (including functions) to be bound:

```javascript
jsonata("$a + $b()").evaluate({}, {a: 4, b: () => 78});
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
jsonata("7 + 12").evaluate({}, {}, (error, result) => {
  if(error) {
    console.error(error);
    return;
  }
  console.log("Finished with", result);
});
console.log("Started");

// Prints "Started", then "Finished with 19"
```

#### expression.assign(name, value)

Permanently binds a value to a name in the expression, similar to how `bindings` worked above. Modifies `expression` in place and returns `undefined`. Useful in a JSONata expression factory.

```javascript
var expression = jsonata("$a + $b()");
expression.assign("a", 4);
expression.assign("b", () => 1);

expression.evaluate({}); // 5
```

Note that the `bindings` argument in the `expression.evaluate()` call clobbers these values:

```javascript
expression.evaluate({}, {a: 109}); // 110
```

#### expression.registerFunction(name, implementation[, signature])

Permanently binds a function to a name in the expression.

```javascript
var expression = jsonata("$greet()");
expression.registerFunction("greet", () => "Hello world");

expression.evaluate({}); // "Hello world"
```

You can do this using `expression.assign` or `bindings` in `expression.evaluate`, but `expression.registerFunction` allows you to specify a function `signature`. This is a terse string which tells JSONata the expected input argument types and return value type of the function. JSONata raises a run-time error if the actual input argument types do not match (the return value type is not checked yet).

```javascript
var expression = jsonata("$add(61, 10005)");
expression.registerFunction("add", (a, b) => a + b, "<nn:n>");

expression.evaluate({}); // 10066
```

Function signatures are specified like so:

##### Function signature syntax

A function signature is a string of the form `<params:return>`. `params` is a sequence of type symbols, each one representing an input argument's type. `return` is a single type symbol representing the return value type.

Type symbols work as follows:

Simple types:

- `b` - Boolean
- `n` - number
- `s` - string
- `l` - `null`

Complex types:

- `a` - array
- `o` - object
- `f` - function

Union types:

- `(sao)` - string, array or object
- `(o)` - same as `o`
- `u` - equivalent to `(bnsl)` i.e. Boolean, number, string or `null`
- `j` - any JSON type. Equivalent to `(bnsloa)` i.e. Boolean, number, string, `null`, object or array, but not function
- `x` - any type. Equivalent to `(bnsloaf)`

Parametrised types:

- `a<s>` - array of strings
- `a<x>` - array of values of any type

Some examples of signatures of built-in JSONata functions:

- `$count` has signature `<a:n>`; it accepts an array and returns a number.
- `$append` has signature `<aa:a>`; it accepts two arrays and returns an array.
- `$sum` has signature `<a<n>:n>`; it accepts an array of numbers and returns a number.
- `$reduce` has signature `<fa<j>:j>`; it accepts a reducer function `f` and an `a<j>` (array of JSON objects) and returns a JSON object.

Each type symbol may also have *options* applied.

- `+` - one or more arguments of this type
  - E.g. `$zip` has signature `<a+>`; it accepts one array, or two arrays, or three arrays, or...
- `?` - optional argument
  - E.g. `$join` has signature `<a<s>s?:s>`; it accepts an array of strings and an optional joiner string which defaults to the empty string. It returns a string.
- `-` - if this argument is missing, use the context value ("focus").
  - E.g. `$length` has signature `<s-:n>`; it can be called as `$length(OrderID)` (one argument) but equivalently as `OrderID.$length()`.

## More information
- JSONata [language documentation](http://docs.jsonata.org/)
- JSONata [tech talk](https://developer.ibm.com/open/videos/dw-open-tech-talk-jsonata/) 

## Contributing

See the [CONTRIBUTING.md](CONTRIBUTING.md) for details of how to contribute to this repo.
