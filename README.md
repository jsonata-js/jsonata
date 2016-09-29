# JSONata

[![Build Status](https://travis-ci.org/jsonata-js/jsonata.svg)](https://travis-ci.org/jsonata-js/jsonata)
[![Coverage Status](https://coveralls.io/repos/github/jsonata-js/jsonata/badge.svg?branch=master)](https://coveralls.io/github/jsonata-js/jsonata?branch=master)
[![Dependency Status](https://david-dm.org/jsonata-js/jsonata.svg)](https://david-dm.org/jsonata-js/jsonata)
[![Dev Dependency Status](https://david-dm.org/jsonata-js/jsonata/dev-status.svg)](https://david-dm.org/jsonata-js/jsonata?type=dev)

JSON query and transformation language

##Introduction
The primary purpose of this language is to extract values from JSON documents, with the
additional capabilities to combine these values using a set of basic functions
and operators, and also the ability to format the output into any arbitrary JSON structure.

##Install
- `npm install jsonata`

##Usage
In node.js (works in v4.4 and later):
```
var jsonata = require("jsonata");
var data = { "example": [ {"value": 4}, {"value": 7}, {"value": 13}] };
var expression = "$sum(example.value)";
var result = jsonata(expression).evaluate(data);  // returns 24
```

In a browser (works in latest Chrome, Firefox, Safari):
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JSONata test</title>
    <script src="lib/jsonata.js"></script>
</head>
<body>
<button onclick="alert(jsonata('[1..10]').evaluate())">Click me</button>
</body>
</html>
```

##Tutorial
A tutorial on the JSONata language is available [here](tutorial.md)

##Developers
If you want to run the latest code from git, here's how to get started:

2. Clone the code:

        git clone https://github.com/jsonata-js/jsonata.git
        cd jsonata

3. Install the development dependencies (there are no runtime dependencies):

        npm install

4. Run the tests

        npm t


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
