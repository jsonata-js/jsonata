# JSONata
JSON query and transformation language

### Introduction
The primary purpose of this language is to extract values from JSON documents, with the
additional capabilities to combine these values using a set of basic functions
and operators, and also the ability to format the output into any arbitrary JSON structure.

### Basic Selection
To support the extraction of values from a JSON structure, a location path syntax is defined.
In common with XPath, this will select all possible values in the document that match the
specified location path.  The two structural constructs of JSON are objects and arrays.

#### Navigating JSON Objects
A JSON object is an associative array (a.k.a map or hash).
The location path syntax to navigate into an arbitrarily deeply nested structure of
JSON objects comprises the field names separated by dot '.' delimiters.
The expression returns the JSON value referenced after navigating to the last step in the
location path.  If during the navigation of the location path, a field is not found, then
the expression returns nothing (represented by Javascript _undefined_).  No errors are thrown
as a result of non-existing data in the input document.

The following sample JSON document is used by examples throughout this guide, unless otherwise indicated:
```
{
  "FirstName": "Fred",
  "Surname": "Smith",
  "Age": 28,
  "Address": {
    "Street": "Hursley Park",
    "City": "Winchester",
    "Postcode": "SO21 2JN"
  },
  "Phone": [
    {
      "type": "home",
      "number": "0203 544 1234"
    },
    {
      "type": "office",
      "number": "01962 001234"
    },
    {
      "type": "office",
      "number": "01962 001235"
    },
    {
      "type": "mobile",
      "number": "077 7700 1234"
    }
  ],
  "Email": [
    {
      "type": "work",
      "address": ["fred.smith@my-work.com", "fsmith@my-work.com"]
    },
    {
      "type": "home",
      "address": ["freddy@my-social.com", "frederic.smith@very-serious.com"]
    }
  ],
  "Other": {
    "Over 18 ?": true,
    "Misc": null,
    "Alternative.Address": {
      "Street": "Brick Lane",
      "City": "London",
      "Postcode": "E1 6RF"
    }
  }
}
```

The following expressions yield the following results when applied to this JSON document:

| Expression | Output | Comments|
| ---------- | ------ |----|
| `Surname` | `"Smith"` | Returns a JSON string ("double quoted")|
|`Age` |`28`| Returns a JSON number
|`Address.City`|`"Winchester"`| Field references separated by '.'
|`Other.Misc`|`null`|Matched the path and returns the null value
|`Other.Nothing`| |Path not found.  Returns Javascript _undefined_
|`Other.'Over 18 ?'`|`true`|Field references containing whitespace or reserved tokens <br>can be enclosed in quotes (single or double)



#### Navigating JSON Arrays
JSON arrays are used when an ordered collection of values is required.  
Each value in the array is associated with an index (position) rather than a name, so in order to address
individual values in an array, extra syntax is required to specify the index.
This is done using square brackets after the field name of the array.  If the square brackets contains
a number, or an expression that evaluates to a number, then the number represents the index of the value
to select.  Indexes are zero offset, i.e. the first value in an array `arr` is `arr[0]`.  If the number is not an
integer, then it is rounded _down_ to an integer.  If the expression in square brackets is non-numeric, or is an expression
that doesn't evaluate to a number, then it is treated as a [predicate](#predicates).

Negative indexes count from the end of the array, for example, `arr[-1]` will select the last value, `arr[-2]` the second to last, etc.
If an index is specified that exceeds the size of the array, then nothing is selected.

If no index is specified for an array (i.e. no square brackets after the field reference), then the whole array is selected.
If the array contains objects, and the location path selects fields within these objects, then each object within the
array will be queried for selection.

 Expression | Output | Comments|
