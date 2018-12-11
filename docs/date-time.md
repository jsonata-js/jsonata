---
id: date-time
title: Date/Time processing
sidebar_label: Date/Time Processing
---

## The 'evaluation time’ - $now()

There are two functions that return the 'current' date/time timestamp:

1. [`$now()`](date-time-functions#now) returns the timestamp in an ISO 8601 formatted string.
2. [`$millis()`](date-time-functions#millis) returns the same timestamp as the number of milliseconds since midnight on 1st January 1970 UTC (the [Unix epoch](https://en.wikipedia.org/wiki/Unix_time)).

The timestamp is captured at the start of the expression evaluation, and that same timestamp value is returned for every occurrence of `$now()` and `$millis()` in the same expression for the duration of the evaluation.

__Example__

- The timestamp will be the same for all invocations within an expression
  <div class="jsonata-ex">
    <div>{
  "invoiceTime": $now(),
  "total": $sum(Account.Order.Product.(Price * Quantity)),
  "closingTime": $now()
}</div>
    <div>{
  "invoiceTime": "2018-12-10T13:49:51.141Z",
  "total": 336.36,
  "closingTime": "2018-12-10T13:49:51.141Z"
}</div>
  </div>

## JSON and ISO 8601

JSON does not have a built-in type for date/time values.  The general [consensus](https://stackoverflow.com/a/15952652/7079134) is to store the date/time value as a string in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format.

__Example__

```
{
    "myDateTime": "2018-12-10T13:45:00.000Z"
}
```

JSONata follows this convention and provides functions for formatting and parsing ISO 8601 formatted timestamps 
([`toMillis()`](date-time-functions#tomillis) and [`fromMillis()`](date-time-functions#frommillis))

## Support for other date/time formats

Since there is no standard for date/time format in JSON, it is entirely possible that the JSON data you are working with will have date/time values formatted in other ways.  JSONata supports the highly versatile picture string notation from the XPath/XQuery [fn:format-dateTime()](https://www.w3.org/TR/xpath-functions-31/#func-format-dateTime) specification for both the formatting and parsing of a wide variety of date/time formats. 

See [`toMillis()`](date-time-functions#tomillis) and [`fromMillis()`](date-time-functions#frommillis) for details.

__Examples__

- The date `12/10/2018` in US format and `10/12/2018` in European format both refer to the same day.
  <div class="jsonata-ex">
    <div>$toMillis('10/12/2018', '[D]/[M]/[Y]') ~> $fromMillis('[M]/[D]/[Y]')</div>
    <div>"12/10/2018"</div>
  </div>

- More verbose format.
  <div class="jsonata-ex">
    <div>$toMillis('10/12/2018', '[D]/[M]/[Y]') 
       ~> $fromMillis('[FNn], [D1o] [MNn] [YI]')</div>
    <div>"Monday, 10th December MMXVIII"</div>
  </div>


