---
id: numeric-operators
title: Numeric Operators
sidebar_label: Numeric Operators
---

## `+` (Addition)

The addition operator adds the operands to produce the numerical sum.  It is an error if either operand is not a number.

__Example__

`5 + 2` => `7`


## `-` (Subtraction/Negation)

The subtraction operator subtracts the RHS value from the LHS value to produce the numerical difference  It is an error if either operand is not a number.

It can also be used in its unary form to negate a number

__Examples__

- `5 - 2` => `3`
- `- 42` => `-42`

## `*` (Multiplication)

The multiplication operator multiplies the operands to produce the numerical product.  It is an error if either operand is not a number.

__Example__

`5 * 2` => `10`

## `/` (Division)

The division operator divides the RHS into the LHS to produce the numerical quotient.  It is an error if either operand is not a number.

__Example__

`5 / 2` => `2.5`


## `%` (Modulo)

The modulo operator divides the RHS into the LHS using whole number division to produce a whole number quotient and a remainder.  This operator returns the remainder.  It is an error if either operand is not a number.

__Example__

`5 % 2` => `1`

## `..` (Range)

The sequence generation operator is used to create an array of monotonically increasing integer start with the number on the LHS and ending with the number on the RHS.  It is an error if either operand does not evaluate to an integer.  The sequence generator can only be used within an array constructor [].

__Examples__

- `[1..5]` => `[1, 2, 3, 4, 5]`
- `[1..3, 7..9]` => `[1, 2, 3, 7, 8, 9]`
- `[1..$count(Items)].("Item " & $)` => `["Item 1","Item 2","Item 3"]`
- `[1..5].($*$)` => `[1, 4, 9, 16, 25]`
