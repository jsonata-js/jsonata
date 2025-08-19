---
id: processing
title: The JSONata processing model
sidebar_label: Processing Model
---

## The JSONata type system

JSONata is a superset of JSON and the JSONata type system is a superset of the JSON data types.  In common with all functional programming languages, the function is also a first-class data type.  The following data types are supported by JSONata:

- string
- number
- Boolean
- null
- object
- array
- function

All but the last one are in common with JSON.

## Sequences

JSONata has been designed foremost as a query language, whereby a path expression can select zero, one or more than one values from the JSON document.  These values, each of which can be of any of the types listed above, are returned as a _result sequence_.  During the evaluation of expressions, which involves the results of subexpressions being combined or becoming the context inputs to other subexpressions, the sequences are subject to the process of _sequence flattening_.

The sequence flattening rules are as follows:

1. An __empty sequence__ is a sequence with no values and is considered to be 'nothing' or 'no match'.  It won't appear in the output of any expression. If it is associated with an object property (key/value) pair in a result object, then that object will not have that property.

2. A __singleton sequence__ is a sequence containing a single value.  It is considered equivalent to that value itself, and the output from any expression, or sub-expression will be that value without any surrounding structure.

3. A sequence containing more than one value is represented in the output as a JSON array.  This is still internally flagged as a sequence and subject to the next rule.  Note that if an expression matches an array from the input JSON, or a JSON array is explicitly constructed in the query using the [array constructor](construction#array-constructors), then this remains an array of values rather than a sequence of values and will not be subject to the sequence flattening rules.  However, if this array becomes the context of a subsequent expression, then the result of that _will_ be a sequence.

4. If a sequence contains one or more (sub-)sequences, then the values from the sub-sequence are pulled up to the level of the outer sequence.  A result sequence will never contain child sequences (they are flattened).



## JSONata path processing

The JSONata path expression is a _declarative functional_ language.

__Functional__ because it is based on the map/filter/reduce programming paradigm as supported by popular functional programming languages through the use of higher-order functions.

__Declarative__ because these higher-order functions are exposed through a lightweight syntax which lets the user focus on the intention of the query (declaration) rather than the programming constructs that control their evaluation.

A path expression is a sequence of one or more of the following functional stages:

Stage | Syntax | Action
---|---|---
 __Map__ | seq`.`expr | Evaluates the RHS expression in the context of each item in the input sequence.  Flattens results into result sequence.
 __Filter__ | seq`[`expr`]` | Filter results from previous stage by applying predicate expression between brackets to each item.
 __Sort__ | seq`^(`expr`)` | Sorts (re-orders) the input sequence according to the criteria in parentheses.
 __Index__ | seq`#`$var | Binds a named variable to the current context position (zero offset) in the sequence.
 __Join__ | seq`@`$var | Binds a named variable to the current context item in the sequence.  Can only be used directly following a map stage.
__Reduce__ | seq`{` expr`:`expr`,` expr`:`expr ...`}` | Group and aggregate the input sequence to a single result object as defined by the name/value expressions.  Can only appear as the final stage in a path expression.

In the above table:

- In the 'Syntax' column, 'seq' refers to the input sequence for the current stage, which is the result sequence from the previous stage.
- The 'Action' column gives a brief outline of the stage's behavior; fuller details are in the [Path Operators](path-operators) reference page.
- The relative precedence of each operator affects the scope of its influence on the input sequence. Specifically,
  - The Filter operator binds tighter than the Map operator.  This means, for example, that `books.authors[0]` will select the all of the first authors from _each_ book rather than the first author from all of the books.
  - The Sort (order-by) operator has the lowest precedence, meaning that the full path to the left of it will be evaluated, and its result sequence will be sorted.
  - This operator precedence can be overridden by using parentheses.  For example, `(books.authors)[0]` will select the the first author from all of the books (single value).  Note, however, that parentheses also define a scope frame for variables, so any variables that have been bound within the parentheses block including those bound by the `@` and `#` operators will go out of scope at the end of the parens block.
- The variables bound by the `@` and `#` operators go out of scope at the end of the path expression.
  - The Reduce stage, if used, will terminate the current path expression.  Although a Map operator can immediately follow this, it will be interpreted as the start of a new path expression, meaning that any previously bound context or index variables will be out of scope.
