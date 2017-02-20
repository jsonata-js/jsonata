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
    
