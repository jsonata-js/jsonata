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

## Advanced features
To ensure the effective and user-friendly utilization of JSONata as a query language for the architectural repository data lake,
we found it necessary to enhance its basic functionality with several new features.

### Code Debugger
The debugger allows for step-by-step execution of query commands, enabling users to monitor the results of their execution.

```javascript
const expression = jsonata(`(
    $a := 1;
    $sum(example.value);
    $a := function() {(
        2;
        3;
        4;
    )};
    debugger; /* Calls a debug function */
    $a();
    $eval('(5;6;7)');
    8;
    9;
    10;
)`);
const result = await expression.evaluate(data, undefined, undefined, async(context) => {
    console.info(context);
    return 'next';  // The debug function must return one of the values: run / into / next
});
```

Result: 
```
{$: {…}, step: {…}, input: {…}, environment: {…}}
{$: 4, step: {…}, input: {…}, environment: {…}}
{$: 7, step: {…}, input: {…}, environment: {…}}
{$: 8, step: {…}, input: {…}, environment: {…}}
{$: 9, step: {…}, input: {…}, environment: {…}}
{$: 10, step: {…}, input: {…}, environment: {…}}
10
```

## More information
- JSONata [documentation](http://docs.jsonata.org/)
- [DocHub](https://github.com/DocHubTeam/DocHub)


