---
id: date-time-functions
title: Date/Time functions
sidebar_label: Date/Time Functions
---

## `$now()`
__Signature:__ `$now([picture [, timezone]])`

Generates a UTC timestamp in ISO 8601 compatible format and returns it as a string.  All invocations of `$now()` within an evaluation of an expression will all return the same timestamp value.

If the optional `picture` and `timezone` parameters are supplied, then the current timestamp is formatted as described by the [`$fromMillis()`](#frommillis) function.

__Examples__

- `$now()` => `"2017-05-15T15:12:59.152Z"`


## `$millis()`
__Signature:__ `$millis()`

Returns the number of milliseconds since the Unix *Epoch* (1 January, 1970 UTC) as a number.  All invocations of `$millis()` within an evaluation of an expression will all return the same value.

__Examples__  
- `$millis()` => `1502700297574`


## `$fromMillis()`
__Signature:__ `$fromMillis(number [, picture [, timezone]])`

Convert the `number` representing milliseconds since the Unix *Epoch* (1 January, 1970 UTC) to a formatted string representation of the timestamp  as specified by the `picture` string.

If the optional `picture` parameter is omitted, then the timestamp is formatted in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format.

If the optional `picture` string is supplied, then the timestamp is formatted occording to the representation specified in that string.
The behaviour of this function is consistent with the two-argument version of the XPath/XQuery function [fn:format-dateTime](https://www.w3.org/TR/xpath-functions-31/#func-format-dateTime) as defined in the XPath F&O 3.1 specification.  The picture string parameter defines how the timestamp is formatted and has the [same syntax](https://www.w3.org/TR/xpath-functions-31/#date-picture-string) as fn:format-dateTime.

If the optional `timezone` string is supplied, then the formatted timestamp will be in that timezone.  The `timezone` string should be in the
format "±HHMM", where ± is either the plus or minus sign and HHMM is the offset in hours and minutes from UTC.  Positive offset for timezones
east of UTC, negative offset for timezones west of UTC. 

__Examples__

- `$fromMillis(1510067557121)` => `"2017-11-07T15:12:37.121Z"`
- `$fromMillis(1510067557121, '[M01]/[D01]/[Y0001] [h#1]:[m01][P]')` => `"11/07/2017 3:12pm"`
- `$fromMillis(1510067557121, '[H01]:[m01]:[s01] [z]', '-0500')` => `"10:12:37 GMT-05:00"`

## `$toMillis()`
__Signature:__ `$toMillis(timestamp [, picture])`

Convert a `timestamp` string to the number of milliseconds since the Unix *Epoch* (1 January, 1970 UTC) as a number. 

If the optional `picture` string is not specified, then the format of the timestamp is assumed to be [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html). An error is thrown if the string is not in the correct format.

If the `picture` string is specified, then the format is assumed to be described by this picture string using the [same syntax](https://www.w3.org/TR/xpath-functions-31/#date-picture-string) as the XPath/XQuery function [fn:format-dateTime](https://www.w3.org/TR/xpath-functions-31/#func-format-dateTime), defined in the XPath F&O 3.1 specification.  

__Examples__

- `$toMillis("2017-11-07T15:07:54.972Z")` => `1510067274972`
