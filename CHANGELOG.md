#### 1.8.3 Maintenance Release

- Remove incomplete polyfill for `Array.from()` (issue #432)
- Fix `$not` to return empty sequence for missing inputs (issue #433)
- Fix RangeError (stack overflow) when querying very large objects (issue #434)

#### 1.8.2 Maintenance Release

- Fix bug with regex usage in partially applied functions (issue #427)
- Fix regression when the $string() function is applied to a top-level array (PR #429)

#### 1.8.1 Maintenance Release

- Fix bug in timezone handling for ISO week date formats (issue #403)

#### 1.8.0 Milestone Release

- New syntax (`%` parent operator) to select the parent of the current context value (issue #299)
- New function `$type` to return the data type of the argument (issue #208)
- Added versioning to the documentation site (issue #385)
- Fixed bugs #382, #387, #396, #399

#### 1.7.0 Milestone Release

- New syntax (`@` operator) to support cross-referencing and complex data joins (issue #333)
- New syntax (`#` operator) to get current context position in sequence (issue #187)
- Equality operators (`=`, `!=`) now perform deep object/array comparison
- New functions
  - `$error` - Explicitly throw an error with message (issue #167)
  - `$assert` - Throw error (with message) if assertion evaluates to false (issue #369)
  - `$single` - Returns the single value in an array (issue #348)
  - `$encodeUrl`, `$encodeUrlComponent`, `$decodeUrl`, `$decodeUrlComponent` - URL/URI helper functions (issue #103)
  - `$distinct` - Returns array with duplicate values removed
- Enhanced functions
  - `$reduce` - Now works with a 4-argument function parameter (issue #102)
  - `$number` - Can now cast numeric strings with leading zeros (issue #368)
  - `$string` - Now has optional second argument to "prettify" objects (issue #334)
- Minimum node.js runtime v8 (dropped support for v6). Added support for Node 12.
- Fixed bugs #316, #332, #349

#### 1.6.5 Maintenance Release

- Fix concurrency bug in chain operator (issue #335)
- Fix flattening login in map operator (issue #314)
- Fix message inserts for errors thrown in function bodies (issue #297)
- Limit array size allocatable by range operator to ten million entries (issue #240)

#### 1.6.4 Maintenance Release

- Fix performance regression (PR #292)
- Fix bug in `$each` function (PR #293)

#### 1.6.3 Maintenance Release

- Fix es5 build and polyfills to enable test suite to (mostly) run in Nashorn (PR #288)
- Extra polyfill required for running jsonata-es5.js in IE 11 (PR #289)

#### 1.6.2 Maintenance Release

- Fix insertion of regenerator runtime at top of ES5 file (PR #284)

#### 1.6.1 Milestone Release (v1.6.0 was not published)

- New date/time formatting and parsing capability (issue #166)
- Support for comments in expressions (issue #75)
- Higher-order extension functions (issue #259)
- Allow Boolean to be cast to a number (issue #257)
- New functions
  - $eval - parse/evaluate the contexts of a JSON/JSONata string (issue #134)
  - $formatInteger - format an integer to a string using picture string definition
  - $parseInteger - parse an integer from a string using picture string definition
- Non-functional enhancements:
  - Split codebase into multiple files; fixed multiple issues with ES5 generated library
  - Multiple conformance tests in a single file
  - Documentation moved to main jsonata repo; generated using docusaurus.io
  - Minimum node.js runtime v6 (dropped support for v4)
- Numerous bug fixes (#236, #179, #261, #236, #245, #246, #233, #250, #247, #242, #249)

#### 1.5.4 Maintenance Release

- Fully test and fix bugs in async mode (PR #219)
- Publish Typescript definition file (issue #182)
- Numeric precision should be 15 decimal digits, not 13 (issue 194)
- Defining functions for use with `$match` etc. (issue #213)
- Fix regression in `$substring` for negative start position & length (issue #204)
- Fix for 'sort' syntax error (issue #210)
- Various code optimizations (issues #184, #205, #164)
- Add support for node 10.x (PR #228)

#### 1.5.3 Maintenance Release

- `$formatNumber` should use `zero-digit` character for padding (issue #161)
- Handle undefined inputs in `$formatNumber` (issue #165)
- Handle surrogate pairs as single char in string functions (issue #156)
- Throw error if multiple group-by expressions evaluate to same key (issue #163)

#### 1.5.2 Maintenance Release

- Enforce consistent syntax error when attempting to use unquoted numeric property names (issue #147)
- Invalid token on LHS of binding operator is now a syntax error rather than dynamic (runtime) error (issue #148)
- Fix corruption of predicated function calls within lambda functions (PR 149)

#### 1.5.1 Maintenance Release

- Update `$toMillis()` to allow more complete range of ISO 8601 compatible dates (issue #140)
- Fix `$append()` so that it doesn't mutate the first argument (issue #139)

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

