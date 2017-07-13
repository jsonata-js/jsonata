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
    
