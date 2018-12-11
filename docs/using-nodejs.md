---
id: using-nodejs
title: Using JSONata in a Node application
sidebar_label: In NodeJS
---

## Installing from NPM

`npm install jsonata`

## Example nodejs application

```
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

## ES5 runtimes

e.g. Nashorn, 

Use `jsonata-es5.js` or `jsonata-es5.min.js`

