/**
 * © Copyright IBM Corp. 2016, 2018 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

const utils = (() => {
    'use strict';

    /**
     * Check if value is a finite number
     * @param {float} n - number to evaluate
     * @returns {boolean} True if n is a finite number
     */
    function isNumeric(n) {
        var isNum = false;
        if(typeof n === 'number') {
            isNum = !isNaN(n);
            if (isNum && !isFinite(n)) {
                throw {
                    code: "D1001",
                    value: n,
                    stack: (new Error()).stack
                };
            }
        }
        return isNum;
    }

    /**
     * Returns true if the arg is an array of strings
     * @param {*} arg - the item to test
     * @returns {boolean} True if arg is an array of strings
     */
    function isArrayOfStrings(arg) {
        var result = false;
        /* istanbul ignore else */
        if(Array.isArray(arg)) {
            result = (arg.filter(function(item){return typeof item !== 'string';}).length === 0);
        }
        return result;
    }

    /**
     * Returns true if the arg is an array of numbers
     * @param {*} arg - the item to test
     * @returns {boolean} True if arg is an array of numbers
     */
    function isArrayOfNumbers(arg) {
        var result = false;
        if(Array.isArray(arg)) {
            result = (arg.filter(function(item){return !isNumeric(item);}).length === 0);
        }
        return result;
    }

    /**
     * Tests if a value is a sequence
     * @param {*} value the value to test
     * @returns {boolean} true if it's a sequence
     */
    function isSequence(value) {
        return value.sequence === true && Array.isArray(value);
    }

    /**
     *
     * @param {Object} arg - expression to test
     * @returns {boolean} - true if it is a function (lambda or built-in)
     */
    function isFunction(arg) {
        return ((arg && (arg._jsonata_function === true || arg._jsonata_lambda === true)) || typeof arg === 'function');
    }

    /**
     * Returns the arity (number of arguments) of the function
     * @param {*} func - the function
     * @returns {*} - the arity
     */
    function getFunctionArity(func) {
        var arity = typeof func.arity === 'number' ? func.arity :
            typeof func.implementation === 'function' ? func.implementation.length :
                typeof func.length === 'number' ? func.length : func.arguments.length;
        return arity;
    }

    /**
     * Tests whether arg is a lambda function
     * @param {*} arg - the value to test
     * @returns {boolean} - true if it is a lambda function
     */
    function isLambda(arg) {
        return arg && arg._jsonata_lambda === true;
    }

    // istanbul ignore next
    var iteratorSymbol = (typeof Symbol === "function" ? Symbol : {}).iterator || "@@iterator";

    /**
     * @param {Object} arg - expression to test
     * @returns {boolean} - true if it is iterable
     */
    function isIterable(arg) {
        return (
            typeof arg === 'object' &&
            arg !== null &&
            iteratorSymbol in arg &&
            'next' in arg &&
            typeof arg.next === 'function'
        );
    }

    /**
     * Compares two values for equality
     * @param {*} lhs first value
     * @param {*} rhs second value
     * @returns {boolean} true if they are deep equal
     */
    function isDeepEqual(lhs, rhs) {
        if (lhs === rhs) {
            return true;
        }
        if(typeof lhs === 'object' && typeof rhs === 'object' && lhs !== null && rhs !== null) {
            if(Array.isArray(lhs) && Array.isArray(rhs)) {
                // both arrays (or sequences)
                // must be the same length
                if(lhs.length !== rhs.length) {
                    return false;
                }
                // must contain same values in same order
                for(var ii = 0; ii < lhs.length; ii++) {
                    if(!isDeepEqual(lhs[ii], rhs[ii])) {
                        return false;
                    }
                }
                return true;
            }
            // both objects
            // must have the same set of keys (in any order)
            var lkeys = Object.getOwnPropertyNames(lhs);
            var rkeys = Object.getOwnPropertyNames(rhs);
            if(lkeys.length !== rkeys.length) {
                return false;
            }
            lkeys = lkeys.sort();
            rkeys = rkeys.sort();
            for(ii=0; ii < lkeys.length; ii++) {
                if(lkeys[ii] !== rkeys[ii]) {
                    return false;
                }
            }
            // must have the same values
            for(ii=0; ii < lkeys.length; ii++) {
                var key = lkeys[ii];
                if(!isDeepEqual(lhs[key], rhs[key])) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    /**
     * @param {Object} arg - expression to test
     * @returns {boolean} - true if it is a promise
     */
    function isPromise(arg) {
        return (
            typeof arg === 'object' &&
                arg !== null &&
                'then' in arg &&
                typeof arg.then === 'function'
        );
    }

    /**
     * converts a string to an array of characters
     * @param {string} str - the input string
     * @returns {Array} - the array of characters
     */
    function stringToArray(str) {
        var arr = [];
        for (let char of str) {
            arr.push(char);
        }
        return arr;
    }

    /**
     *
     * @param {Object} arg - the object to inspect
     * @returns {Array} - the keys (property names) of the object
     */
    function keys(arg) {
        return typeof arg === 'object' && arg !== null ? Object.keys(arg) : [];
    }

    /**
     * Returns a string of zeros
     * @param {number} count - the number of zeros
     * @returns {string} - the zeros, or an empty string if count is not positive
     */
    function zeros(count) {
        return count > 0 ? new Array(count + 1).join('0') : '';
    }

    /**
     * Returns the decimal digits of a finite number.  As XPath F&O 3.1 section 4.7.5 requires, these are the digits
     * of the shortest decimal that converts back to the same number (which Number.prototype.toString produces),
     * rather than the digits of its exact binary value (which toFixed uses)
     * @param {number} value - the number; its sign is ignored
     * @returns {{digits: string, exponent: number}} - the digits without leading zeros, and the power of ten of the last one
     */
    function decimalDigits(value) {
        var parts = Math.abs(value).toString().split('e');
        var mantissa = parts[0].split('.');
        var fraction = mantissa[1] || '';
        var digits = (mantissa[0] + fraction).replace(/^0+/, '');
        if (digits === '') {
            return {digits: '0', exponent: 0};
        }
        return {digits: digits, exponent: (parts[1] ? Number(parts[1]) : 0) - fraction.length};
    }

    /**
     * Rounds decimal digits half-to-even to the given number of decimal places
     * @param {{digits: string, exponent: number}} number - the digits, and the power of ten of the last one
     * @param {number} dp - the number of decimal places
     * @returns {{digits: string, exponent: number}} - the rounded digits
     */
    function roundDecimalDigits(number, dp) {
        var dropCount = -number.exponent - dp;
        if (dropCount <= 0) {
            return number;
        }
        var digits = zeros(dropCount - number.digits.length) + number.digits;
        var kept = digits.substring(0, digits.length - dropCount);
        var dropped = digits.substring(digits.length - dropCount);
        var lastKept = kept.length > 0 ? Number(kept.charAt(kept.length - 1)) : 0;
        if (dropped.charAt(0) > '5' || (dropped.charAt(0) === '5' && (/[1-9]/.test(dropped.substring(1)) || lastKept % 2 === 1))) {
            // add one to the kept digits
            var ii = kept.length - 1;
            while (ii >= 0 && kept.charAt(ii) === '9') {
                ii--;
            }
            kept = (ii < 0 ? '1' : kept.substring(0, ii) + (Number(kept.charAt(ii)) + 1)) + zeros(kept.length - ii - 1);
        }
        return {digits: kept.replace(/^0+/, '') || '0', exponent: -dp};
    }

    /**
     * Writes decimal digits out in full (never exponent notation), with exactly the given number of decimal places.
     * The digits must already be rounded to that number of decimal places
     * @param {{digits: string, exponent: number}} number - the digits, and the power of ten of the last one
     * @param {number} dp - the number of decimal places
     * @returns {string} - the decimal string
     */
    function decimalDigitsToString(number, dp) {
        var digits = number.digits;
        var integerPart, fractionalPart;
        if (number.exponent >= 0) {
            integerPart = digits + zeros(number.exponent);
            fractionalPart = '';
        } else {
            digits = zeros(-number.exponent - digits.length) + digits;
            integerPart = digits.substring(0, digits.length + number.exponent);
            fractionalPart = digits.substring(digits.length + number.exponent);
        }
        integerPart = integerPart.replace(/^0+/, '') || '0';
        fractionalPart = fractionalPart + zeros(dp - fractionalPart.length);
        return dp > 0 ? integerPart + '.' + fractionalPart : integerPart;
    }

    return {
        isNumeric,
        isArrayOfStrings,
        isArrayOfNumbers,
        isSequence,
        isFunction,
        isLambda,
        isIterable,
        getFunctionArity,
        isDeepEqual,
        stringToArray,
        isPromise,
        keys,
        decimalDigits,
        roundDecimalDigits,
        decimalDigitsToString
    };
})();

module.exports = utils;