| ---------- | ------ |----|
| `Phone[0]` | `{ "type": "home", "number": "0203 544 1234" }` | Returns the first item (an object)
| `Phone[1]` | `{ "type": "office", "number": "01962 001234" }` | Returns the second item
| `Phone[-1]` | `{ "type": "mobile", "number": "077 7700 1234" }` | Returns the last item
| `Phone[-2]` | `{ "type": "office", "number": "01962 001235" }` | Negative indexed count from the end
| `Phone[8]` |  | Doesn't exist - returns nothing
| `Phone[0].number`| `"0203 544 1234"`| Selects the `number` field in the first item
| `Phone.number`| `[ "0203 544 1234", "01962 001234", "01962 001235", "077 7700 1234" ]`| No index is given to `Phone` so it selects all of <br>them (the whole array), then it selects all the `number` fields for each of them
| `Phone.number[0]`| `[ "0203 544 1234", "01962 001234", "01962 001235", "077 7700 1234" ]`| Might expect it to just return the first number, <br>but it returns the first number of each of the items selected by `Phone`
| `(Phone.number)[0]`| `"0203 544 1234"`| Applies the index to the array returned by `Phone.number`. One use of [parentheses](#parenthesized-expressions-and-blocks).

##### Top level arrays, nested arrays and array flattening
Consider the JSON document:
```
[
  { "ref": [ 1,2 ] },
  { "ref": [ 3,4 ] }
]
```
At the top level, we have an array rather than an object.  If we want to select the first object in this top level array,
we don't have a field name to append the `[0]` to.  We can't use `[0]` on its own because that clashes with the
[array constructor](#array-constructors) syntax.  However, we can use the _context_ reference `$` to refer to the start of
the document as follows:

 Expression | Output | Comments|
| ---------- | ------ |----|
| `$[0]` | `{ "ref": [ 1,2 ] }` | `$` at the start of an expression refers to the entire input document
| `$[0].ref` | `[ 1,2 ]` | `.ref` here returns the entire internal array
| `$[0].ref[0]` | `1` | returns element on first position of the internal array
| `$.ref` | `[ 1, 2, 3, 4 ]` | Despite the structure of the nested array, the resultant selection<br>is flattened into a single flat array.  The original nested structure<br>of the input arrays is lost. See [Array constructors](#array-constructors) for how to<br>maintain the original structure in the results.

### Complex selection

#### Wildcards
Use of `*` instead of field name to select all fields in an object

 Expression | Output | Comments|
| ---------- | ------ |----|
| `Address.*` | `[ "Hursley Park", "Winchester", "SO21 2JN" ]` | Select the values of all the fields of `Address`
| `*.Postcode` | `"SO21 2JN"` | Select the `Postcode` value of any child object

#### Navigate arbitrary depths
Descendant wildcard `**` instead of `*` will traverse all descendants (multi-level wildcard).

 Expression | Output | Comments|
| ---------- | ------ |----|
| `**.Postcode` | `[ "SO21 2JN", "E1 6RF" ]` | Select all `Postcode` values, regardless of how deeply nested they are in the structure

#### Predicates
At any step in a location path, the selected items can be filtered using a predicate - [expr]
where expr evaluates to a Boolean value.  Each item in the selection is tested against
the expression, if it evaluates to true, then the item is kept; if false, it is removed
from the selection. The expression is evaluated relative to the current (context) item being tested,
so if the predicate expression performs navigation, then it is relative to this context item.

Examples:

Expression | Output | Comments|
| ---------- | ------ |----|
| `Phone[type='mobile']` | `{ "type": "mobile",  "number": "077 7700 1234" }` | Select the `Phone` items that have a `type` field that equals `"mobile"`.
| `Phone[type='mobile'].number` | `"077 7700 1234"` | Select the mobile phone number
| `Phone[type='office'].number` | `[ "01962 001234",  "01962 001235" ]` | Select the office phone numbers - there are two of them!

#### Singleton array and value equivalence
Within a JSONata expression or subexpression, any value (which is not itself an array) and an array
containing just that value are deemed to be equivalent.  This allows the language to be composable
such that location paths that extract a single value from and object and location paths
that extract multiple values from arrays can both be used as inputs to other expressions
without needing to use different syntax for the two forms.

Consider the following examples:

* `Address.City` returns the single value `"Winchester"`
* `Phone[0].number` matches a single value, and returns that value `"0203 544 1234"`
* `Phone[type='home'].number` likewise matches the single value `"0203 544 1234"`
* `Phone[type='office'].number` matches two values, so returns an array `[ "01962 001234",  "01962 001235" ]`

When processing the return value of a JSONata expression, it might be desirable to have the results in a consistent
format regardless of how many values were matched.  In the first two expressions above, it is clear that each expression
is addressing a single value in the structure and it makes sense to return just that value. 
In the last two expressions, however, it is not immediately obvious how many values will be matched, and it is
not helpful if the host language has to process the results in different ways depending on what gets returned.

If this is a concern, then the expression can be modified to make it return an array even if only a single value is matched.
This is done by adding empty square brackets `[]` to a step within the location path.  The examples above can be re-written
to always return an array as follows:

* `Address[].City` returns `[ "Winchester"] `
* `Phone[0][].number` returns `[ "0203 544 1234" ]`
* `Phone[][type='home'].number` returns `[ "0203 544 1234" ]`
* `Phone[type='office'].number[]` returns `[ "01962 001234",  "01962 001235" ]`

Note that the `[]` can be placed either side of the predicates and on any step in the path expression

### Combining values

#### String expressions
Path expressions that point to a string value will return that value.
Strings can be combined using the concatenation operator '&'

Examples

Expression | Output | Comments|
| ---------- | ------ |----|
| <code>FirstName & ' ' & Surname</code> | `"Fred Smith"` | Concatenate `FirstName` followed by space <br>followed by `Surname`
| <code>Address.(Street & ', ' & City)</code> | `"Hursley Park, Winchester"` | Another nice use of [parentheses](#parenthesized-expressions-and-blocks)

Consider the following JSON document:
``` 
{
  "Numbers": [1, 2.4, 3.5, 10, 20.9, 30]
}
```


#### Numeric expressions
Path expressions that point to a number value will return that value.
Numbers can be combined using the usual mathematical operators to produce
a resulting number.  Supported operators:
- `+` addition
- `-` subtraction
- `*` multiplication
- `/` division
- `%` remainder (modulo)

_Examples_

Expression | Output | Comments
| ---------- | ------ |----|
| `Numbers[0] + Numbers[1]` | 3.4 |Adding 2 prices|
| `Numbers[0] - Numbers[4]` | -19.9 | Subtraction |
| `Numbers[0] * Numbers[5]` | 30 |Multiplying price by quantity|
| `Numbers[0] / Numbers[4]` | 0.04784688995215 |Division|
| `Numbers[2] % Numbers[5]` | 3.5 |Modulo operator|


#### Comparison expressions
Often used in predicates, for comparison of two values.  Returns Boolean true or false
Supported operators:
- `=` equals
- `!=` not equals
- `<` less than
- `<=` less than or equal
- `>` greater than
- `>=` greater than or equal
- `in` value is contained in an array


_Examples_

Expression | Output | Comments
| ---------- | ------ |----|
| `Numbers[0] = Numbers[5]` | false |Equality |
| `Numbers[0] != Numbers[4]` | true | Inequality |
| `Numbers[1] < Numbers[5]` | true |Less than|
| `Numbers[1] <= Numbers[5]` | true |Less than or equal|
| `Numbers[2] > Numbers[4]` | false |Greater than|
| `Numbers[2] >= Numbers[4]` | false |Greater than or equal|
| `"01962 001234" in Phone.number` | true | Value is contained in|

#### Boolean expressions
Used to combine Boolean results, often to support more sophisticated predicate expressions.
Supported operators:
- `and`
- `or`

Note that `not` is supported as a function, not an operator.

_Examples_

Expression | Output | Comments
| ---------- | ------ |----|
| `(Numbers[2] != 0) and (Numbers[5] != Numbers[1])` | true |`and` operator |
| `(Numbers[2] != 0) or (Numbers[5] = Numbers[1])` | true | `or` operator |


### Specifying result structures

So far, we have discovered how to extract values from a JSON document, and how to manipulate the data using numeric, string and other operators.
It is useful to be able to specify how this processed data is presented in the output.

#### Array constructors
As previously observed, when a location path matches multiple values in the input document, these values are returned
as an array.  The values might be objects or arrays, and as such will have their own structure,
but the _matched values_ themselves are at the top level in the resultant array.

It is possible to build extra structure into the resultant array by specifying the construction of arrays (or [objects](#object-constructors))
within the location path expression.  At any point in a location path where a field reference is expected, a pair of
square brackets `[]` can be inserted to specify that the results of the expression within those brackets should be contained within a new array
in the output.  Commas are used to separate multiple expressions within the array constructor.

Array constructors can also be used within location paths for making multiple selections without the broad brush use of wildcards.

Examples:

Expression | Output | Comments|
| ---------- | ------ |----|
| `Email.address` | `[ "fred.smith@my-work.com",`<br>`"fsmith@my-work.com",`<br>`"freddy@my-social.com",`<br>`"frederic.smith@very-serious.com" ]` | The four emails addresses are returned in a flat array
| `Email.[address]` | `[ [ "fred.smith@my-work.com",  "fsmith@my-work.com" ],`<br>`[ "freddy@my-social.com", "frederic.smith@very-serious.com" ] ]` | Each email object generates an array of addresses
| `[Address, Other.'Alternative.Address'].City` | `[ "Winchester", "London" ]` | Selects the `City` value of both <br>`Address` and `Alternative.Address` objects


#### Object constructors
In a similar manner to the way arrays can be constructed, JSON objects can also be constructed in the output.
At any point in a location path where a field reference is expected, a pair of braces `{}` containing key/value
pairs separated by commas, with each key and value separated by a colon: `{key1: value2, key2:value2}`.  The
keys and values can either be literals or can be expressions. The key must either be a string or an expression that
evaluates to a string.

When an object constructor follows an expression that selects multiple values, the object constructor will create
a single object that contains a key/value pair for each of those context values.  If an array of objects is required
(one for each context value), then the object constructor should immediately follow the dot '.' operator.

Examples:

Expression | Output | Comments|
| ---------- | ------ |----|
| `Phone{type: number}` | `{ "home": "0203 544 1234", "office": "01962 001235", "mobile": "077 7700 1234" }` | One of the `office` numbers was lost because it had a duplicate key
| `Phone.{type: number}` | `[ { "home": "0203 544 1234" }, { "office": "01962 001234" }, { "office": "01962 001235" }, { "mobile": "077 7700 1234"  } ]` | Produces an array of objects

#### JSON literals
The array and object constructors use the standard JSON syntax for JSON arrays and JSON objects.  In addition to this
values of the other JSON data types can be entered into an expression using their native JSON syntax:
- strings - `"hello world"`
- numbers - `34.5`
- Booleans - `true` or `false`
- nulls - `null`
- objects - `{"key1": "value1", "key2": "value2"}`
- arrays - `["value1", "value2"]`

This means that any valid JSON document is also a valid expression.  This property allows you to use a JSON document
as a template for the desired output, and then replace parts of it with expressions to insert data into the output
from the input document.

### Programming Constructs
So far, we have introduced all the parts of the language that allow us to extract data from an input JSON document,
combine the data using string and numeric operators, and format the structure of the output JSON document.  What
follows are the parts that turn this into a Turing complete, functional programming language.

#### Conditional expressions
If/then/else constructs can be written using the ternary operator "? :".
`predicate ? expr1 : expr2`

The expression `predicate` is evaluated.  If its effective boolean value (see definition) is `true`
then `expr1` is evaluated and returned, otherwise `expr2` is evaluated and returned.

#### Parenthesized expressions and blocks
Used to override the operator precedence rules.  E.g.
- `(5 + 3) * 4`

Used to compute complex expressions on a context value
- `Product.(Price * Quantity)` - both Price and Quantity are fields of the Product value

Used to support 'code blocks' - multiple expressions, separated by semicolons

`(expr1; expr2; expr3)`

Each expression in the block is evaluated _in sequential order_; the result of the last expression
is returned from the block.

#### Variables
Any name that starts with a dollar '$' is a variable.  A variable is a named reference to a value.
The value can be one of any type in the language's type system (link).

##### Built-in variables

- `$` The variable with no name refers to the context value at any point in the input JSON hierarchy. Examples
- `$$` The root of the input JSON.  Only needed if you need to break out of the
current context to temporarily navigate down a different path.  E.g. for cross-referencing or joining data. Examples
- Native (built-in) functions.  See function library.

##### Variable assignment
Values (of any type in the type system) can be assigned to variables

`$var_name := "value"`

The stored value can be later referenced using the expression `$var_name`.

The scope of a variable is limited to the 'block' in which it was assigned.  E.g.

```
Invoice.(
  $p := Product.Price;
  $q := Product.Quantity;
  $p * $q
)
```
Returns Price multiplied by Quantity for the Product in the Invoice.

#### Functions
The function is a first-class type, and can be stored in a variable just like any other
data type.  A library of built-in functions is provided (link) and assigned to variables
in the global scope.  For example, `$uppercase` contains a function which, when invoked
with a string argument, `str`, will
return a string with all the characters in `str` changed to uppercase.

##### Invoking a function
A function is invoked by following its reference (or definition) by parentheses containing
a comma delimited sequence of arguments. Examples:

- `$uppercase("Hello")` returns the string "HELLO".
- `$substring("hello world", 0, 5)` returns the string "hello"
- `$sum([1,2,3])` returns the number 6

##### Defining a function
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

##### Recursive functions
Functions that have been assigned to variables can invoke themselves using
that variable reference.  This allows recursive functions to be defined.  Eg.

```
(
  $factorial:= function($x){ $x <= 1 ? 1 : $x * $factorial($x-1) };
  $factorial(4)
)
```
Note that it is actually possible to write a recursive function using purely anonymous functions
(i.e. nothing gets assigned to variables).  This is done using the
[Y-combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator#Fixed_point_combinators_in_lambda_calculus)
which might be an interesting [diversion](#advanced-stuff) for those interested in functional programming.


##### Higher order functions
A function, being a first-class data type, can be passed as a parameter to
another function, or returned from a function.  Functions that process other functions
are known as higher order functions.  Consider the following example:

```
(
  $twice := function($f) { function($x){ $f($f($x)) } };
  $add3 := function($y){ $y + 3 };
  $add6 := $twice($add3);
  $add6(7)
)
```
- The function stored in variable `$twice` is a higher order function.  It takes a
parameter `$f` which is a function, and returns a function which takes a parameter
`$x` which, when invoked, applies the function `$f` twice to `$x`.
- `$add3` stores a function that adds 3 to its argument.  Neither `$twice` or `$add3` have
been invoked yet.
- `$twice` is invoked by passing the function `add3` as its argument.  This returns a
function that applies `$add3` twice to _its_ argument.  This returned function is not
invoked yet, but rather assigned to the variable `add6`.
- Finally the function in `$add6` is invoked with the argument 7, resulting in 3 being added to it twice.
It returns 13.

##### Functions are closures
When a lambda function is defined, the evaluation engine takes a snapshot of the environment and stores it with the
function body definition.  The environment comprises the context item (i.e. the current value in the location path)
together with the current in-scope variable bindings.  When the lambda function is later invoked, it is done so in that
stored environment rather than the current environment at invocation time.  This property is known as _lexical scoping_
and is a fundamental property of _closures_.

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
When the function is created, the context item (referred to by '$') is the value of `Account`.  Later, when the function
is invoked, the context item has moved down the structure to the value of each `Product` item.  However, the function
body is invoked in the environment that was stored when it was defined, so its context item is the value of `Account`.
This is a somewhat contrived example, you wouldn't really need a function to do this.
The expression produces the following result:
```
{
  "Account": "Firefly",
  "SKU-858383": "Bowler Hat",
  "SKU-345664": "Cloak"
}
```

##### Advanced stuff
There is no need to read this section - it will do nothing for your sanity or ability to manipulate JSON data.

Earlier we learned how to write a recursive function to calculate the factorial of a number and hinted that this
could be done without naming any functions.  We can take higher-order functions to the extreme and write the following:

`λ($f) { λ($x) { $x($x) }( λ($g) { $f( (λ($a) {$g($g)($a)}))})}(λ($f) { λ($n) { $n < 2 ? 1 : $n * $f($n - 1) } })(6)`

which produces the result `720`.  The Greek lambda (λ) symbol can be used in place of the word `function` which, if you
can find it on your keyboard, will save screen space and please the fans of lambda calculus.

The first part of this above expression is an implementation of the
[Y-combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator#Fixed_point_combinators_in_lambda_calculus)
in this language.  We could assign it to a variable and apply it to other recursive anonymous functions:

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

