---
id: embedding-extending
title: Embedding and Extending JSONata
sidebar_label: Embedding and Extending JSONata
---

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

### expression.evaluate(input[, bindings[, callback]])

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

If `continuationCallback()` is supplied, `expression.evaluate()` returns `undefined`, the expression is run asynchronously calling continuationCallback after every step which should resolve to true else it will cancel the execution and the `Error` in `callback` will reflect as operation cancelled.

```javascript
let stepCounter = 0;
async function continueExecution() {
    stepCounter++;
    return stepCounter<1000; //PREVENT INFINITE LOOPS
}
function completion(err, results) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Completed in ${stepCounter} steps with result:${results}`);
}
const getBit = jsonata(`($x:= λ($c,$n,$b){ $c=$b?$n%2:$x($c+1,$floor($n/2),$b)};$x(0,number,bitIndex))`);

getBit.evaluate({ "number": 10000000, "bitIndex": 0 }, undefined, completion, continueExecution); //NORMAL
// Prints Completed in 17 steps with result:0

getBit.evaluate({ "number": 10000000, "bitIndex": -1 }, undefined, completion, continueExecution); //INFINITE LOOP
// Prints { code: 'U2020', message: 'Operation cancelled.' }
```

### expression.assign(name, value)

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

### expression.registerFunction(name, implementation[, signature])

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

### Function signature syntax

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

### Writing higher-order function extensions

It is possible to write and extension function that takes one or more functions in its list of arguments and/or returns
 a function as its return value.


