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
     * Create an empty sequence to contain query results
     * @returns {Array} - empty sequence
     */
    function createSequence() {
        var sequence = [];
        sequence.sequence = true;
        if (arguments.length === 1) {
            sequence.push(arguments[0]);
        }
        return sequence;
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
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    // istanbul ignore next
    var iteratorSymbol = $Symbol.iterator || "@@iterator";

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
     * Writes the decimal digits of a non-negative integer out in full (never exponent notation)
     * @param {{digits: string, exponent: number}} number - the digits, and the power of ten of the last one
     * @returns {string} - the decimal integer string
     */
    function decimalDigitsToString(number) {
        return (number.digits + '0'.repeat(number.exponent)).replace(/^0+/, '') || '0';
    }

    return {
        isNumeric,
        isArrayOfStrings,
        isArrayOfNumbers,
        createSequence,
        isSequence,
        isFunction,
        isLambda,
        isIterable,
        getFunctionArity,
        isDeepEqual,
        stringToArray,
        keys,
        decimalDigits,
        decimalDigitsToString
    };
})();

module.exports = utils;
