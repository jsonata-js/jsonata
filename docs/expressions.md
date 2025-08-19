---
id: expressions
title: Manipulating data with functions and expressions
sidebar_label: Functions and Expressions
---

## String expressions

Path expressions that point to a string value will return that value.

String literals can also be created by enclosing the
sequence of characters in quotes. Either double quotes `"` or single quotes `'` can be used, provided the same quote type is 
used for the start and end of the string literal.  Single quote characters may be included within a double quoted string and
_vice versa_ without escaping.  Characters within the string literal may be escaped using the same format
as [JSON strings](https://tools.ietf.org/html/rfc7159#section-7).

Strings can be combined using the concatenation operator `&`. This is an infix operator and will join the two strings
returned by the expressions either side of it.  This is the only operator that will attempt to typecast its operands to
the expected (string) type.

__Examples__

- Concatenate `FirstName` followed by space followed by `Surname`
  <div class="jsonata-ex">
    <div>FirstName & ' ' & Surname</div>
    <div>"Fred Smith"</div>
  </div>

- Concatenates the `Street` and `City` from the `Address` object with a comma separator. Note the use of [parentheses](composition.md#parenthesized-expressions-and-blocks)
  <div class="jsonata-ex">
    <div>Address.(Street & ', ' & City)</div>
    <div>"Hursley Park, Winchester"</div>
  </div>

- Casts the operands to strings, if necessary
  <div class="jsonata-ex">
    <div>5&0&true</div>
    <div>"50true"</div>
  </div>



## Numeric expressions

Path expressions that point to a number value will return that value.  

Numeric literals can also be created using the same syntax as [JSON numbers](https://tools.ietf.org/html/rfc7159#section-6).

Numbers can be combined using the usual mathematical operators to produce a resulting number.  Supported operators:
- `+` addition
- `-` subtraction
- `*` multiplication
- `/` division
- `%` remainder (modulo)

__Examples__

Consider the following JSON document:
```
{
  "Numbers": [1, 2.4, 3.5, 10, 20.9, 30]
}
```

| Expression | Output | Comments
| ---------- | ------ |----|
| `Numbers[0] + Numbers[1]` | 3.4 |Adding 2 prices|
| `Numbers[0] - Numbers[4]` | -19.9 | Subtraction |
| `Numbers[0] * Numbers[5]` | 30 |Multiplying price by quantity|
| `Numbers[0] / Numbers[4]` | 0.04784688995215 |Division|
| `Numbers[2] % Numbers[5]` | 3.5 |Modulo operator|


## Comparison expressions

Often used in predicates, for comparison of two values.  Returns Boolean `true` or `false`. Supported operators:

- `=` equals
- `!=` not equals
- `<` less than
- `<=` less than or equal
- `>` greater than
- `>=` greater than or equal
- `in` value is contained in an array


__Examples__

| Expression | Output | Comments
| ---------- | ------ |----|
| `Numbers[0] = Numbers[5]` | false |Equality |
| `Numbers[0] != Numbers[4]` | true | Inequality |
| `Numbers[1] < Numbers[5]` | true |Less than|
| `Numbers[1] <= Numbers[5]` | true |Less than or equal|
| `Numbers[2] > Numbers[4]` | false |Greater than|
| `Numbers[2] >= Numbers[4]` | false |Greater than or equal|
| `"01962 001234" in Phone.number` | true | Value is contained in|

## Boolean expressions

Used to combine Boolean results, often to support more sophisticated predicate expressions. Supported operators:

- `and`
- `or`

Note that `not` is supported as a function, not an operator.

__Examples__

| Expression | Output | Comments
| ---------- | ------ |----|
| `(Numbers[2] != 0) and (Numbers[5] != Numbers[1])` | true |`and` operator |
| `(Numbers[2] != 0) or (Numbers[5] = Numbers[1])` | true | `or` operator |

