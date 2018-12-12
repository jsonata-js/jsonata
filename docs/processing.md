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

__Examples__

TODO

## The path processing pipeline

TODO (from tech talk ppt)

## The map/filter/reduce programming paradigm

With references to literature

## Generating sequences

From location paths

From literal array constructor

With the range operator

## Generic ‘map’ operator

## The ‘filter’ stage

## Aggregating (reduce)

## JSONata syntax built on this model
