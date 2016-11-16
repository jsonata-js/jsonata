# JSON-based tests

JSONata tests can be written in JSON.  This is done by creating files in the test directory with a name format matching `*-test.json`.  These are detected and run
by `testrunner.js`.  A JSON test file must contain a JSON array at the top level.  A very simple test is:

```
[
    {
        "expression": "42",
        "expected": 42
    }
]
```
This checks that the literal number `42` has value 42.

## Tests
As we have seen, tests have an `expression` property which is a JSONata expression to evaluate.  They can also have an `expected`
property which contains the expected result as a JSON object.  The full list of properties that a test can have is:

- `data` - a JSON object to evaluate the expression on, or a shared data reference.
- `error` - an expected error.  Cannot be specified with `expected`.
- `expected` - an expected JSON object, or a shared data reference.  Cannot be specified with `error`.  If the expected value is `undefined`,
then do not specify the `expected` property at all.
- `expression` - the JSONata expression to evaluate.
- `name` - this is a comment about the test.  The test `expression` is automatically appeneded to the test name, so you don't need
to type that yourself.

An example of a test would be:
```
[
    {
        "name": "field navigation",
        "expression": "foo.bar",
        "expected": "gotcha",
        "data": {
            "foo": {
                "bar": "gotcha"
            }
        }
    }
]

```


## Error tests
JSONata expressions can result in errors, so we have tests for this.  Error tests look like:
```
[
    {
        "expression": "10e1000",
        "error": {
            "token": "10e1000",
            "position": 0,
            "message": "Number out of range:"
        }
    }
]
```
The `token` and `position` properties are matched against the error that JSONata returns.  The `message` property is also
matched as a substring of the error.  So in the above example, the test passes as long as `token` and `position` match exactly,
and the error message contains the string `"Number out of range:"`.

## Test groups
Tests are grouped together in files, but it can also make sense to group them within a file.  This is achieved with test groups:
```
[
    "name": "a test group",
    "group": [
        <test 1>,
        <test 2>
    ]
] 
```
The array of a test group is exactly like the array at the top level of a test file.  It can contain tests, shared data,
and more groups.

## Shared data
Sometimes it makes sense to share data between tests to avoid duplication.  This can be achieved with shared data.  In this
example, the shared data object `shareddataexample` is defined, and then used in a subsequent test.  It is references using the
special JSON object `{"$ref": "<shared_data_name>"}`:
```
[
    {
        "name": "shareddataexample",
        "data": {
            "some": "JSON"
        }
    },
    {
        "expression": "some",
        "expected": "JSON",
        "data": {"$ref": "shareddataexample"}
    }
]
```
Shared data is available to any subsequent tests in the the same test array.  It is also available within subsequent groups
and subgroups.
