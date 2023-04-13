---
id: predicate
title: Query refinement using predicate expressions
sidebar_label: Predicate Queries
---

## Predicates

At any step in a location path, the selected items can be filtered using a predicate - `[expr]` where `expr` evaluates to a Boolean value.  Each item in the selection is tested against the expression, if it evaluates to `true`, then the item is kept; if `false`, it is removed from the selection. The expression is evaluated relative to the current (context) item being tested, so if the predicate expression performs navigation, then it is relative to this context item.

#### Examples:

- Select the `Phone` items that have a `type` field that equals `"mobile"`.
  <div class="jsonata-ex">
    <div>Phone[type='mobile']</div>
    <div>{ "type": "mobile",  "number": "077 7700 1234" }</div>
  </div>

- Select the mobile phone number
  <div class="jsonata-ex">
    <div>Phone[type='mobile'].number</div>
    <div>"077 7700 1234"</div>
  </div>

- Select the office phone numbers - there are two of them!
  <div class="jsonata-ex">
    <div>Phone[type='office'].number</div>
    <div>[ "01962 001234",  "01962 001235" ]</div>
  </div>


## Singleton array and value equivalence

Within a JSONata expression or subexpression, any value (which is not itself an array) and an array containing just that value are deemed to be equivalent.  This allows the language to be composable such that location paths that extract a single value from an object and location paths that extract multiple values from arrays can both be used as inputs to other expressions without needing to use different syntax for the two forms.

Consider the following examples:

* `Address.City` returns the single value `"Winchester"`
* `Phone[0].number` matches a single value, and returns that value `"0203 544 1234"`
* `Phone[type='home'].number` likewise matches the single value `"0203 544 1234"`
* `Phone[type='office'].number` matches two values, so returns an array `[ "01962 001234",  "01962 001235" ]`

When processing the return value of a JSONata expression, it might be desirable to have the results in a consistent format regardless of how many values were matched.  In the first two expressions above, it is clear that each expression is addressing a single value in the structure and it makes sense to return just that value.  In the last two expressions, however, it is not immediately obvious how many values will be matched, and it is not helpful if the host language has to process the results in different ways depending on what gets returned.

If this is a concern, then the expression can be modified to make it return an array even if only a single value is matched. This is done by adding empty square brackets `[]` to a step within the location path.  The examples above can be re-written to always return an array as follows:

* `Address[].City` returns `[ "Winchester"] `
* `Phone[0][].number` returns `[ "0203 544 1234" ]`
* `Phone[][type='home'].number` returns `[ "0203 544 1234" ]`
* `Phone[type='office'].number[]` returns `[ "01962 001234",  "01962 001235" ]`

Note that the `[]` can be placed either side of the predicates and on any step in the path expression

## Wildcards

Use of `*` instead of field name to select all fields in an object

#### Examples

- Select the values of all the fields of `Address`
  <div class="jsonata-ex">
    <div>Address.*</div>
    <div>[ "Hursley Park", "Winchester", "SO21 2JN" ]</div>
  </div>

- Select the `Postcode` value of any child object
  <div class="jsonata-ex">
    <div>*.Postcode</div>
    <div>"SO21 2JN"</div>
  </div>



## Navigate arbitrary depths

Descendant wildcard `**` instead of `*` will traverse all descendants (multi-level wildcard).

#### Examples

- Select all `Postcode` values, regardless of how deeply nested they are in the structure
  <div class="jsonata-ex">
    <div>**.Postcode</div>
    <div>[ "SO21 2JN", "E1 6RF" ]</div>
  </div>
