# JSONata
JSON query and transformation language

##Introduction
The primary purpose of this language is to extract values from JSON documents, with the
additional capabilities to combine these values using a set of basic functions
and operators, and also the ability to format the output into any arbitrary JSON structure.

##Install
- `npm install jsonata`

##Usage
In node.js:
```
var jsonata = require("jsonata");
var data = { "example": [ {"value": 4}, {"value": 7}, , {"value": 13}] };
var expression = "$sum(example.value)";
var result = jsonata(expression).evaluate(data);  // returns 24
```



##Tutorial
A tutorial on the JSONata language is available [here](tutorial.md)

##Errors

If an expression throws an error, e.g. syntax error or a runtime error (type error), then the object thrown
has a consistent structure containing the column number of the error, the token that caused the error,
and any other relevant information, including a meaningful message string.

For example:

`{ "position": 16, "token": "}", "value": "]", "message": "Syntax error: expected ']' got '}' at column 16" }`

##More Information
Tutorial [tutorial.md](tutorial.md)
Function library [functions.md](functions.md)

## Contributing
See the [CONTRIBUTING.md](CONTRIBUTING.md) for details of how to contribute to this repo.
