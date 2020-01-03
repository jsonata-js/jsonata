---
id: array-functions
title: Array Functions
---

## `$count()`
__Signature:__ `$count(array)`

Returns the number of items in the `array` parameter.  If the `array` parameter is not an array, but rather a value of another JSON type, then the parameter is treated as a singleton array containing that value, and this function returns `1`.

If `array` is not specified, then the context value is used as the value of `array`.

__Examples__
- `$count([1,2,3,1])` => `4`
- `$count("hello")` => 1

## `$append()`
__Signature:__ `$append(array1, array2)`

Returns an array containing the values in `array1` followed by the values in `array2`.  If either parameter is not an array, then it is treated as a singleton array containing that value.

__Examples__
- `$append([1,2,3], [4,5,6])` => `[1,2,3,4,5,6]`
- `$append([1,2,3], 4)` => `[1,2,3,4]`
- `$append("Hello", "World")` => `["Hello", "World"]`


## `$sort()`
__Signature:__ `$sort(array [, function])`

Returns an array containing all the values in the `array` parameter, but sorted into order.  If no `function` parameter is supplied, then the `array` parameter must contain only numbers or only strings, and they will be sorted in order of increasing number, or increasing unicode codepoint respectively.

If a comparator `function` is supplied, then is must be a function that takes two parameters:

`function(left, right)`

This function gets invoked by the sorting algorithm to compare two values `left` and `right`.  If the value of `left` should be placed after the value of `right` in the desired sort order, then the function must return Boolean `true` to indicate a swap.  Otherwise it must return `false`.

__Example__
```
$sort(Account.Order.Product, function($l, $r) {
  $l.Description.Weight > $r.Description.Weight
})
```

This sorts the products in order of increasing weight.

The sorting algorithm is *stable* which means that values within the original array which are the same according to the comparator function will remain in the original order in the sorted array.

## `$reverse()`
__Signature:__ `$reverse(array)`

Returns an array containing all the values from the `array` parameter, but in reverse order.

__Examples__
- `$reverse(["Hello", "World"])` => `["World", "Hello"]`
- `[1..5] ~> $reverse()` => `[5, 4, 3, 2, 1]`

## `$shuffle()`
__Signature:__ `$shuffle(array)`

Returns an array containing all the values from the `array` parameter, but shuffled into random order.

__Examples__
- `$shuffle([1..9])` => `[6, 8, 2, 3, 9, 5, 1, 4, 7]`

## `$distinct()`
__Signature__ `$distinct(array)`

Returns an array containing all the values from the `array` parameter, but with any duplicates removed.  Values are tested for deep equality as if by using the [equality operator](comparison-operators#equals).

__Examples__
- `$distinct([1,2,3,3,4,3,5])` => `[1, 2, 3, 4, 5]`
- `$distinct(Account.Order.Product.Description.Colour)` => `[ "Purple", "Orange", "Black" ]`

## `$zip()`
__Signature:__ `$zip(array1, ...)`

Returns a convolved (zipped) array containing grouped arrays of values from the `array1` ... `arrayN` arguments from index 0, 1, 2, etc.

This function accepts a variable number of arguments.  The length of the returned array is equal to the length of the shortest array in the arguments.

__Examples__
- `$zip([1,2,3], [4,5,6])` => `[[1,4] ,[2,5], [3,6]]`
- `$zip([1,2,3],[4,5],[7,8,9])` => `[[1,4,7], [2,5,8]]`
