---
id: comparison-operators
title: Comparison Operators
sidebar_label: Comparison Operators
---

## `=` (Equals)

The equality operator returns Boolean `true` if both operands are the same (type and value).  Arrays and objects are checked for deep equality.  Arrays must have the same values in the same order. Objects must have the same key/value pairs (order is not relevant).  Otherwise it returns `false`.

__Examples__

- `1+1 = 2` => `true`
- `"Hello" = "World"` => `false`

## `!=` (Not equals)

The inequality operator returns Boolean `false` if both operands are the same (type and value, deep equality).  Otherwise it returns `true`.

__Examples__

- `1+1 != 3` => `true`
- `"Hello" != "World"` => `true`

## `>` (Greater than)

The 'greater than' operator returns Boolean `true` if the LHS is numerically greater than the RHS.  Otherwise it returns `false`.

__Examples__

- `22 / 7 > 3` => `true`
- `5 > 5` => `false`

## `<` (Less than)

The 'less than' operator returns Boolean `true` if the LHS is numerically less than the RHS.  Otherwise it returns `false`.

__Examples__

- `22 / 7 < 3` => `false`
- `5 < 5` => `false`


## `>=` (Greater than or equals)

The 'greater than or equals' operator returns Boolean `true` if the LHS is numerically greater than or equal to the RHS.  Otherwise it returns `false`.

__Examples__

- `22 / 7 >= 3` => `true`
- `5 >= 5` => `true`


## `<=` (Less than or equals)

The 'less than or equals' operator returns Boolean `true` if the LHS is numerically less than or equal to the RHS.  Otherwise it returns `false`.

__Examples__

- `22 / 7 <= 3` => `false`
- `5 <= 5` => `true`

## `in` (Inclusion)

The array (sequence) inclusion operator returns Boolean `true` if the value of the LHS is included in the array of values on the RHS.  Otherwise it returns `false`.  If the RHS is a single value, then it is treated as a singleton array.

__Examples__

- `"world" in ["hello", "world"]` => `true`
- `"hello" in "hello"` => `true`
- `library.books["Aho" in authors].title`

