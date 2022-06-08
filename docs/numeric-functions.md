---
id: numeric-functions
title: Numeric functions
sidebar_label: Numeric Functions
---

## `$number()`
__Signature:__ `$number(arg)`

Casts the `arg` parameter to a number using the following casting rules
   - Numbers are unchanged
   - Strings that contain a sequence of characters that represent a legal JSON number are converted to that number
   - Hexadecimal numbers start with `0x`, Octal numbers with `0o`, binary numbers with `0b`
   - Boolean `true` casts to `1`, Boolean `false` casts to `0`
   - All other values cause an error to be thrown.

If `arg` is not specified (i.e. this function is invoked with no arguments), then the context value is used as the value of `arg`. 

__Examples__  
- `$number("5")` => `5`  
- `$number("0x12")` => `0x18`  
- `["1", "2", "3", "4", "5"].$number()` => `[1, 2, 3, 4, 5]`


## `$abs()`
__Signature:__ `$abs(number)`

Returns the absolute value of the `number` parameter, i.e. if the number is negative, it returns the positive value.

If `number` is not specified (i.e. this function is invoked with no arguments), then the context value is used as the value of `number`. 

__Examples__  
- `$abs(5)` => `5`  
- `$abs(-5)` => `5`

## `$floor()`
__Signature:__ `$floor(number)`

Returns the value of `number` rounded down to the nearest integer that is smaller or equal to `number`. 

If `number` is not specified (i.e. this function is invoked with no arguments), then the context value is used as the value of `number`. 

__Examples__  
- `$floor(5)` => `5`  
- `$floor(5.3)` => `5`  
- `$floor(5.8)` => `5`  
- `$floor(-5.3)` => `-6`  


## `$ceil()`
__Signature:__ `$ceil(number)`

Returns the value of `number` rounded up to the nearest integer that is greater than or equal to `number`. 

If `number` is not specified (i.e. this function is invoked with no arguments), then the context value is used as the value of `number`. 

__Examples__  
- `$ceil(5)` => `5`  
- `$ceil(5.3)` => `6`  
- `$ceil(5.8)` => `6`  
- `$ceil(-5.3)` => `-5`  


## `$round()`
__Signature:__ `$round(number [, precision])`

Returns the value of the `number` parameter rounded to the number of decimal places specified by the optional `precision` parameter.  

The `precision` parameter (which must be an integer) species the number of decimal places to be present in the rounded number.   If `precision` is not specified then it defaults to the value `0` and the number is rounded to the nearest integer.  If `precision` is negative, then its value specifies which column to round to on the left side of the decimal place

This function uses the [Round half to even](https://en.wikipedia.org/wiki/Rounding#Round_half_to_even) strategy to decide which way to round numbers that fall exactly between two candidates at the specified precision.  This strategy is commonly used in financial calculations and is the default rounding mode in IEEE 754.

__Examples__  
- `$round(123.456)` => `123`  
- `$round(123.456, 2)` => `123.46`  
- `$round(123.456, -1)` => `120`  
- `$round(123.456, -2)` => `100`  
- `$round(11.5)` => `12`  
- `$round(12.5)` => `12`  
- `$round(125, -1)` => `120`

## `$power()`
__Signature:__ `$power(base, exponent)`

Returns the value of `base` raised to the power of `exponent` (<code>base<sup>exponent</sup></code>).

If `base` is not specified (i.e. this function is invoked with one argument), then the context value is used as the value of `base`. 

An error is thrown if the values of `base` and `exponent` lead to a value that cannot be represented as a JSON number (e.g. Infinity, complex numbers).

__Examples__  
- `$power(2, 8)` => `256`  
- `$power(2, 0.5)` => `1.414213562373`  
- `$power(2, -2)` => `0.25`  

## `$sqrt()`
__Signature:__ `$sqrt(number)`

Returns the square root of the value of the `number` parameter.

If `number` is not specified (i.e. this function is invoked with one argument), then the context value is used as the value of `number`. 

An error is thrown if the value of `number` is negative.

__Examples__  
- `$sqrt(4)` => `2`
- `$sqrt(2)` => `1.414213562373`  

## `$random()`
__Signature:__ `$random()`

Returns a pseudo random number greater than or equal to zero and less than one (<code>0 &#8804; n < 1</code>) 

__Examples__  
- `$random()` => `0.7973541067127`  
- `$random()` => `0.4029142127028`  
- `$random()` => `0.6558078550072`  


## `$formatNumber()`
__Signature:__ `$formatNumber(number, picture [, options])`

Casts the `number` to a string and formats it to a decimal representation as specified by the `picture` string.

The behaviour of this function is consistent with the XPath/XQuery function [fn:format-number](https://www.w3.org/TR/xpath-functions-31/#func-format-number) as defined in the XPath F&O 3.1 specification.  The picture string parameter defines how the number is formatted and has the [same syntax](https://www.w3.org/TR/xpath-functions-31/#syntax-of-picture-string) as fn:format-number.

The optional third argument `options` is used to override the default locale specific formatting characters such as the decimal separator.  If supplied, this argument must be an object containing name/value pairs specified in the [decimal format](https://www.w3.org/TR/xpath-functions-31/#defining-decimal-format) section of the XPath F&O 3.1 specification.

__Examples__

- `$formatNumber(12345.6, '#,###.00')` => `"12,345.60"`   
- `$formatNumber(1234.5678, "00.000e0")` => `"12.346e2"`   
- `$formatNumber(34.555, "#0.00;(#0.00)")` => `"34.56"`   
- `$formatNumber(-34.555, "#0.00;(#0.00)")` => `"(34.56)"`   
- `$formatNumber(0.14, "01%")` => `"14%"`   
- `$formatNumber(0.14, "###pm", {"per-mille": "pm"})` => `"140pm"`   
- `$formatNumber(1234.5678, "①①.①①①e①", {"zero-digit": "\u245f"})` => `"①②.③④⑥e②"`   


## `$formatBase()`
__Signature:__ `$formatBase(number [, radix])`

Casts the `number` to a string and formats it to an integer represented in the number base specified by the `radix` argument.  If `radix` is not specified, then it defaults to base 10.  `radix` can be between 2 and 36, otherwise an error is thrown.

__Examples__

- `$formatBase(100, 2)` => `"1100100"`
- `$formatBase(2555, 16)` => `"9fb"`


## `$formatInteger()`
__Signature:__ `$formatInteger(number, picture)`

Casts the `number` to a string and formats it to an integer representation as specified by the `picture` string.

The behaviour of this function is consistent with the two-argument version of the XPath/XQuery function [fn:format-integer](https://www.w3.org/TR/xpath-functions-31/#func-format-integer) as defined in the XPath F&O 3.1 specification.  The picture string parameter defines how the number is formatted and has the same syntax as fn:format-integer.

__Examples__

- `$formatInteger(2789, 'w')` => `"two thousand, seven hundred and eighty-nine"`
- `$formatInteger(1999, 'I')` => `"MCMXCIX"`

## `$parseInteger()`
__Signature:__ `$parseInteger(string, picture)`

Parses the contents of the `string` parameter to an integer (as a JSON number) using the format specified by the `picture` string.
The picture string parameter has the same format as `$formatInteger`. Although the XPath specification does not have an equivalent
function for parsing integers, this capability has been added to JSONata.

__Examples__

- `$parseInteger("twelve thousand, four hundred and seventy-six", 'w')` => `12476`
- `$parseInteger('12,345,678', '#,##0')` => `12345678`
