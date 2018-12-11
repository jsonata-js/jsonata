---
id: aggregation-functions
title: Numeric aggregation functions
sidebar_label: Aggregation Functions
---

## `$sum()`
__Signature:__ `$sum(array)`

Returns the arithmetic sum of an array of numbers.  It is an error if the input array contains an item which isn't a number.

__Example__

- `$sum([5,1,3,7,4])` => `20`

## `$max()`
__Signature:__ `$max(array)`

Returns the maximum number in an array of numbers.  It is an error if the input array contains an item which isn't a number.

__Example__

- `$max([5,1,3,7,4])` => `7`

## `$min()`
__Signature:__ `$min(array)`

Returns the minimum number in an array of numbers.  It is an error if the input array contains an item which isn't a number.

__Example__

- `$min([5,1,3,7,4])` => `1`

## `$average()`
__Signature:__ `$average(array)`

Returns the mean value of an array of numbers.  It is an error if the input array contains an item which isn't a number.

__Example__

- `$average([5,1,3,7,4])` => `4`


