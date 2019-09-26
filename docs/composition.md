---
id: composition
title: Query composition
sidebar_label: Query Composition
---

In JSONata, everything is an _expression_. An expression comprises _values_, _functions_ and _operators_ which, when _evaluated_, produces a resulting value.  Functions and operators are applied to values which themselves can be the results of evaluating sub-expressions. In that way, the language is fully _composable_ to any level of complexity.


## Parenthesized expressions and blocks

Used to override the operator precedence rules.  E.g.

- `(5 + 3) * 4`

Used to compute complex expressions on a context value

- `Product.(Price * Quantity)` - both Price and Quantity are properties of the Product object

Used to support 'code blocks' - multiple expressions, separated by semicolons

- `(expr1; expr2; expr3)`

Each expression in the block is evaluated _in sequential order_; the result of the last expression is returned from the block.

