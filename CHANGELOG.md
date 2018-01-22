#### 1.5.0 Milestone Release

- Restructured the entire test suite to be implementation language agnostic (PR #122)
- Provide es5 as main entry point, es6 as module entry point (PR #106)
- Added Typescript definitions to package (PR #114)
- Changes to how 'singleton sequences' are handled (issue #93)
- Unary negation of undefined (no match) should return undefined (issue #99)

#### 1.4.1 Maintenance Release

- Object transformation syntax should work with arrays of objects as well as objects (issue #94)

#### 1.4.0 Milestone Release

- New object transformation syntax `~> |...|...|` (issue #70)
- New functions
  - $formatNumber - formats a decimal number to a string using a picture specification defined in XPath F&O spec (issue #54)
  - $formatBase - converts a number to a string in a specified radix
  - $pad - pads a string to a minimum width with leading or trailing padding characters
  - $toMillis - converts an ISO 8601 formatted date/time string to number of milliseconds since the epoch (issue #55)
  - $fromMillis - converts the number of milliseconds since the epoch to an ISO 8601 formatted date/time string (issue #55)
  - $clone - returns a deep copy of an object - used internally by the object transform syntax; overridable by custom implementation (issue #70)

#### 1.3.3 Maintenance Release

- $lookup() function throws an error when the property has a null value (issue #85)

#### 1.3.2 Maintenance Release

- Support extension functions that mix sync/async behaviours (issue #77)

#### 1.3.1 Maintenance Release

- Fix S0202 error insert to report token value, not token type (PR #74)
- Remove use of array iterators because they were failing to transpile to ES5 correctly (issue #78)

#### 1.3.0 Milestone Release

- Property names containing reserved tokens can now be quoted using backticks (`).  The current quoting mechanism using single or double quotes is deprecated and will probably be removed in a future major (e.g. v2.0.0) release.
- The parser can be invoked in a *robust* mode whereby errors will be indicated by an error token in the parse tree rather than throwing an exception. This is the first step in creating a parser that can recover and report multiple errors.  The default mode remains to throw an exception on first syntax error.
- New functions
  - $merge - merge an array of objects into a single object
  - $millis - current timestamp in milliseconds since the epoch

#### 1.2.6 Maintenance Release

- fix evaluator when array constructor is the first step in a path expression (issue #63)

#### 1.2.5 Maintenance Release

- Fix $base64encode and $base64decode functions in the browser

#### 1.2.4 Maintenance Release

- Fix an issue running in IE11 and phantom.js (#58)

#### 1.2.3 Maintenance Release

- Fix an issue for a few functions that were not working in ES5 transpiled version (#56)

#### 1.2.2 Maintenance Release

- Update readme.md with API documentation
- Correctly handle null values when executed with a callback (#53)

#### 1.2.1 Maintenance Release

- Generate ES5 compatible version of jsonata.js (jsonata-es5.js & jsonata-es5.min.js) using Babel
    - use the -es5 version if you need to support older browsers or phantom.js
- New functions $base64encode & base64decode
- Fix formatting of inserts in error messages

#### 1.2.0 Milestone Release

- New syntax to specify order of query results
- Support for asynchronous extension functions - callbacks and promises
- New functions
    - $floor - numeric rounding down
    - $ceil - numeric rounding up
    - $round - numeric round half to even
    - $abs - numeric absolute value
    - $power - numeric power function
    - $sqrt - square root
    - $random - generate random number
    - $now - current timestamp
    - $filter - filter array with predicate function
    - $sort - sort array with comparator function
    - $reverse - reverse contents of array
    - $shuffle - shuffle contents of array into random order
    - $zip - convolves (zips) multiple arrays into an array of tuples (nested arrays)
    - $each - generate array from object by applying function to key/value pairs
    - $sift - sift contents of object with predicate function
- The following (previously undocumented) functions have been modified to align them with other functions
    - $map - apply a function to all values in an array
    - $reduce - apply a function to aggregate (fold) all values in an array
   


#### 1.1.1 Maintenance Release

- fix chaining operator for falsy inputs
- fix tokenizer regression for name tokens that start with "in" and "or"
- Make minified version appear in npm
- Enforce eqeqeq rule in JSONata (#41)
- fix regression: some instances of divide token were incorrectly parsed as start of regex


#### 1.1.0 Milestone Release

- New syntax to create regular expressions
- Enhanced `$split` function to support regex parameter
- New functions
    - `$contains` - tests existence of string/regex in a string
    - `$match` - returns an object representing matches against a regex
    - `$replace` - replaces occurrences of a substring or regex in a string
    - `$trim` - removes excessive whitespace in a string
- Function chaining operator `~>`
    - allows multiple functions to be applied without excessive nesting
- Context substitutable function parameters
    - allows functions to implicitly operate on the context value
- Function signature syntax
    - to support runtime validation of function arguments
- Errors now have error codes
    - messages maintained in separate catalog
    
