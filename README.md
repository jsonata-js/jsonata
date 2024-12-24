# DocHub-JSONata

The repository is a fork of the original [JSONata](https://github.com/jsonata-js/jsonata) for adaptation in DocHub.

## Installation

- `npm install dochub-jsonata`

## Quick start

In Node.js:

```javascript
const jsonata = require('dochub-jsonata');

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

## More information
- JSONata [documentation](http://docs.jsonata.org/)
- [DocHub](https://github.com/DocHubTeam/DocHub)


