---
id: higher-order-functions
title: Higher order functions
sidebar_label: Higher Order Functions
---

## `$map()`
__Signature:__ `$map(array, function)`

Returns an array containing the results of applying the `function` parameter to each value in the `array` parameter.

The function that is supplied as the second parameter must have the following signature:

`function(value [, index [, array]])`

Each value in the input array is passed in as the first parameter in the supplied function.  The index (position) of that value in the input array is passed in as the second parameter, if specified.  The whole input array is passed in as the third parameter, if specified.

__Examples__
- `$map([1..5], $string)` => `["1", "2", "3", "4", "5"]`

With user-defined (lambda) function:
```
$map(Email.address, function($v, $i, $a) {
   'Item ' & ($i+1) & ' of ' & $count($a) & ': ' & $v
})
```

evaluates to:

```
[
  "Item 1 of 4: fred.smith@my-work.com",
  "Item 2 of 4: fsmith@my-work.com",
  "Item 3 of 4: freddy@my-social.com",
  "Item 4 of 4: frederic.smith@very-serious.com"
]
```

## `$filter()`
__Signature:__ `$filter(array, function)`

Returns an array containing only the values in the `array` parameter that satisfy the `function` predicate (i.e. `function` returns Boolean `true` when passed the value).

The function that is supplied as the second parameter must have the following signature:

`function(value [, index [, array]])`

Each value in the input array is passed in as the first parameter in the supplied function.  The index (position) of that value in the input array is passed in as the second parameter, if specified.  The whole input array is passed in as the third parameter, if specified.

__Example__
The following expression returns all the products whose price is higher than average:
```
$filter(Account.Order.Product, function($v, $i, $a) {
  $v.Price > $average($a.Price)
})
```

## `$single()`
__Signature:__ `$single(array, function)`

Returns the one and only one value in the `array` parameter that satisfy the `function` predicate (i.e. `function` returns Boolean `true` when passed the value).  Throws an exception if the number of matching values is not exactly one.

The function that is supplied as the second parameter must have the following signature:

`function(value [, index [, array]])`

Each value in the input array is passed in as the first parameter in the supplied function.  The index (position) of that value in the input array is passed in as the second parameter, if specified.  The whole input array is passed in as the third parameter, if specified.

__Example__
The following expression the product in the order whose SKU is `"0406654608"`:
```
$single(Account.Order.Product, function($v, $i, $a) {
  $v.SKU = "0406654608"
})
```

## `$reduce()`
__Signature:__ `$reduce(array, function [, init])`

Returns an aggregated value derived from applying the `function` parameter successively to each value in `array` in combination with the result of the previous application of the function.

The `function` must accept at least two arguments, and behaves like an infix operator between each value within the `array`.  The signature of this supplied function must be of the form:

`myfunc($accumulator, $value[, $index[, $array]])`

__Example__

```
(
  $product := function($i, $j){$i * $j};
  $reduce([1..5], $product)
)
```

This multiplies all the values together in the array `[1..5]` to return `120`.

If the optional `init` parameter is supplied, then that value is used as the initial value in the aggregation (fold) process.  If not supplied, the initial value is the first value in the `array` parameter.

## `$sift()`
__Signature:__ `$sift(object, function)`

Returns an object that contains only the key/value pairs from the `object` parameter that satisfy the predicate `function` passed in as the second parameter.

If `object` is not specified, then the context value is used as the value of `object`.  It is an error if `object` is not an object.

The function that is supplied as the second parameter must have the following signature:

`function(value [, key [, object]])`

Each value in the input object is passed in as the first parameter in the supplied function.  The key (property name) of that value in the input object is passed in as the second parameter, if specified.  The whole input object is passed in as the third parameter, if specified.

__Example__

```
Account.Order.Product.$sift(function($v, $k) {$k ~> /^Product/})
```

This sifts each of the `Product` objects such that they only contain the fields whose keys start with the string "Product" (using a regex). This example returns:

```
[
  {
    "Product Name": "Bowler Hat",
    "ProductID": 858383
  },
  {
    "Product Name": "Trilby hat",
    "ProductID": 858236
  },
  {
    "Product Name": "Bowler Hat",
    "ProductID": 858383
  },
  {
    "ProductID": 345664,
    "Product Name": "Cloak"
  }
]
```
