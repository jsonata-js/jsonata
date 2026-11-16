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
     * Converts a non-negative number to a string of plain decimal digits (never exponent notation)
     * Number.prototype.toFixed falls back to exponent notation for values >= 1e21 (e.g. "1.5e+21")
     * @param {number} value - the non-negative number to convert
     * @param {number} [dp] - the number of digits after the decimal point. Defaults to 0
     * @returns {string} - the decimal string
     */
    function toFixedDecimal(value, dp) {
        dp = dp || 0;
        var str = value.toFixed(dp);
        var exponentPos = str.indexOf('e');
        if (exponentPos !== -1) {
            // only reached for values >= 1e21, so the exponent is always positive
            var mantissa = str.substring(0, exponentPos);
            var exponent = Number(str.substring(exponentPos + 1));
            var pointPos = mantissa.indexOf('.');
            var digits = mantissa.replace('.', '');
            var integerLength = (pointPos === -1 ? mantissa.length : pointPos) + exponent;
            str = digits + new Array(integerLength - digits.length + 1).join('0');
            if (dp > 0) {
                str += '.' + new Array(dp + 1).join('0');
            }
        }
        return str;
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
        toFixedDecimal
    };
})();

module.exports = utils;
