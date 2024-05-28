---
id: programming
title: Programming constructs
sidebar_label: Functional Programming
---

So far, we have introduced all the parts of the language that allow us to extract data from an input JSON document, combine the data using string and numeric operators, and format the structure of the output JSON document.  What follows are the parts that turn this into a Turing complete, functional programming language.

## Comments

JSONata expressions can be interleaved with comments using 'C' style comment delimeters.  For example,

```
/* Long-winded expressions might need some explanation */
(
  $pi := 3.1415926535897932384626;
  /* JSONata is not known for its graphics support! */
  $plot := function($x) {(
    $floor := $string ~> $substringBefore(?, '.') ~> $number;
    $index := $floor(($x + 1) * 20 + 0.5);
    $join([0..$index].('.')) & 'O' & $join([$index..40].('.'))
  )};

  /* Factorial is the product of the integers 1..n */
  $product := function($a, $b) { $a * $b };
  $factorial := function($n) { $n = 0 ? 1 : $reduce([1..$n], $product) };

  $sin := function($x){ /* define sine in terms of cosine */
    $cos($x - $pi/2)
  };
  $cos := function($x){ /* Derive cosine by expanding Maclaurin series */
    $x > $pi ? $cos($x - 2 * $pi) : $x < -$pi ? $cos($x + 2 * $pi) :
      $sum([0..12].($power(-1, $) * $power($x, 2*$) / $factorial(2*$)))
  };

  [0..24].$sin($*$pi/12).$plot($)
)
```
Produces [this](http://try.jsonata.org/ryYn78Q0m), if you're interested!

## Conditional logic

If/then/else constructs can be written using the ternary operator "? :".

`predicate ? expr1 : expr2`

The expression `predicate` is evaluated.  If its effective boolean value (see definition) is `true` then `expr1` is evaluated and returned, otherwise `expr2` is evaluated and returned.

__Examples__

<div class="jsonata-ex">
  <div>Account.Order.Product.{
    `Product Name`: $.Price > 100 ? "Premium" : "Basic"
}</div>
  <div>[
  {
    "Bowler Hat": "Basic"
  },
  {
    "Trilby hat": "Basic"
  },
  {
    "Bowler Hat": "Basic"
  },
  {
    "Cloak": "Premium"
  }
]</div>
</div>

## Variables

Any name that starts with a dollar '$' is a variable.  A variable is a named reference to a value.  The value can be one of any type in the language's [type system](processing#the-jsonata-type-system).

### Built-in variables

- `$` The variable with no name refers to the context value at any point in the input JSON hierarchy. Examples
- `$$` The root of the input JSON.  Only needed if you need to break out of the current context to temporarily navigate down a different path.  E.g. for cross-referencing or joining data. Examples
- Native (built-in) functions.  See function library.

### Variable binding

Values (of any type in the type system) can be bound to variables

`$var_name := "value"`

The stored value can be later referenced using the expression `$var_name`.

The scope of a variable is limited to the 'block' in which it was bound.  E.g.

```
Invoice.(
  $p := Product.Price;
  $q := Product.Quantity;
  $p * $q
)
```

Returns Price multiplied by Quantity for the Product in the Invoice.

## Functions

The function is a first-class type, and can be stored in a variable just like any other data type.  A library of built-in functions is provided (link) and assigned to variables in the global scope.  For example, `$uppercase` contains a function which, when invoked with a string argument, `str`, will return a string with all the characters in `str` changed to uppercase.

### Invoking a function

A function is invoked by following its reference (or definition) by parentheses containing a comma delimited sequence of arguments.

__Examples__

- `$uppercase("Hello")` returns the string "HELLO".
- `$substring("hello world", 0, 5)` returns the string "hello"
- `$sum([1,2,3])` returns the number 6

### Defining a function

Anonymous (lambda) functions can be defined using the following syntax:

`function($l, $w, $h){ $l * $w * $h }`

and can be invoked using

`function($l, $w, $h){ $l * $w * $h }(10, 10, 5)` which returns 500

The function can also be assigned to a variable for future use (within the block)

```
(
  $volume := function($l, $w, $h){ $l * $w * $h };
  $volume(10, 10, 5);
)
```

### Function signatures

Functions can be defined with an optional signature which specifies the parameter types of the function.  If supplied,
the evaluation engine will validate the arguments passed to the function before it is invoked.  A dynamic error is
thown if the argument list does not match the signature.

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


### Recursive functions

Functions that have been assigned to variables can invoke themselves using that variable reference.  This allows recursive functions to be defined.  Eg.

<div class="jsonata-ex">
  <div>(
  $factorial:= function($x){ $x <= 1 ? 1 : $x * $factorial($x-1) };
  $factorial(4)
)</div>
  <div>24</div>
</div>

Note that it is actually possible to write a recursive function using purely anonymous functions (i.e. nothing gets assigned to variables).  This is done using the [Y-combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator#Fixed_point_combinators_in_lambda_calculus) which might be an interesting [diversion](#advanced-example-the-y-combinator) for those interested in functional programming.

### Tail call optimization (Tail recursion)

A recursive function adds a new frame to the call stack each time it invokes itself.  This can eventually lead to stack exhaustion if the function recurses beyond a certain limit.  Consider the classic recursive implementation of the factorial function

```
(
  $factorial := function($x) {
    $x <= 1 ? 1 : $x * $factorial($x-1)
  };
  $factorial(170)
)
```

This function works by pushing the number onto the stack, then when the stack unwinds, multiplying it by the result of the factorial of the number minus one.  Written in this way, the JSONata evaluator has no choice but to use the call stack to store the intermediate results.  Given a large enough number, the call stack will overflow.

This is a recognised problem with functional programming and the solution is to rewrite the function slightly to avoid the _need_ for the stack to store the itermediate result.  The following implementation of factorial achieves this

```
(
  $factorial := function($x){(
    $iter := function($x, $acc) {
      $x <= 1 ? $acc : $iter($x - 1, $x * $acc)
    };
    $iter($x, 1)
  )};
  $factorial(170)
)
```

Here, the multiplication is done _before_ the function invokes itself and the intermediate result is carried in the second parameter `$acc` (accumulator).  The invocation of itself is the _last_ thing that the function does.  This is known as a 'tail call', and when the JSONata parser spots this, it internally rewrites the recursion as a simple loop.  Thus it can run indefinitely without growing the call stack.  Functions written in this way are said to be [tail recursive](https://en.wikipedia.org/wiki/Tail_call).

### Higher order functions

A function, being a first-class data type, can be passed as a parameter to another function, or returned from a function.  Functions that process other functions are known as higher order functions.  Consider the following example:

```
(
  $twice := function($f) { function($x){ $f($f($x)) } };
  $add3 := function($y){ $y + 3 };
  $add6 := $twice($add3);
  $add6(7)
)
```
- The function stored in variable `$twice` is a higher order function.  It takes a parameter `$f` which is a function, and returns a function which takes a parameter `$x` which, when invoked, applies the function `$f` twice to `$x`.
- `$add3` stores a function that adds 3 to its argument.  Neither `$twice` or `$add3` have been invoked yet.
- `$twice` is invoked by passing the function `add3` as its argument.  This returns a function that applies `$add3` twice to _its_ argument.  This returned function is not invoked yet, but rather assigned to the variable `add6`.
- Finally the function in `$add6` is invoked with the argument 7, resulting in 3 being added to it twice.  It returns 13.

### Functions are closures

When a lambda function is defined, the evaluation engine takes a snapshot of the environment and stores it with the function body definition.  The environment comprises the context item (i.e. the current value in the location path) together with the current in-scope variable bindings.  When the lambda function is later invoked, it is done so in that stored environment rather than the current environment at invocation time.  This property is known as _lexical scoping_ and is a fundamental property of _closures_.

Consider the following example:

```
Account.(
  $AccName := function() { $.'Account Name' };

  Order[OrderID = 'order104'].Product.{
    'Account': $AccName(),
    'SKU-' & $string(ProductID): $.'Product Name'
  }
)
```

When the function is created, the context item (referred to by '$') is the value of `Account`.  Later, when the function is invoked, the context item has moved down the structure to the value of each `Product` item.  However, the function body is invoked in the environment that was stored when it was defined, so its context item is the value of `Account`.  This is a somewhat contrived example, you wouldn't really need a function to do this.  The expression produces the following result:

```
{
  "Account": "Firefly",
  "SKU-858383": "Bowler Hat",
  "SKU-345664": "Cloak"
}
```

### Partial function application

Functions can [partially applied](https://en.wikipedia.org/wiki/Partial_application) by invoking the function with one or more (but not all)
arguments replaced by a question mark `?` placeholder.  The result of this is another function whose arity (number of parameters) is reduced
by the number of arguments supplied to the original function.  This returned function can be treated like any other newly defined function,
e.g. bound to a variable, passed to a higher-order function, etc.

__Examples__

- Create a function to return the first five characters of a string by partially applying the `$substring` function
  <div class="jsonata-ex">
    <div>(
  $first5 := $substring(?, 0, 5);
  $first5("Hello, World")
)</div>
    <div>"Hello"</div>
  </div>

- Partially applied function can be further partially applied
  <div class="jsonata-ex">
    <div>(
  $firstN := $substring(?, 0, ?);
  $first5 := $firstN(?, 5);
  $first5("Hello, World")
)</div>
    <div>"Hello"</div>
  </div>


### Function chaining

Function chaining can be used in two ways:

1. To avoid lots of nesting when multiple functions are applied to a value

2. As a higher-order construct for defining new functions by combining existing functions

#### Invocation chaining

`value ~> $funcA ~> $funcB`\
is equivalent to\
`$funcB($funcA(value))`

__Examples__

- `Customer.Email ~> $substringAfter("@") ~> $substringBefore(".") ~> $uppercase()`

#### Function composition

[Function composition](https://en.wikipedia.org/wiki/Function_composition) is the application of one function to another function
to produce a third function.

`$funcC := $funcA ~> $funcB`\
is equivalent to\
`$funcC := function($arg) { $funcB($funcA($arg)) }`

__Examples__

- Create a new function by chaining two existing functions
  <div class="jsonata-ex">
    <div>(
   $normalize := $uppercase ~> $trim;
   $normalize("   Some   Words   ")
)</div>
    <div>"SOME WORDS"</div>
  </div>

### Functions as first class values

Function composition can be combined with partial function application to produce a very compact syntax for defining new
functions.

__Examples__

- Create a new function by chaining two partially evaluated functions
  <div class="jsonata-ex">
    <div>(
  $first5Capitalized := $substring(?, 0, 5) ~> $uppercase(?);
  $first5Capitalized(Address.City)
)</div>
    <div>"WINCH"</div>
  </div>


### Advanced example - The Y-combinator

There is no need to read this section - it will do nothing for your sanity or ability to manipulate JSON data.

Earlier we learned how to write a recursive function to calculate the factorial of a number and hinted that this could be done without naming any functions.  We can take higher-order functions to the extreme and write the following:

`λ($f) { λ($x) { $x($x) }( λ($g) { $f( (λ($a) {$g($g)($a)}))})}(λ($f) { λ($n) { $n < 2 ? 1 : $n * $f($n - 1) } })(6)`

which produces the result `720`.  The Greek lambda (λ) symbol can be used in place of the word `function` which, if you can find it on your keyboard, will save screen space and please the fans of [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus).

The first part of this above expression is an implementation of the [Y-combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator#Fixed_point_combinators_in_lambda_calculus) in this language.  We could assign it to a variable and apply it to other recursive anonymous functions:

```
(
  $Y := λ($f) { λ($x) { $x($x) }( λ($g) { $f( (λ($a) {$g($g)($a)}))})};
  [1,2,3,4,5,6,7,8,9] . $Y(λ($f) { λ($n) { $n <= 1 ? $n : $f($n-1) + $f($n-2) } }) ($)
)
```

to produce the Fibonacci series `[ 1, 1, 2, 3, 5, 8, 13, 21, 34 ]`.

But we don't need to do any of this.  Far more sensible to use named functions:

```
(
  $fib := λ($n) { $n <= 1 ? $n : $fib($n-1) + $fib($n-2) };
  [1,2,3,4,5,6,7,8,9] . $fib($)
)
```
