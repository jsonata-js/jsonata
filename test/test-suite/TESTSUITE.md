# Jsonata Test Suite

The data contained in this directory is an attempt at a language neutral
test suite for `jsonata`. The original test suite (written in Javascript)
was transformed into a series of JSON files.

## `datasets.json`

The `datasets.json` file contains all the "input data" used when evaluating
`jsonata` expressions for the various test cases. It contains a simple
array. In each test case the index of the dataset to use is specified.

## `groups/*.json`

The JSON files in the `groups` directory represent collections of test
cases. Each file contains an array of cases and each case includes
the following fields:

* `expr`: The `jsonata` expression to be evaluated.
* `data` or `dataset`: If `data` is defined, use that as the input data for
  the test case.  Otherwise, `dataset` contains the index of the dataset to use.
  If the index is `-1`, the input data should be `undefined`.
* `timelimit`: If a timelimit should be imposed on the test, this specifies the
  timelimit in milliseconds.
* `depth`: If the depth of evaluation should be limited, this specifies the depth.
* `bindings`: Any variable bindings to be applied when evaluating the expression.

In addition, (exactly) one of the following fields is specified for each test case:

* `result`: The expected result of evaluation (if defined)
* `undefinedResult`: A flag indicating the expected result of evaluation will be `undefined`
* `code`: The code associated with the exception that is expected to be thrown when either compiling the expression or evaluating it

If the `code` field is present, an optional `token` field may also be present indicating which token token the exception
should be associated with.
