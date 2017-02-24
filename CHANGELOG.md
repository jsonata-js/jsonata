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
    
