import { errorCodes } from "./constants";

/**
 *
 * @param {Object} arg - expression to test
 * @returns {boolean} - true if it is a function (lambda or built-in)
 */
export function isFunction(arg) {
    return (arg && (arg._jsonata_function === true || arg._jsonata_lambda === true)) || typeof arg === "function";
}

/**
 * Tests whether arg is a lambda function
 * @param {*} arg - the value to test
 * @returns {boolean} - true if it is a lambda function
 */
export function isLambda(arg) {
    return arg && arg._jsonata_lambda === true;
}

/**
 * @param {Object} arg - expression to test
 * @returns {boolean} - true if it is a generator i.e. the result from calling a
 * generator function
 */
export function isGenerator(arg) {
    return (
        typeof arg === "object" &&
        arg !== null &&
        Symbol.iterator in arg &&
        typeof arg[Symbol.iterator] === "function" &&
        "next" in arg &&
        typeof arg.next === "function"
    );
}

/**
 * Check if value is a finite number
 * @param {float} n - number to evaluate
 * @returns {boolean} True if n is a finite number
 */
export function isNumeric(n) {
    var isNum = false;
    if (typeof n === "number") {
        // TODO: This used to be num = parseFloat(n)...but I didn't see the point of that.
        var num = n;
        isNum = !isNaN(num);
        if (isNum && !isFinite(num)) {
            throw {
                code: "D1001",
                value: n,
                stack: new Error().stack,
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
export function isArrayOfStrings(arg) {
    var result = false;
    /* istanbul ignore else */
    if (Array.isArray(arg)) {
        result =
            arg.filter(function(item) {
                return typeof item !== "string";
            }).length === 0;
    }
    return result;
}

/**
 * Returns true if the arg is an array of numbers
 * @param {*} arg - the item to test
 * @returns {boolean} True if arg is an array of numbers
 */
export function isArrayOfNumbers(arg) {
    var result = false;
    if (Array.isArray(arg)) {
        result =
            arg.filter(function(item) {
                return !isNumeric(item);
            }).length === 0;
    }
    return result;
}

/**
 * Returns a flattened array
 * @param {Array} arg - the array to be flatten
 * @param {Array} flattened - carries the flattened array - if not defined, will initialize to []
 * @returns {Array} - the flattened array
 */
export function flatten(arg, flattened?) {
    if (typeof flattened === "undefined") {
        flattened = [];
    }
    if (Array.isArray(arg)) {
        arg.forEach(function(item) {
            flatten(item, flattened);
        });
    } else {
        flattened.push(arg);
    }
    return flattened;
}

/**
 * Create frame
 * @param {Object} enclosingEnvironment - Enclosing environment
 * @returns {{bind: bind, lookup: lookup}} Created frame
 */
export function createFrame(enclosingEnvironment) {
    var bindings = {};
    return {
        bind: function(name, value) {
            bindings[name] = value;
        },
        lookup: function(name) {
            var value;
            if (bindings.hasOwnProperty(name)) {
                value = bindings[name];
            } else if (enclosingEnvironment) {
                value = enclosingEnvironment.lookup(name);
            }
            return value;
        },
    };
}

/**
 * Create an empty sequence to contain query results
 * @returns {Array} - empty sequence
 */
export function createSequence(foo?) {
    var sequence = toSequence([]);
    if (arguments.length === 1) {
        sequence.push(arguments[0]);
    }
    return sequence;
}

/**
 * Converts an array to a result sequence (by adding special properties)
 * @param {Array} arr - the array to convert
 * @returns {*} - the sequence
 */
export function toSequence(arr) {
    Object.defineProperty(arr, "sequence", {
        enumerable: false,
        configurable: false,
        get: function() {
            return true;
        },
    });
    Object.defineProperty(arr, "keepSingleton", {
        enumerable: false,
        configurable: false,
        writable: true,
        value: false,
    });
    Object.defineProperty(arr, "value", {
        enumerable: false,
        configurable: false,
        get: function() {
            return function(this: typeof arr) {
                switch (this.length) {
                    case 0:
                        return undefined;
                    case 1:
                        return this.keepSingleton ? this : this[0];
                    default:
                        return this;
                }
            };
        },
    });
    return arr;
}

/**
 * lookup a message template from the catalog and substitute the inserts
 * @param {string} err - error code to lookup
 * @returns {string} message
 */
export function lookupMessage(err) {
    var message = "Unknown error";
    if (typeof err.message !== "undefined") {
        message = err.message;
    }
    var template = errorCodes[err.code];
    if (typeof template !== "undefined") {
        // if there are any handlebars, replace them with the field references
        // triple braces - replace with value
        // double braces - replace with json stringified value
        message = template.replace(/\{\{\{([^}]+)}}}/g, function() {
            return err[arguments[1]];
        });
        message = message.replace(/\{\{([^}]+)}}/g, function() {
            return JSON.stringify(err[arguments[1]]);
        });
    }
    return message;
}

/**
 * Protect the process/browser from a runnaway expression
 * i.e. Infinite loop (tail recursion), or excessive stack growth
 *
 * @param {Object} expr - expression to protect
 * @param {Number} timeout - max time in ms
 * @param {Number} maxDepth - max stack depth
 */
export function timeboxExpression(expr, timeout, maxDepth) {
    var depth = 0;
    var time = Date.now();

    var checkRunnaway = function() {
        if (depth > maxDepth) {
            // stack too deep
            throw {
                message:
                    "Stack overflow error: Check for non-terminating recursive function.  Consider rewriting as tail-recursive.",
                stack: new Error().stack,
                code: "U1001"
            };
        }
        if (Date.now() - time > timeout) {
            // expression has run for too long
            throw {
                message: "Expression evaluation timeout: Check for infinite loop",
                stack: new Error().stack,
                code: "U1001"
            };
        }
    };

    // register callbacks
    expr.assign("__evaluate_entry", function() {
        depth++;
        checkRunnaway();
    });
    expr.assign("__evaluate_exit", function() {
        depth--;
        checkRunnaway();
    });
}

// Polyfill
/* istanbul ignore next */
Number.isInteger =
    Number.isInteger ||
    function(value) {
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    };
