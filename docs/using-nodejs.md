---
id: using-nodejs
title: Using JSONata in a Node application
sidebar_label: In NodeJS
---

## Installing from NPM

`npm install jsonata`

## Example nodejs application

```
const jsonata = require('jsonata');

const data = {
    example: [
        {value: 4},
        {value: 7},
        {value: 13}
    ]
};

(async () => {
    const expression = jsonata('$sum(example.value)');
    const result = await expression.evaluate(data);  // returns 24
})()
```

## ES5 runtimes

e.g. Nashorn, 

Use `jsonata-es5.js` or `jsonata-es5.min.js`

