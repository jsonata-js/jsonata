# JSONata

[![Build Status](https://travis-ci.org/jsonata-js/jsonata.svg)](https://travis-ci.org/jsonata-js/jsonata)
[![Coverage Status](https://coveralls.io/repos/github/jsonata-js/jsonata/badge.svg?branch=master)](https://coveralls.io/github/jsonata-js/jsonata?branch=master)

JSON query and transformation language

##Introduction
JSONata is a lightweight query and transformation language for JSON data.
Inspired by the 'location path' semantics of XPath 3.1, it allows sophisticated
queries to be expressed in a compact and intuitive notation.  A rich complement of built in
operators and functions is provided for manipulating and combining extracted
data, and the results of queries can be formatted into any JSON output structure
using familiar JSON object and array syntax.
Coupled with the facility to create user defined functions, advanced expressions
can be built to tackle any JSON query and transformation task.

<p><iframe width="400" height="300" src="https://www.youtube.com/embed/ZBaK40rtIBM" frameborder="0" allowfullscreen></iframe><br />
<br /></p>

Try it out at [http://try.jsonata.org/](http://try.jsonata.org/)

##Install
- `npm install jsonata`

##Usage
In node.js:
```javascript
var jsonata = require("jsonata");
var data = { "example": [ {"value": 4}, {"value": 7}, {"value": 13}] };
var expression = "$sum(example.value)";
var result = jsonata(expression).evaluate(data);  // returns 24
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

`{ "position": 16, "token": "}", "value": "]", "message": "Syntax error: expected ']' got '}'" }`

##More Information
Tutorial [tutorial.md](tutorial.md)
Function library [functions.md](functions.md)
JSONata [Tech Talk](https://developer.ibm.com/open/videos/dw-open-tech-talk-jsonata/) 

## Contributing
See the [CONTRIBUTING.md](CONTRIBUTING.md) for details of how to contribute to this repo.
