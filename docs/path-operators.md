---
id: path-operators
title: Path Operators
sidebar_label: Path Operators
---

The path operators underpin the declarative nature of the map/filter/reduce processing model in JSONata.

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

- `Address.City` => `"Winchester"`
- `Phone.number` => `[ "0203 544 1234", "01962 001234", "01962 001235", "077 7700 1234" ]`
- `Account.Order.Product.(Price * Quantity)` => `[ 68.9, 21.67, 137.8, 107.99 ]`
- `Account.Order.OrderID.$uppercase()` => `[ "ORDER103", "ORDER104"]`

## `[` ... `]` (Filter)

The filter operator (a.k.a predicate) is used to select only the items in the input sequence that satisfy the predicate expression contained between the square brackets.

If the predicate expression is an integer, or an expression that evaluates to an integer, then the item at that position (zero offset) in the input sequence is the only item selected for the result sequence.
If the number is non-integer, then it is rounded _down_ to the nearest integer.

If the predicate expression is an array of integers, or an expression that evaluates to an array of integers, then the items at those positions (zero offset) in the input sequence is the only item selected for the result sequence.

If the predicate expression evaluates to any other value, then it is cast to a Boolean as if using the `$boolean()` function.  If this evaluates to `true`, then the item is retained in the result sequence.  Otherwise it is rejected.

See [Navigating JSON Arrays](simple#navigating-json-arrays) and [Predicates](predicate) for more details and examples.

## `^(` ... `)` (Order-by)

The order-by operator is used to sort an array of values into ascending or descending order according to one or more expressions defined within the parentheses.

By default, the array will be sorted into ascending order.  For example:

`Account.Order.Product^(Price)`

sorts all of the products into order of increasing price (`Price` is a numeric field in the `Product` object).

To sort in descending order, the sort expression must be preceded by the `>` symbol. For example:

`Account.Order.Product^(>Price)`

sorts all of the products into order of decreasing price.  The `<` symbol can be used to explicitly indicate ascending order, although that is the default behaviour.

Secondary (and more) sort expressions can be specified by separating them with commas (`,`).  The secondary expression will be used to determine order if the primary expression ranks two values the same.  For example,

`Account.Order.Product^(>Price, <Quantity)`

orders the products primarily by decreasing price, but for products of the same price, by increasing quantity.

The sort expression(s) can be any valid JSONata expression that evaluates to a number or a string.  If it evaluates to a string then the array is sorted in order of unicode codepoint.

__Examples__

- `Account.Order.Product^(Price * Quantity)` => Increasing order of price times quantity.
- `student[type='fulltime']^(DoB).name` => The names of all full time students sorted by date of birth (the DoB value is an ISO 8601 date format)

## `{` ... `}` (Reduce)

The reduce operator can be used as the last step in a path expression to group and aggregate its input sequence into a single object.
The key/value pairs between the curly braces determine the groupings (by evaluating the key expression) and the aggregated values for each group.
See [Grouping and Aggregation](sorting-grouping#grouping) for more details.


## `*` (Wildcard)

This wildcard selects the values of all the properties of the context object.  It can be used in a path expression in place of a property name, but it cannot be combined with other characters like a glob pattern.  The order of these values in the result sequence is implementation dependent.
See [Wildcards](predicate#wildcards) for examples.

## `**` (Descendants)

This wildcard recursively selects the values of all the properties of the context object, and the properties of any objects contained within these values as it descends the hierarchy.
See [Navigate arbitrary depths](predicate#navigate-arbitrary-depths).

## `%` (Parent)

This will select the 'parent' of the current context value.  Here, we define 'parent' to be the enclosing object which has the property representing the context value.

This is the only operation which searches 'backwards' in the input data structure. It is implemented by static analysis of the expression at [compile time](https://docs.jsonata.org/embedding-extending#jsonatastr) and can only be used within expressions that navigate through that target parent value in the first place.
If, for any reason, the parent location cannot be determined, then a static error (S0217) is thrown.

__Example__

```
Account.Order.Product.{
  'Product': `Product Name`,
  'Order': %.OrderID,
  'Account': %.%.`Account Name`
}
```
This returns an array of objects for each product in each order in each account.  Information from the enclosing Order and Account objects can be accessed using the parent operator.
The repeated combination of `%.%.` is used to access the grandparent and higher ancestors.


## `#` (Positional variable binding)

This can be used to determine at which position in the sequence the current context item is.  It can be used following any map, filter or order-by stage in the path.
The variable is available for use within subsequent stages of the path (e.g. within filter predicates) and goes out of scope at the end of the path expression.

__Example__

```
library.books#$i['Kernighan' in authors].{
  'title': title,
  'index': $i
}
```
This returns an array of objects for each book in the library where Kernighan is one of the authors.  Each object contains the book's title and its position within the books array before it was filtered.


## `@` (Context variable binding)

This is used to bind the current context item (`$`) to a named variable.  It can only be used directly following a map stage, not a filter or order-by stage.
The variable binding remains in scope for the remainder of the path expression.

Because the current context has now been explicitly bound to a named variable, this context will be carried forward to be the context of the next stage in the path.
For example, in this snippet of a path, `library.loans@$l.books`, the loans array is a property of the library object and each loan will, in turn, be bound to the variable `$l`.
The books array, which is also a property of the library object, will then be selected.

This operator can be used to perform data joins within a path because of its ability to do cross-referencing across objects.

__Example__

```
library.loans@$l.books@$b[$l.isbn=$b.isbn].{
  'title': $b.title,
  'customer': $l.customer
}
```
This performs an 'inner join' between objects in the loans array and objects in the books array where the ISBNs match between the structures.

Block expressions can be used to widen the scope of the data cross-referencing as shown in this example:

```
(library.loans)@$l.(catalog.books)@$b[$l.isbn=$b.isbn].{
  'title': $b.title,
  'customer': $l.customer
}
```
