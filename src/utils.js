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
        var sequence = toSequence([]);
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
        var sequence = value.sequence;
        if(sequence === true) {
            var desc = Object.getOwnPropertyDescriptor(value, 'sequence');
            if(desc.enumerable === false) {
                return true;
            }
        }
        return false;
    }

    /**
     * Converts an array to a result sequence (by adding special properties)
     * @param {Array} arr - the array to convert
     * @returns {*} - the sequence
     */
    function toSequence(arr) {
        Object.defineProperty(arr, 'sequence', {
            enumerable: false,
            configurable: false,
            get: function () {
                return true;
            }
        });
        Object.defineProperty(arr, 'keepSingleton', {
            enumerable: false,
            configurable: false,
            writable: true,
            value: false
        });
        Object.defineProperty(arr, 'value', {
            enumerable: false,
            configurable: false,
            get: function () {
                return function() {
                    switch (this.length) {
                        case 0:
                            return undefined;
                        case 1:
                            return this.keepSingleton ? this : this[0];
                        default:
                            return this;
                    }
                };
            }
        });
        return arr;
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

    /**
     * @param {Object} arg - expression to test
     * @returns {boolean} - true if it is iterable
     */
    function isIterable(arg) {
        return (
            typeof arg === 'object' &&
            arg !== null &&
            Symbol.iterator in arg &&
            'next' in arg &&
            typeof arg.next === 'function'
        );
    }

    return {
        isNumeric,
        isArrayOfStrings,
        isArrayOfNumbers,
        createSequence,
        isSequence,
        toSequence,
        isFunction,
        isLambda,
        isIterable,
        getFunctionArity
    };
})();

module.exports = utils;
