## JSONata Function Library
The following is a proposed function library for use within JSONata expressions.
This is work in progress. Some of these functions have been implemented, and those that have not are marked accordingly.


### String functions
#### `$string(arg)`

Casts the `arg` parameter to a string using the following casting rules
   - Strings are unchanged
   - Functions are converted to an empty string
   - Numeric infinity and NaN throw an error because they cannot be represented as a JSON number
   - All other values are converted to a JSON string using the [JSON.stringify](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) function
   
####`$length(str)`

Returns the number of characters in the string `str`.  An error is thrown if `str` is not a string.
   
####`$substring(str, start[, length])`

Returns a string containing the characters in the first parameter `str`
starting at position `start` (zero-offset).  If `length` is specified, then
the substring will contain maximum `length` characters.  If `start` is negative
then it indicates the number of characters from the end of `str`.
See [substr](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr) for full definition.

####`$substringBefore(str, chars)`

Returns the substring before the first occurrence of the character sequence `chars` in `str`.
If `str` does not contain `chars`, then it returns `str`.

####`$substringAfter(str, chars)`

Returns the substring after the first occurrence of the character sequence `chars` in `str`.
If `str` does not contain `chars`, then it returns `str`.


#### `$uppercase(str)`

Returns a string with all the characters of `str` converted to uppercase.


#### `$lowercase(str)`

Returns a string with all the characters of `str` converted to lowercase.


#### `$split(str, separator, limit)`

Splits the `str` parameter into an array of substrings.  It is an error if `str` is not a string.

The optional `separator` parameter
specifies the characters within the `str` about which it should be split. If `separator` is
not specified, then the empty string is assumed, and `str` will be split into an array of single
characters.  It is an error if `separator` is not a string.

The optional `limit` parameter is a number that specifies the maximum number of substrings to 
include in the resultant array.  Any additional substrings are discarded.  If `limit` is not 
specified, then `str` is fully split with no limit to the size of the resultant array.
It is an error if `limit` is not a non-negative number. 
 
#### `$join(array[, separator])`

Joins an array of component strings into a single concatenated string with each component string
separated by the optional `separator` parameter.

It is an error if the input array contains an item which isn't a string.

If `separator` is not specified, then it is assumed to be the empty string, i.e. no separator 
between the component strings.  It is an error if `separator` is not a string.

#### `$format(pattern, ...)` - to be implemented

  [printf style formatting](https://en.wikipedia.org/wiki/Printf_format_string#Format_placeholder_specification). Other formatting schemes are available.

### Numerical functions

#### `$number(arg)`

Casts the `arg` parameter to a number using the following casting rules
   - Numbers are unchanged
   - Strings that contain a sequence of characters that represent a legal JSON number are converted to that number
   - All other values cause an error to be thrown.

#### `$abs(number)` - to be implemented
#### `$round(number)` - to be implemented

Rounds up to the nearest integer

#### `$roundHalfToEven(number)` - to be implemented

  [Round half to even](https://en.wikipedia.org/wiki/Rounding#Round_half_to_even) Commonly used in financial calculations.

#### `$power(base, exponent)` - to be implemented

### Numeric aggregation functions

#### `$sum(array)`

Returns the arithmetic sum of an array of numbers. 
It is an error if the input array contains an item which isn't a number.

#### `$max(array)`

Returns the maximum number in an array of numbers. 
It is an error if the input array contains an item which isn't a number.

#### `$min(array)`

Returns the minimum number in an array of numbers. 
It is an error if the input array contains an item which isn't a number.

#### `$average(array)`

Returns the mean value of an array of numbers. 
It is an error if the input array contains an item which isn't a number.

### Boolean functions

#### `$boolean(arg)`

Casts the argument to a Boolean using the following rules:
  
| Argument type | Result |
| ------------- | ------ |
| Boolean | unchanged |
| string: empty | `false`|
| string: non-empty | `true` |
| number: 0 | `false`|
| number: non-zero | `true` |
| null | `false`|
| array: empty | `false` |
| array: contains a member that casts to `true` |  `true` |
| array: all members cast to `false` |  `false` |
| object: empty | `false` |
| object: non-empty | `true` |
| function | `false` |


#### `$not(arg)`

Returns Boolean NOT on the argument.  `arg` is first cast to a boolean
  
#### `$exists(arg)`

Returns Boolean `true` if the arg expression evaluates to a value, or 
`false` if the expression does not match anything (e.g. a path to a non-existent 
field reference).

### Date/Time functions
tbd

### Array functions

#### `$count(array)`

Returns the number of items in the array
  
#### `$append(array, array)`

Appends two arrays
  
#### `$flatten(array)` - to be implemented

Flattens nested array into flat array
  
#### `$range(start, end, increment)` - to be implemented

Generates an array of numbers starting with `start`, not exceeding `end`, in increments of `increment` (defaults to 1)

### Object functions

#### `$keys(object)`

Returns an array containing the keys in the object.  If the argument is an array of objects,
then the array returned contains a de-duplicated list of all the keys in all of the objects.

#### `$lookup(object, key)`

Returns the value associated with `key` in `object`. If the first argument is an array of objects,
then all of the objects in the array are searched, and the values associated with all occurrences 
of `key` are returned.
  
#### `$merge(object, object)` - to be implemented
  
Returns an object containing the union of the two `object` parameters.  If an entry in the second object 
has the same key as an entry in the first, then the value will be overridden by the second.

#### `$spread(object)`

Splits an `object` containing key/value pairs into an array of objects, each of which has a single
key/value pair from the input `object`.  If the parameter is an array of objects, then the resultant 
array contains an object for every key/value pair in every object in the supplied array.
  
### Higher-order functions

#### `$map`

#### `$reduce`
