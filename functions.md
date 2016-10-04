## JSONata Function Library
The following is a proposed function library for use within JSONata expressions.
This is work in progress. Some of these functions have been implemented, but mostly not.


#### String functions
- `$string(arg)`

   Casts the `arg` parameter to a string using the following casting rules
   - Strings are unchanged
   - Functions are converted to an empty string
   - Numeric infinity and NaN throw an error because they cannot be represented as a JSON number
   - All other values are converted to a JSON string using the [JSON.stringify](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) function
   
- `$length(str)`

   Returns the number of characters in the string `str`
   
- `$substring(str, start[, length])`

Returns a string containing the characters in the first parameter `str`
starting at position `start` (zero-offset).  If `length` is specified, then
the substring will contain maximum `length` characters.  If `start` is negative
then it indicates the number of characters from the end of `str`.
See [substr](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr) for full definition.

  - `$substringBefore(str, chars)`

   Returns the substring before the first occurrence of the character sequence `chars` in `str`.
   If `str` does not contain `chars`, then it returns `str`.


  - `$substringAfter(str, chars)`

   Returns the substring after the first occurrence of the character sequence `chars` in `str`.
   If `str` does not contain `chars`, then it returns `str`.


  - `$uppercase(str)`

  Returns a string with all the characters of `str` converted to uppercase.


  - `$lowercase(str)`

  Returns a string with all the characters of `str` converted to lowercase.


- `$split(str, separator)`

- `$join(array[, separator])`

- `$format(pattern, ...)`

  [printf style formatting](https://en.wikipedia.org/wiki/Printf_format_string#Format_placeholder_specification). Other formatting schemes are available.

#### Numerical functions

- `$number(arg)`

   Casts the `arg` parameter to a number using the following casting rules
   - Numbers are unchanged
   - Strings that contain a sequence of characters that represent a legal JSON number are converted to that number
   - All other values cause an error to be thrown.

- `$sum(array)`

   Sums up the numbers in the `array` using the following rules
   - Numbers are unchanged
   - Strings that contain a sequence of characters that represent a legal JSON number are converted to that number
   - If zero or more than 1 argument is passed in the function will throw an error
        
- `$abs(number)`
- `$max(array)`
- `$min(array)`
- `$round(number)`

  Rounds up to the nearest integer

- `$roundHalfToEven(number)`

  [Round half to even](https://en.wikipedia.org/wiki/Rounding#Round_half_to_even) Commonly used in financial calculations.

- `$average(array)`
- `$power(base, exponent)`

#### Boolean functions

- `$boolean(arg)`

  Casts the argument to a Boolean using the following rules:
  
  | Argument type|Result|
  | -------------|------|
  | Boolean| unchanged|
  | string: empty| `false`|
  | string: non-empty| `true`|
  | number: 0 | `false`|
  | number: non-zero | `true`|
  | null | `false`|
  | array: empty| `false`|
  | array: contains a member that casts to `true`|  `true`|
  | array: all members cast to `false`|  `false`|
  | object: empty | `false`|
  | object: non-empty | `true`|
  | function | `false`|


- `$not(arg)`

  Returns Boolean NOT on the argument.  `arg` is first cast to a boolean

#### Date/Time functions

#### Array functions

- `$count(array)`

  Returns the number of items in the array
  
- `$append(array, array)`

  Appends two arrays
  
- `$flatten(array)`

  Flattens nested array into flat array
  
- `$range(start, end, increment)`

  Generates an array of numbers starting with `start`, not exceeding `end`, in increments of `increment` (defaults to 1)

#### Object functions

- `$keys(object)`

  Returns an array containing the keys in the object

- `$lookup(object, key)`

  Returns the value assosciated with `key` in `object`
  
- `$merge(object, object)`
  
  Returns an object containing the union of the two `object` parameters.  If an entry in the second object 
  has the same key as an entry in the first, then the value will be overridden by the second.
  
#### Higher-order functions

- `$map`

