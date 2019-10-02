---
id: other-operators
title: Other Operators
sidebar_label: Other Operators
---


## `&` (Concatenation)

The string concatenation operator is used to join the string values of the operands into a single resultant string.  If either or both of the operands are not strings, then they are first cast to string using the rules of the `$string` function.

__Example__

`"Hello" & "World"` => `"HelloWorld"`

## `? :` (Conditional)

The conditional ternary operator is used to evaluate one of two alternative expressions based on the result of a predicate (test) condition.  The operator takes the form:

`<test_expr> ? <expr_T> : <expr_F>`

The `<test_expr>` expression is first evaluated.  If it evaluates to Boolean `true`, then the operator returns the result of evaluating the `<expr_T>` expression.  Otherwise it returns the result of evaluating the `<expr_F>` expression. If `<test_expr>` evaluates to a non-Boolean value, then the value is first cast to Boolean using the rules of the `$boolean` function.

__Example__

`Price < 50 ? "Cheap" : "Expensive"`

## `:=` (Variable binding)

The variable binding operator is used to bind the value of the RHS to the variable name defined on the LHS.  The variable binding is scoped to the current block and any nested blocks.  It is an error if the LHS is not a `$` followed by a valid variable name.

__Examples__

- `$five := 5`
- `$square := function($n) { $n * $n }`

## `~>` (Chain)

The function chaining operator is used in the situations where multiple nested functions need to be applied to a value, while making it easy to read. The value on the LHS is evaluated, then passed into the function on the RHS as its first argument.  If the function has any other arguments, then these are passed to the function in parenthesis as usual.  It is an error if the RHS is not a function, or an expression that evaluates to a function.

__Examples__

`$uppercase($substringBefore($substringAfter(Customer.Email, "@"), "."))`

and

`$sum(Account.Order.Product.(Price * Quantity))`

can be more clearly written:

`Customer.Email ~> $substringAfter("@") ~> $substringBefore(".") ~> $uppercase()`

and

`Account.Order.Product.(Price * Quantity) ~> $sum()`

This operator can also be used in a more abstract form to define new functions based on a combination of existing functions.  In this form, there is no value passed in on the LHS of the first function in the chain.

For example, the expression

```
(
  $uppertrim := $trim ~> $uppercase;
  $uppertrim("   Hello    World   ")
)
```

=> `"HELLO WORLD"`

creates a new function `$uppertrim` that performs `$trim` followed by `$uppercase`.


## `... ~> | ... | ... |` (Transform)

The object transform operator is used to modify a copy of an object structure using a pattern/action syntax to target specific modifications while keeping the rest of the structure unchanged.

The syntax has the following structure:

`head ~> | location | update [, delete] |`

where

- `head` evaluates to the object that is to be copied and transformed
- `location` evaluates to the part(s) within the copied object that are to be updated. The `location` expression is evaluated relative to the result of `head`. The result of evaluating `location` must be an object or array of objects.
- `update` evaluates to an object that is merged into the object matched by each `location`. `update` is evaluated relative to the result of `location` and if `location` matched multiple objects, then the update gets evaluated for each one of these. The result of (each) update is merged into the result of `location`.
- `delete` (optional) evaluates to a string or an array of strings. Each string is the name of the name/value pair in each object matched by `location` that is to be removed from the resultant object.

The `~>` operator is the operator for function chaining and passes the value on the left hand side to the function on the right hand side as its first argument. The expression on the right hand side must evaluate to a function, hence the `|...|...|` syntax generates a function with one argument.

Example:

`| Account.Order.Product | {'Price': Price * 1.2} |`

defines a transform that will return a deep copy the object passed to it, but with the `Product` object modified such that its `Price` property has had its value increased by 20%. The first part of the expression is the path location that specifies all of the objects within the overall object to change, and the second part defines an object that will get merged into the object(s) matched by the first part. The merging semantics is the same as that of the `$merge()` function.

This transform definition syntax creates a JSONata function which you can either assign to a variable and use multiple times, or invoke inline.
Example:

`payload ~> |Account.Order.Product|{'Price': Price * 1.2}|`

or:

`$increasePrice := |Account.Order.Product|{'Price': Price * 1.2}|`

This also has the benefit that multiple transforms can be chained together for more complex transformations.

In common with `$merge()`, multiple changes (inserts or updates) can be made to an object.
Example:

`|Account.Order.Product|{'Price': Price * 1.2, 'Total': Price * Quantity}|`

Note that the Total will be calculated using the original price, not the modified one (JSONata is declarative not imperative).

Properties can also be removed from objects.  This is done using the optional `delete` clause which specifies the name(s) of the properties to delete.
Example:

`$ ~> |Account.Order.Product|{'Total': Price * Quantity}, ['Price', 'Quantity']|`

This copies the input, but for each `Product` it inserts a Total and removes the `Price` and `Quantity` properties.

