---
id: boolean-operators
title: Boolean Operators
sidebar_label: Boolean Operators
---

## `and` (Boolean AND)

The 'and' operator returns Boolean `true` if both operands evaluate to `true`.  If either or both operands is not a Boolean type, then they are first cast to a Boolean using the rules of the `$boolean` function.

__Example__

`library.books["Aho" in authors and price < 50].title`

## `or` (Boolean OR)

The 'or' operator returns Boolean `true` if either operand evaluates to `true`.  If either or both operands is not a Boolean type, then they are first cast to a Boolean using the rules of the `$boolean` function.

__Example__

`library.books[price < 10 or section="diy"].title`

__Please note that Boolean 'NOT' is a [function](boolean-functions#not), not an operator.__