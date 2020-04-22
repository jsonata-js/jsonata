/**
 * © Copyright IBM Corp. 2018 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

// This file contains polyfills (cut and pasted from MDN docs) required for the ES5 package


Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value;
};

if (!String.fromCodePoint) (function(stringFromCharCode) {
    var fromCodePoint = function(_) {
        var codeUnits = [], codeLen = 0, result = "";
        for (var index=0, len = arguments.length; index !== len; ++index) {
            var codePoint = +arguments[index];
            // correctly handles all cases including `NaN`, `-Infinity`, `+Infinity`
            // The surrounding `!(...)` is required to correctly handle `NaN` cases
            // The (codePoint>>>0) === codePoint clause handles decimals and negatives
            if (!(codePoint < 0x10FFFF && (codePoint>>>0) === codePoint))
                throw RangeError("Invalid code point: " + codePoint);
            if (codePoint <= 0xFFFF) { // BMP code point
                codeLen = codeUnits.push(codePoint);
            } else { // Astral code point; split in surrogate halves
                // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                codePoint -= 0x10000;
                codeLen = codeUnits.push(
                    (codePoint >> 10) + 0xD800,  // highSurrogate
                    (codePoint % 0x400) + 0xDC00 // lowSurrogate
                );
            }
            if (codeLen >= 0x3fff) {
                result += stringFromCharCode.apply(null, codeUnits);
                codeUnits.length = 0;
            }
        }
        return result + stringFromCharCode.apply(null, codeUnits);
    };
    try { // IE 8 only supports `Object.defineProperty` on DOM elements
        Object.defineProperty(String, "fromCodePoint", {
            "value": fromCodePoint, "configurable": true, "writable": true
        });
    } catch(e) {
        String.fromCodePoint = fromCodePoint;
    }
}(String.fromCharCode));

if (!Object.is) {
    Object.is = function(x, y) {
        // SameValue algorithm
        if (x === y) { // Steps 1-5, 7-10
            // Steps 6.b-6.e: +0 != -0
            return x !== 0 || 1 / x === 1 / y;
        } else {
            // Step 6.a: NaN == NaN
            return x !== x && y !== y;
        }
    };
}

/*! https://mths.be/codepointat v0.2.0 by @mathias */
if (!String.prototype.codePointAt) {
    (function() {
        'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
        var defineProperty = (function() {
            // IE 8 only supports `Object.defineProperty` on DOM elements
            try {
                var object = {};
                var $defineProperty = Object.defineProperty;
                var result = $defineProperty(object, object, object) && $defineProperty;
            } catch(error) {}
            return result;
        }());
        var codePointAt = function(position) {
            if (this == null) {
                throw TypeError();
            }
            var string = String(this);
            var size = string.length;
            // `ToInteger`
            var index = position ? Number(position) : 0;
            if (index != index) { // better `isNaN`
                index = 0;
            }
            // Account for out-of-bounds indices:
            if (index < 0 || index >= size) {
                return undefined;
            }
            // Get the first code unit
            var first = string.charCodeAt(index);
            var second;
            if ( // check if it’s the start of a surrogate pair
                first >= 0xD800 && first <= 0xDBFF && // high surrogate
                size > index + 1 // there is a next code unit
            ) {
                second = string.charCodeAt(index + 1);
                if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
                    // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                    return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
                }
            }
            return first;
        };
        if (defineProperty) {
            defineProperty(String.prototype, 'codePointAt', {
                'value': codePointAt,
                'configurable': true,
                'writable': true
            });
        } else {
            String.prototype.codePointAt = codePointAt;
        }
    }());
}

Math.log10 = Math.log10 || function(x) {
    return Math.log(x) * Math.LOG10E;
};
