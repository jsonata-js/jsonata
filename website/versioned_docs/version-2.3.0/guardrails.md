---
id: version-2.3.0-guardrails
title: Configuring Guardrails
sidebar_label: Configuring Guardrails
original_id: guardrails
---

## Guardrails

This page contains information relating to the JavaScript [reference implementation](https://github.com/jsonata-js/jsonata) of JSONata, and not the JSONata expression language itself.

JSONata is a Turing-complete expression language, and as such, it is possible to write unbounded, or infinite loops.  This can be a potential problem if an application using JSONata is exposing the ability for client users to input expressions that are evaluated on the server.  A user could accidently or maliciously provide an expression that, if evaluated unchecked, could cause a denial of service situation.

This JSONata library provides a set of configurable 'guardrails' that limit the compute and memory resources that a single expression can consume. If this library is being used in a hosted environment to allow end users to provide their own expressions, then it would be prudent to set constraints.  The following sections describe each of the guardrails and how to configure them.  It does not provide recommended values or defaults.

### Stack overflow

In common with other functional languages, JSONata supports looping by writing [recursive functions](https://en.wikipedia.org/wiki/Functional_programming#Recursion).  The JSONata evaluator processes an expression using a set of mutually recursive functions (eval-apply cycle).  When a function is invoked (by itself or by another function), the call stack in the host JavaScript runtime will grow. If this stack grows too deep, evaluator could exhaust the memory of the host process causing it to crash.

The JSONata evaluator can be configured with a maximum stack[^stack] limit to prevent an expression from doing this by specifying the `stack` option. Error `D1011` will be thrown if the expression grows the stack beyond the specified limit.

```javascript
const jsonata = require('jsonata');

const data = {JSON: data};
const options = {
    stack: 500
};

(async () => {
    const expression = jsonata('<JSONata expression>', options);
    const result = await expression.evaluate(data);
})()
```


As an example, the [Ackermann function](https://en.wikipedia.org/wiki/Ackermann_function) could be implemented in JSONata using:

```
(
  $ack := function($m, $n) {
    $m = 0 ? $n + 1 :
    $n = 0 ? $ack($m - 1, 1) :
    $ack($m - 1, $ack($m, $n - 1))
  };

  $ack(3, 4)
)
```

Invoked as `$ack(3, 4)` would quickly evaluate to `125`. However, `$ack(4, 3)`, although theoretically computable, will readily hit the configured stack guardrail before causing any problems to the host server.

[^stack]: The term 'stack' is a slight misnomer here; it actually limits the number of times round the eval-apply cycle, which is related to the JavaScript stack depth. 

### Excessive execution time

It's possible (and desirable) to write [tail recursive](programming#tail-call-optimization-tail-recursion) functions that don't grow the stack at all.  For these types of functions, a [stack guardrail](#stack-overflow) would not be sufficient to protect against unbounded loops.

The JSONata evaluator can be configured with a maximum time limit to protect against runaway expressions by specifying the `timeout` option.  Error `D1012` will be thrown if the expression runs for longer than the specified timeout (in milliseconds).

It's good practice to specify both `stack` and `timeout`.

```javascript
const jsonata = require('jsonata');

const data = {JSON: data};
const options = {
    stack: 500,
    timeout: 1000  // in milliseconds
};

(async () => {
    const expression = jsonata('<JSONata expression>', options);
    const result = await expression.evaluate(data);
})()
```

As an example, an infinite loop could be written in JSONata:

```
( 
    $inf := function() {
        $inf()
    }; 
    
    $inf()
)
```

This is tail recursive, and would run forever without the timeout guardrail.

### Excessive sequence length

It's possible to write expressions that result in excessively long result sequences.  This could ultimately lead to memory exhaustion in the host server. The `sequence` option can be set to specify the maximum sequence length that can be created by an expression, including any intermediate sequences created by sub-expressions.  Error `D2015` will be thrown if, during the evaluation of an expression, the evaluator attempts to generate a sequence exceeding this upper limit.


```javascript
const jsonata = require('jsonata');

const data = {JSON: data};
const options = {
    sequence: 1e6  // maximum of one million items in a sequence
};

(async () => {
    const expression = jsonata('<JSONata expression>', options);
    const result = await expression.evaluate(data);
})()
```

As an example, the following JSONata expression attempts to generate a sequence of 100 million numbers. The guardrail configured above would prevent this.

```
[1..10000].([1..10000])
```

### Rogue regular expressions

A number of functions use [regular expressions](regex) to process strings.  Alongside the power and flexibility that regexes provide, there are situations whereby badly crafted or malicious expressions could cause the processing engine take an [excessive amount of time](https://en.wikipedia.org/wiki/ReDoS) (exponential to the input string length).  Since the regex processing is not implemented in the core JSONata (eval-apply) evaluator, the `timeout` guardrail cannot protect against this.

It is possible to specify which regex processor is invoked by the JSONata evaluator. This is configured using the `RegexEngine` option. When this is not set, the evaluator will use the default JavaScript [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) class.

The [packaged version of JSONata](https://www.npmjs.com/package/jsonata) has no runtime dependencies on other packages, but it is possible to use the `RegexEngine` option to invoke a third-party ReDoS library whenever a regular expression is encountered in a JSONata expression.

The following code shows how this is done using the [redos-detector](https://github.com/tjenkinson/redos-detector) module:

```javascript
const jsonata = require('jsonata');
const redos = require('redos-detector');

// Simple wrapper that invokes redos-detector before delegating
// to built-in RegExp class
const SafeRegExp = function(regex) {
    if (!redos.isSafe(regex).safe) {
        throw {
            code: 'U1001',
            stack: (new Error()).stack,
            value: regex,
            message: 'Rejecting regex (potential ReDoS): ' + regex
        };
    }
    this.regex = regex;
    };

SafeRegExp.prototype.exec = function(str) {
    return this.regex.exec(str);
}

const data = {JSON: data};
const options = {
    RegexEngine: SafeRegExp
};

(async () => {
    const expression = jsonata('<JSONata expression>', options);
    const result = await expression.evaluate(data);
})()
```

Other similar libraries are available. This is not an endorsement of any particular one. The developer should choose one according to their requirements.

### Properties that JavaScript objects inherit

By default, a JSONata expression can only look up an object's own properties.  It can't look up the properties that the object inherits from its prototype, since they include the object's constructor, from which an expression could reach the `Function` constructor and run arbitrary code.

This means that the properties of some JavaScript objects can't be looked up.  For example, the `hostname` and `href` properties of a [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) object are getters that it inherits, as are the getters and methods of any class.

If the input to an expression includes such objects, the `inherited` option allows the expression to look up the properties they inherit too.  The inherited properties that give access to an object's prototype and constructor (`__proto__`, `constructor`, `prototype`, `__defineGetter__`, `__defineSetter__`, `__lookupGetter__` and `__lookupSetter__`) still can't be looked up, although an object's own properties with these names can.

```javascript
const options = {
    inherited: true
};

(async () => {
    const expression = jsonata('hostname', options);
    const result = await expression.evaluate(new URL('http://example.com/index.html'));  // "example.com"
})()
```

The option only applies to looking up a property by name, in a path such as `url.hostname` or with the `$lookup` function.  Functions such as `$keys`, `$each`, `$spread` and `$string`, and the wildcards `*` and `**`, still only see an object's own properties.

This option allows an expression to invoke any method that an object in its input inherits, and to run any getter, which might change the object or have other side effects.  These run as part of the host application, so an error that one throws is passed on as it is, rather than as a JSONata error, and the `timeout` guardrail can't stop one that runs for too long.  Only set the option if the objects passed to the expression are safe for the expression's author to use in this way.
