---
id: control-operators
title: Navigation Operators
sidebar_label: Navigation Operators
---

Operators are a set of symbols that implement commonly used functions and are easier to read that an equivalent notation that just used function syntax.  Most operators act on two values, placed on the left-hand side (LHS) and right-hand side (RHS) of the operator.  Expressions containing operators can be ready chained, the order in which they are evaluated is determined by their relative precedence.

## `.` (Map)

The dot operator is one of the fundamental building blocks in JSONata expressions.  It implements the 'for each' or 'map' function that is common in many functional languages.

The dot operator performs the following logic:

- The expression on the LHS is evaluated to produce an array of values.
      - If it evaluates to a single value, that is treated as equivalent to an array containing that single value
      - If it evaluates to nothing (no match or empty array), then the result of the operator expression is nothing
- For each value in the LHS array in turn:
      - The value is known as the _context_ and is used as the basis for any relative path expression on the RHS.  It is also accessible in the RHS expression using the `$` symbol.
      - The RHS expression is evaluated to produce a value or array of values (or nothing).  These values are appended to a combined array of results for the operator as a whole.
- The combined result of the operator is returned.

This operator is left associative meaning that the expression `a.b.c.d` is evaluated like `((a.b).c).d`; i.e. left to right

__Examples__

`Address.City` => `"Winchester"`   
`Phone.number` => `[ "0203 544 1234", "01962 001234", "01962 001235", "077 7700 1234" ]`   
`Account.Order.Product.(Price * Quantity)` => `[ 68.9, 21.67, 137.8, 107.99 ]`   
`Account.Order.OrderID.$uppercase()` => `[ "ORDER103", "ORDER104"]`   

## `[...]` (Filter)

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

## `^(`...`)` (Order-by)

The order-by operator is used to sort an array of values into ascending or descending order according to one or more expressions defined within the parentheses.

By default, the array will be sorted into ascending order.  For example:

`Account.Order.Product^(Price)`   

sorts all of the products into order of increasing price (`Price` is a numeric field in the `Product` object).

To sort in descending order, the sort expression must be preceded by the `>` symbol. For example:   

`Account.Order.Product^(>Price)`   

sorts all of the products into order of decreasing price.  The `<` symbol can be used explicity indicate ascending order, although that is the default behaviour.

Secondary (and more) sort expressions can be specified by separating them with commas (`,`).  The secondary expression will be used to determine order if the primary expression ranks two values the same.  For example,   

`Account.Order.Product^(>Price, <Quantity)`   

orders the products primarily by decreasing price, but for products of the same price, by increasing quantity.

The sort expression(s) can be any valid JSONata expression that evaluates to a number or a string.  If it evaluates to a string then the array is sorted in order of unicode codepoint.

__Examples__

- `Account.Order.Product^(Price * Quantity)` => Increasing order of price times quantity.   
- `student[type='fulltime']^(DoB).name` => The names of all full time students sorted by date of birth (the DoB value is an ISO 8601 date format)

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
`| Account.Order.Product | {'Price': Price * 1.2} |` defines a transform that will return a deep copy the object passed to it, but with the `Product` object modified such that its `Price` property has had its value increased by 20%. The first part of the expression is the path location that specifies all of the objects within the overall object to change, and the second part defines an object that will get merged into the object(s) matched by the first part. The merging semantics is the same as that of the `$merge()` function.

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

`$five := 5`   
`$square := function($n) { $n * $n }`
