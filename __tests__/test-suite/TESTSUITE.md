# Jsonata Test Suite

The data contained in this directory is an attempt at a language neutral
test suite for `jsonata`. The original test suite (written in Javascript)
was transformed into a series of JSON files.

## `datasets` directory

The `datasets` directory contains a set of JSON files.  Each file represents
potential input data to a `jsonata` test.  The point of putting this input in
named files is so that it can be re-used (rather than repeated) by different
test cases.

## `groups/<groupname>/case###.json`

Each `<groupname>` directory is a bundle of test cases related to a given 
topic.  Inside each of those directories are JSON files that represent
individual test cases.  Each JSON file contains a test case and each test
case includes the following fields:

* `expr`: The `jsonata` expression to be evaluated.
* `data` or `dataset`: If `data` is defined, use the value of the `data` field
  as the input data for the test case.  Otherwise, the `dataset` field contains
  the name of the dataset (in the `datasets` directory) to use as input data.
  If value of the `dataset` field is `null`, then use `undefined` as the input
  data when evaluating the `jsonata` expression.
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
