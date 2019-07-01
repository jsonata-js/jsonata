/**
 * © Copyright IBM Corp. 2016, 2017 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

/**
 * @module JSONata
 * @description JSON query and transformation language
 */

var datetime = require('./datetime');
var fn = require('./functions');
var utils = require('./utils');
var parser = require('./parser');
var parseSignature = require('./signature');

/**
 * jsonata
 * @function
 * @param {Object} expr - JSONata expression
 * @returns {{evaluate: evaluate, assign: assign}} Evaluated expression
 */
var jsonata = (function() {
    'use strict';

    var isNumeric = utils.isNumeric;
    var isArrayOfStrings = utils.isArrayOfStrings;
    var isArrayOfNumbers = utils.isArrayOfNumbers;
    var createSequence = utils.createSequence;
    var isSequence = utils.isSequence;
    var isFunction = utils.isFunction;
    var isLambda = utils.isLambda;
    var isIterable = utils.isIterable;
    var getFunctionArity = utils.getFunctionArity;

    // Start of Evaluator code

    var staticFrame = createFrame(null);

    /**
     * Evaluate expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluate(expr, input, environment) {
        var result;

        var entryCallback = environment.lookup('__evaluate_entry');
        if(entryCallback) {
            entryCallback(expr, input, environment);
        }

        switch (expr.type) {
            case 'path':
                result = yield * evaluatePath(expr, input, environment);
                break;
            case 'binary':
                result = yield * evaluateBinary(expr, input, environment);
                break;
            case 'unary':
                result = yield * evaluateUnary(expr, input, environment);
                break;
            case 'name':
                result = evaluateName(expr, input, environment);
                break;
            case 'string':
            case 'number':
            case 'value':
                result = evaluateLiteral(expr, input, environment);
                break;
            case 'wildcard':
                result = evaluateWildcard(expr, input, environment);
                break;
            case 'descendant':
                result = evaluateDescendants(expr, input, environment);
                break;
            case 'condition':
                result = yield * evaluateCondition(expr, input, environment);
                break;
            case 'block':
                result = yield * evaluateBlock(expr, input, environment);
                break;
            case 'bind':
                result = yield * evaluateBindExpression(expr, input, environment);
                break;
            case 'regex':
                result = evaluateRegex(expr, input, environment);
                break;
            case 'function':
                result = yield * evaluateFunction(expr, input, environment);
                break;
            case 'variable':
                result = evaluateVariable(expr, input, environment);
                break;
            case 'lambda':
                result = evaluateLambda(expr, input, environment);
                break;
            case 'partial':
                result = yield * evaluatePartialApplication(expr, input, environment);
                break;
            case 'apply':
                result = yield * evaluateApplyExpression(expr, input, environment);
                break;
            case 'sort':
                result = yield * evaluateSortExpression(expr, input, environment);
                break;
            case 'transform':
                result = evaluateTransformExpression(expr, input, environment);
                break;
        }

        if(environment.async &&
          (typeof result === 'undefined' || result === null || typeof result.then !== 'function')) {
            result = Promise.resolve(result);
        }
        if(environment.async && typeof result.then === 'function' && expr.nextFunction && typeof result[expr.nextFunction] === 'function') {
            // although this is a 'thenable', it is chaining a different function
            // so don't yield since yielding will trigger the .then()
        } else {
            result = yield result;
        }


        if (expr.hasOwnProperty('predicate')) {
            result = yield * applyPredicates(expr.predicate, result, environment);

        }
        if (expr.hasOwnProperty('group')) {
            result = yield * evaluateGroupExpression(expr.group, result, environment);
        }

        var exitCallback = environment.lookup('__evaluate_exit');
        if(exitCallback) {
            exitCallback(expr, input, environment, result);
        }

        if(result && isSequence(result)) {
            if(expr.keepArray) {
                result.keepSingleton = true;
            }
            if(result.length === 0) {
                result = undefined;
            } else if(result.length === 1) {
                result =  result.keepSingleton ? result : result[0];
            }

        }

        return result;
    }

    /**
     * Evaluate path expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluatePath(expr, input, environment) {
        var inputSequence;
        // expr is an array of steps
        // if the first step is a variable reference ($...), including root reference ($$),
        //   then the path is absolute rather than relative
        if (expr.steps[0].type === 'variable') {
            inputSequence = createSequence(input);  // dummy singleton sequence for first (absolute) step
        } else if (Array.isArray(input)) {
            inputSequence = input;
        } else {
            // if input is not an array, make it so
            inputSequence = createSequence(input);
        }

        var resultSequence;

        // evaluate each step in turn
        for(var ii = 0; ii < expr.steps.length; ii++) {
            var step = expr.steps[ii];

            // if the first step is an explicit array constructor, then just evaluate that (i.e. don't iterate over a context array)
            if(ii === 0 && step.consarray) {
                resultSequence = yield * evaluate(step, inputSequence, environment);
                if(!Array.isArray(resultSequence)) {
                    resultSequence = createSequence(resultSequence);
                }
            } else {
                resultSequence = yield * evaluateStep(step, inputSequence, environment, ii === expr.steps.length - 1);
            }

            if(typeof resultSequence === 'undefined' || resultSequence.length === 0) {
                break;
            }
            inputSequence = resultSequence;
        }

        if(expr.keepSingletonArray) {
            resultSequence.keepSingleton = true;
        }

        return resultSequence;
    }

    /**
     * Evaluate a step within a path
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @param {boolean} lastStep - flag the last step in a path
     * @returns {*} Evaluated input data
     */
    function* evaluateStep(expr, input, environment, lastStep) {
        var result = createSequence();

        for(var ii = 0; ii < input.length; ii++) {
            var res = yield * evaluate(expr, input[ii], environment);
            if(typeof res !== 'undefined') {
                result.push(res);
            }
        }

        var resultSequence = createSequence();
        if(lastStep && result.length === 1 && Array.isArray(result[0]) && !isSequence(result[0])) {
            resultSequence = result[0];
        } else {
            // flatten the sequence
            result.forEach(function(res) {
                if (!Array.isArray(res) || res.cons) {
                    // it's not an array - just push into the result sequence
                    resultSequence.push(res);
                } else {
                    // res is a sequence - flatten it into the parent sequence
                    Array.prototype.push.apply(resultSequence, res);
                }
            });
        }

        return resultSequence;
    }

    /**
     * Apply predicates to input data
     * @param {Object} predicates - Predicates
     * @param {Object} input - Input data to apply predicates against
     * @param {Object} environment - Environment
     * @returns {*} Result after applying predicates
     */
    function* applyPredicates(predicates, input, environment) {
        var inputSequence = input;
        // lhs potentially holds an array
        // we want to iterate over the array, and only keep the items that are
        // truthy when applied to the predicate.
        // if the predicate evaluates to an integer, then select that index

        var results = createSequence();
        for(var ii = 0; ii < predicates.length; ii++) {
            var predicate = predicates[ii];
            // if it's not an array, turn it into one
            // since in XPath >= 2.0 an item is equivalent to a singleton sequence of that item
            // if input is not an array, make it so
            if (!Array.isArray(inputSequence)) {
                inputSequence = createSequence(inputSequence);
            }
            results = createSequence();
            if (predicate.type === 'number') {
                var index = Math.floor(predicate.value);  // round it down
                if (index < 0) {
                    // count in from end of array
                    index = inputSequence.length + index;
                }
                results = inputSequence[index];
            } else {
                results = yield * evaluateFilter(predicate, inputSequence, environment);
            }
            inputSequence = results;
        }
        return results;
    }

    /**
     * Apply filter predicate to input data
     * @param {Object} predicate - filter expression
     * @param {Object} input - Input data to apply predicates against
     * @param {Object} environment - Environment
     * @returns {*} Result after applying predicates
     */
    function* evaluateFilter(predicate, input, environment) {
        var results = createSequence();
        for(var index = 0; index < input.length; index++) {
            var item = input[index];
            var res = yield * evaluate(predicate, item, environment);
            if (isNumeric(res)) {
                res = [res];
            }
            if(isArrayOfNumbers(res)) {
                res.forEach(function(ires) {
                    // round it down
                    var ii = Math.floor(ires);
                    if (ii < 0) {
                        // count in from end of array
                        ii = input.length + ii;
                    }
                    if (ii === index) {
                        results.push(item);
                    }
                });
            } else if (fn.boolean(res)) { // truthy
                results.push(item);
            }
        }
        return results;
    }

    /**
     * Evaluate binary expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function * evaluateBinary(expr, input, environment) {
        var result;
        var lhs = yield * evaluate(expr.lhs, input, environment);
        var rhs = yield * evaluate(expr.rhs, input, environment);
        var op = expr.value;

        try {
            switch (op) {
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    result = evaluateNumericExpression(lhs, rhs, op);
                    break;
                case '=':
                case '!=':
                    result = evaluateEqualityExpression(lhs, rhs, op);
                    break
                case '<':
                case '<=':
                case '>':
                case '>=':
                    result = evaluateComparisonExpression(lhs, rhs, op);
                    break;
                case '&':
                    result = evaluateStringConcat(lhs, rhs);
                    break;
                case 'and':
                case 'or':
                    result = evaluateBooleanExpression(lhs, rhs, op);
                    break;
                case '..':
                    result = evaluateRangeExpression(lhs, rhs);
                    break;
                case 'in':
                    result = evaluateIncludesExpression(lhs, rhs);
                    break;
            }
        } catch(err) {
            err.position = expr.position;
            err.token = op;
            throw err;
        }
        return result;
    }

    /**
     * Evaluate unary expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateUnary(expr, input, environment) {
        var result;

        switch (expr.value) {
            case '-':
                result = yield * evaluate(expr.expression, input, environment);
                if(typeof result === 'undefined') {
                    result = undefined;
                } else if (isNumeric(result)) {
                    result = -result;
                } else {
                    throw {
                        code: "D1002",
                        stack: (new Error()).stack,
                        position: expr.position,
                        token: expr.value,
                        value: result
                    };
                }
                break;
            case '[':
                // array constructor - evaluate each item
                result = [];
                for(var ii = 0; ii < expr.expressions.length; ii++) {
                    var item = expr.expressions[ii];
                    var value = yield * evaluate(item, input, environment);
                    if (typeof value !== 'undefined') {
                        if(item.value === '[') {
                            result.push(value);
                        } else {
                            result = fn.append(result, value);
                        }
                    }
                }
                if(expr.consarray) {
                    Object.defineProperty(result, 'cons', {
                        enumerable: false,
                        configurable: false,
                        value: true
                    });
                }
                break;
            case '{':
                // object constructor - apply grouping
                result = yield * evaluateGroupExpression(expr, input, environment);
                break;

        }
        return result;
    }

    /**
     * Evaluate name object against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function evaluateName(expr, input, environment) {
        // lookup the 'name' item in the input
        return fn.lookup(input, expr.value);
    }

    /**
     * Evaluate literal against input data
     * @param {Object} expr - JSONata expression
     * @returns {*} Evaluated input data
     */
    function evaluateLiteral(expr) {
        return expr.value;
    }

    /**
     * Evaluate wildcard against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @returns {*} Evaluated input data
     */
    function evaluateWildcard(expr, input) {
        var results = createSequence();
        if (input !== null && typeof input === 'object') {
            Object.keys(input).forEach(function (key) {
                var value = input[key];
                if(Array.isArray(value)) {
                    value = flatten(value);
                    results = fn.append(results, value);
                } else {
                    results.push(value);
                }
            });
        }

        //        result = normalizeSequence(results);
        return results;
    }

    /**
     * Returns a flattened array
     * @param {Array} arg - the array to be flatten
     * @param {Array} flattened - carries the flattened array - if not defined, will initialize to []
     * @returns {Array} - the flattened array
     */
    function flatten(arg, flattened) {
        if(typeof flattened === 'undefined') {
            flattened = [];
        }
        if(Array.isArray(arg)) {
            arg.forEach(function (item) {
                flatten(item, flattened);
            });
        } else {
            flattened.push(arg);
        }
        return flattened;
    }

    /**
     * Evaluate descendants against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @returns {*} Evaluated input data
     */
    function evaluateDescendants(expr, input) {
        var result;
        var resultSequence = createSequence();
        if (typeof input !== 'undefined') {
            // traverse all descendants of this object/array
            recurseDescendants(input, resultSequence);
            if (resultSequence.length === 1) {
                result = resultSequence[0];
            } else {
                result = resultSequence;
            }
        }
        return result;
    }

    /**
     * Recurse through descendants
     * @param {Object} input - Input data
     * @param {Object} results - Results
     */
    function recurseDescendants(input, results) {
        // this is the equivalent of //* in XPath
        if (!Array.isArray(input)) {
            results.push(input);
        }
        if (Array.isArray(input)) {
            input.forEach(function (member) {
                recurseDescendants(member, results);
            });
        } else if (input !== null && typeof input === 'object') {
            Object.keys(input).forEach(function (key) {
                recurseDescendants(input[key], results);
            });
        }
    }

    /**
     * Evaluate numeric expression against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @param {Object} op - opcode
     * @returns {*} Result
     */
    function evaluateNumericExpression(lhs, rhs, op) {
        var result;

        if (typeof lhs !== 'undefined' && !isNumeric(lhs)) {
            throw {
                code: "T2001",
                stack: (new Error()).stack,
                value: lhs
            };
        }
        if (typeof rhs !== 'undefined' && !isNumeric(rhs)) {
            throw {
                code: "T2002",
                stack: (new Error()).stack,
                value: rhs
            };
        }

        if (typeof lhs === 'undefined' || typeof rhs === 'undefined') {
            // if either side is undefined, the result is undefined
            return result;
        }

        switch (op) {
            case '+':
                result = lhs + rhs;
                break;
            case '-':
                result = lhs - rhs;
                break;
            case '*':
                result = lhs * rhs;
                break;
            case '/':
                result = lhs / rhs;
                break;
            case '%':
                result = lhs % rhs;
                break;
        }
        return result;
    }

    /**
     * Evaluate equality expression against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @param {Object} op - opcode
     * @returns {*} Result
     */
    function evaluateEqualityExpression(lhs, rhs, op) {
        var result;

        // type checks
        var ltype = typeof lhs;
        var rtype = typeof rhs;

        if (ltype === 'undefined' || rtype === 'undefined') {
            // if either side is undefined, the result is false
            return false;
        }

        switch (op) {
            case '=':
                result = lhs === rhs;
                break;
            case '!=':
                result = (lhs !== rhs);
                break;
        }
        return result;
    }

    /**
     * Evaluate comparison expression against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @param {Object} op - opcode
     * @returns {*} Result
     */
    function evaluateComparisonExpression(lhs, rhs, op) {
        var result;

        // type checks
        var ltype = typeof lhs;
        var rtype = typeof rhs;

        var lcomparable = (ltype === 'undefined' || ltype === 'string' || ltype === 'number');
        var rcomparable = (rtype === 'undefined' || rtype === 'string' || rtype === 'number');

        // if either aa or bb are not comparable (string or numeric) values, then throw an error
        if (!lcomparable || !rcomparable) {
            throw {
                code: "T2010",
                stack: (new Error()).stack,
                value: !(ltype === 'string' || ltype === 'number') ? lhs : rhs
            };
        }

        // if either side is undefined, the result is undefined
        if (ltype === 'undefined' || rtype === 'undefined') {
            return undefined;
        }

        //if aa and bb are not of the same type
        if (ltype !== rtype) {
            throw {
                code: "T2009",
                stack: (new Error()).stack,
                value: lhs,
                value2: rhs
            };
        }

        switch (op) {
            case '<':
                result = lhs < rhs;
                break;
            case '<=':
                result = lhs <= rhs;
                break;
            case '>':
                result = lhs > rhs;
                break;
            case '>=':
                result = lhs >= rhs;
                break;
        }
        return result;
    }

    /**
     * Inclusion operator - in
     *
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @returns {boolean} - true if lhs is a member of rhs
     */
    function evaluateIncludesExpression(lhs, rhs) {
        var result = false;

        if (typeof lhs === 'undefined' || typeof rhs === 'undefined') {
            // if either side is undefined, the result is false
            return false;
        }

        if(!Array.isArray(rhs)) {
            rhs = [rhs];
        }

        for(var i = 0; i < rhs.length; i++) {
            if(rhs[i] === lhs) {
                result = true;
                break;
            }
        }

        return result;
    }

    /**
     * Evaluate boolean expression against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @param {Object} op - opcode
     * @returns {*} Result
     */
    function evaluateBooleanExpression(lhs, rhs, op) {
        var result;

        var lBool = fn.boolean(lhs);
        var rBool = fn.boolean(rhs);

        if (typeof  lBool === 'undefined') {
            lBool = false;
        }

        if (typeof  rBool === 'undefined') {
            rBool = false;
        }

        switch (op) {
            case 'and':
                result = lBool && rBool;
                break;
            case 'or':
                result = lBool || rBool;
                break;
        }
        return result;
    }

    /**
     * Evaluate string concatenation against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @returns {string|*} Concatenated string
     */
    function evaluateStringConcat(lhs, rhs) {
        var result;

        var lstr = '';
        var rstr = '';
        if (typeof lhs !== 'undefined') {
            lstr = fn.string(lhs);
        }
        if (typeof rhs !== 'undefined') {
            rstr = fn.string(rhs);
        }

        result = lstr.concat(rstr);
        return result;
    }

    /**
     * Evaluate group expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {{}} Evaluated input data
     */
    function* evaluateGroupExpression(expr, input, environment) {
        var result = {};
        var groups = {};
        // group the input sequence by 'key' expression
        if (!Array.isArray(input)) {
            input = createSequence(input);
        }

        for(var itemIndex = 0; itemIndex < input.length; itemIndex++) {
            var item = input[itemIndex];
            for(var pairIndex = 0; pairIndex < expr.lhs.length; pairIndex++) {
                var pair = expr.lhs[pairIndex];
                var key = yield * evaluate(pair[0], item, environment);
                // key has to be a string
                if (typeof  key !== 'string') {
                    throw {
                        code: "T1003",
                        stack: (new Error()).stack,
                        position: expr.position,
                        value: key
                    };
                }
                var entry = {data: item, exprIndex: pairIndex};
                if (groups.hasOwnProperty(key)) {
                    // a value already exists in this slot
                    if(groups[key].exprIndex !== pairIndex) {
                        // this key has been generated by another expression in this group
                        // when multiple key expressions evaluate to the same key, then error D1009 must be thrown
                        throw {
                            code: "D1009",
                            stack: (new Error()).stack,
                            position: expr.position,
                            value: key
                        };
                    }

                    // append it as an array
                    groups[key].data = fn.append(groups[key].data, item);
                } else {
                    groups[key] = entry;
                }
            }
        }

        // iterate over the groups to evaluate the 'value' expression
        for (key in groups) {
            entry = groups[key];
            var value = yield * evaluate(expr.lhs[entry.exprIndex][1], entry.data, environment);
            if(typeof value !== 'undefined') {
                result[key] = value;
            }
        }

        return result;
    }

    /**
     * Evaluate range expression against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @returns {Array} Resultant array
     */
    function evaluateRangeExpression(lhs, rhs) {
        var result;

        if (typeof lhs !== 'undefined' && !Number.isInteger(lhs)) {
            throw {
                code: "T2003",
                stack: (new Error()).stack,
                value: lhs
            };
        }
        if (typeof rhs !== 'undefined' && !Number.isInteger(rhs)) {
            throw {
                code: "T2004",
                stack: (new Error()).stack,
                value: rhs
            };
        }

        if (typeof lhs === 'undefined' || typeof rhs === 'undefined') {
            // if either side is undefined, the result is undefined
            return result;
        }

        if (lhs > rhs) {
            // if the lhs is greater than the rhs, return undefined
            return result;
        }

        // limit the size of the array to ten million entries (1e7)
        // this is an implementation defined limit to protect against
        // memory and performance issues.  This value may increase in the future.
        var size = rhs - lhs + 1;
        if(size > 1e7) {
            throw {
                code: "D2014",
                stack: (new Error()).stack,
                value: size
            };
        }

        result = new Array(size);
        for (var item = lhs, index = 0; item <= rhs; item++, index++) {
            result[index] = item;
        }
        result.sequence = true;
        return result;
    }

    /**
     * Evaluate bind expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateBindExpression(expr, input, environment) {
        // The RHS is the expression to evaluate
        // The LHS is the name of the variable to bind to - should be a VARIABLE token (enforced by parser)
        var value = yield * evaluate(expr.rhs, input, environment);
        environment.bind(expr.lhs.value, value);
        return value;
    }

    /**
     * Evaluate condition against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateCondition(expr, input, environment) {
        var result;
        var condition = yield * evaluate(expr.condition, input, environment);
        if (fn.boolean(condition)) {
            result = yield * evaluate(expr.then, input, environment);
        } else if (typeof expr.else !== 'undefined') {
            result = yield * evaluate(expr.else, input, environment);
        }
        return result;
    }

    /**
     * Evaluate block against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateBlock(expr, input, environment) {
        var result;
        // create a new frame to limit the scope of variable assignments
        // TODO, only do this if the post-parse stage has flagged this as required
        var frame = createFrame(environment);
        // invoke each expression in turn
        // only return the result of the last one
        for(var ii = 0; ii < expr.expressions.length; ii++) {
            result = yield * evaluate(expr.expressions[ii], input, frame);
        }

        return result;
    }

    /**
     * Prepare a regex
     * @param {Object} expr - expression containing regex
     * @returns {Function} Higher order function representing prepared regex
     */
    function evaluateRegex(expr) {
        var re = new RegExp(expr.value);
        var closure = function(str) {
            var result;
            var match = re.exec(str);
            if(match !== null) {
                result = {
                    match: match[0],
                    start: match.index,
                    end: match.index + match[0].length,
                    groups: []
                };
                if(match.length > 1) {
                    for(var i = 1; i < match.length; i++) {
                        result.groups.push(match[i]);
                    }
                }
                result.next = function() {
                    if(re.lastIndex >= str.length) {
                        return undefined;
                    } else {
                        var next = closure(str);
                        if(next && next.match === '') {
                            // matches zero length string; this will never progress
                            throw {
                                code: "D1004",
                                stack: (new Error()).stack,
                                position: expr.position,
                                value: expr.value.source
                            };
                        }
                        return next;
                    }
                };
            }

            return result;
        };
        return closure;
    }

    /**
     * Evaluate variable against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function evaluateVariable(expr, input, environment) {
        // lookup the variable value in the environment
        var result;
        // if the variable name is empty string, then it refers to context value
        if (expr.value === '') {
            result = input;
        } else {
            result = environment.lookup(expr.value);
        }
        return result;
    }

    /**
     * sort / order-by operator
     * @param {Object} expr - AST for operator
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Ordered sequence
     */
    function* evaluateSortExpression(expr, input, environment) {
        var result;

        // evaluate the lhs, then sort the results in order according to rhs expression
        var lhs = yield * evaluate(expr.lhs, input, environment);

        // sort the lhs array
        // use comparator function
        var comparator = function*(a, b) { // eslint-disable-line require-yield
            // expr.rhs is an array of order-by in priority order
            var comp = 0;
            for(var index = 0; comp === 0 && index < expr.rhs.length; index++) {
                var term = expr.rhs[index];
                //evaluate the rhs expression in the context of a
                var aa = yield * evaluate(term.expression, a, environment);
                //evaluate the rhs expression in the context of b
                var bb = yield * evaluate(term.expression, b, environment);

                // type checks
                var atype = typeof aa;
                var btype = typeof bb;
                // undefined should be last in sort order
                if(atype === 'undefined') {
                    // swap them, unless btype is also undefined
                    comp = (btype === 'undefined') ? 0 : 1;
                    continue;
                }
                if(btype === 'undefined') {
                    comp = -1;
                    continue;
                }

                // if aa or bb are not string or numeric values, then throw an error
                if(!(atype === 'string' || atype === 'number') || !(btype === 'string' || btype === 'number')) {
                    throw {
                        code: "T2008",
                        stack: (new Error()).stack,
                        position: expr.position,
                        value: !(atype === 'string' || atype === 'number') ? aa : bb
                    };
                }

                //if aa and bb are not of the same type
                if(atype !== btype) {
                    throw {
                        code: "T2007",
                        stack: (new Error()).stack,
                        position: expr.position,
                        value: aa,
                        value2: bb
                    };
                }
                if(aa === bb) {
                    // both the same - move on to next term
                    continue;
                } else if (aa < bb) {
                    comp = -1;
                } else {
                    comp = 1;
                }
                if(term.descending === true) {
                    comp = -comp;
                }
            }
            // only swap a & b if comp equals 1
            return comp === 1;
        };

        var focus = {
            environment: environment,
            input: input
        };
        // the `focus` is passed in as the `this` for the invoked function
        result = yield * fn.sort.apply(focus, [lhs, comparator]);

        return result;
    }

    /**
     * create a transformer function
     * @param {Object} expr - AST for operator
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} tranformer function
     */
    function evaluateTransformExpression(expr, input, environment) {
        // create a function to implement the transform definition
        var transformer = function*(obj) { // signature <(oa):o>
            // undefined inputs always return undefined
            if(typeof obj === 'undefined') {
                return undefined;
            }

            // this function returns a copy of obj with changes specified by the pattern/operation
            var cloneFunction = environment.lookup('clone');
            if(!isFunction(cloneFunction)) {
                // throw type error
                throw {
                    code: "T2013",
                    stack: (new Error()).stack,
                    position: expr.position
                };
            }
            var result = yield * apply(cloneFunction, [obj], null, environment);
            var matches = yield * evaluate(expr.pattern, result, environment);
            if(typeof matches !== 'undefined') {
                if(!Array.isArray(matches)) {
                    matches = [matches];
                }
                for(var ii = 0; ii < matches.length; ii++) {
                    var match = matches[ii];
                    // evaluate the update value for each match
                    var update = yield * evaluate(expr.update, match, environment);
                    // update must be an object
                    var updateType = typeof update;
                    if(updateType !== 'undefined') {
                        if(updateType !== 'object' || update === null || Array.isArray(update)) {
                            // throw type error
                            throw {
                                code: "T2011",
                                stack: (new Error()).stack,
                                position: expr.update.position,
                                value: update
                            };
                        }
                        // merge the update
                        for(var prop in update) {
                            match[prop] = update[prop];
                        }
                    }

                    // delete, if specified, must be an array of strings (or single string)
                    if(typeof expr.delete !== 'undefined') {
                        var deletions = yield * evaluate(expr.delete, match, environment);
                        if(typeof deletions !== 'undefined') {
                            var val = deletions;
                            if (!Array.isArray(deletions)) {
                                deletions = [deletions];
                            }
                            if (!isArrayOfStrings(deletions)) {
                                // throw type error
                                throw {
                                    code: "T2012",
                                    stack: (new Error()).stack,
                                    position: expr.delete.position,
                                    value: val
                                };
                            }
                            for (var jj = 0; jj < deletions.length; jj++) {
                                delete match[deletions[jj]];
                            }
                        }
                    }
                }
            }

            return result;
        };

        return defineFunction(transformer, '<(oa):o>');
    }

    var chainAST = parser('function($f, $g) { function($x){ $g($f($x)) } }');

    /**
     * Apply the function on the RHS using the sequence on the LHS as the first argument
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateApplyExpression(expr, input, environment) {
        var result;


        var lhs = yield * evaluate(expr.lhs, input, environment);
        if(expr.rhs.type === 'function') {
            // this is a function _invocation_; invoke it with lhs expression as the first argument
            result = yield * evaluateFunction(expr.rhs, input, environment, { context: lhs });
        } else {
            var func = yield * evaluate(expr.rhs, input, environment);

            if(!isFunction(func)) {
                throw {
                    code: "T2006",
                    stack: (new Error()).stack,
                    position: expr.position,
                    value: func
                };
            }

            if(isFunction(lhs)) {
                // this is function chaining (func1 ~> func2)
                // λ($f, $g) { λ($x){ $g($f($x)) } }
                var chain = yield * evaluate(chainAST, null, environment);
                result = yield * apply(chain, [lhs, func], null, environment);
            } else {
                result = yield * apply(func, [lhs], null, environment);
            }

        }

        return result;
    }

    /**
     * Evaluate function against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluateFunction(expr, input, environment, applyto) {
        var result;

        // create the procedure
        // can't assume that expr.procedure is a lambda type directly
        // could be an expression that evaluates to a function (e.g. variable reference, parens expr etc.
        // evaluate it generically first, then check that it is a function.  Throw error if not.
        var proc = yield * evaluate(expr.procedure, input, environment);

        if (typeof proc === 'undefined' && expr.procedure.type === 'path' && environment.lookup(expr.procedure.steps[0].value)) {
            // help the user out here if they simply forgot the leading $
            throw {
                code: "T1005",
                stack: (new Error()).stack,
                position: expr.position,
                token: expr.procedure.steps[0].value
            };
        }

        var evaluatedArgs = [];
        if(typeof applyto !== 'undefined') {
            evaluatedArgs.push(applyto.context);
        }
        // eager evaluation - evaluate the arguments
        for (var jj = 0; jj < expr.arguments.length; jj++) {
            const arg = yield* evaluate(expr.arguments[jj], input, environment);
            if(isFunction(arg)) {
                // wrap this in a closure
                const closure = function* (...params) {
                    // invoke func
                    return yield * apply(arg, params, null, environment);
                };
                closure.arity = getFunctionArity(arg);
                evaluatedArgs.push(closure);
            } else {
                evaluatedArgs.push(arg);
            }
        }
        // apply the procedure
        var procName = expr.procedure.type === 'path' ? expr.procedure.steps[0].value : expr.procedure.value;
        try {
            if(typeof proc === 'object') {
                proc.token = procName;
                proc.position = expr.position;
            }
            result = yield * apply(proc, evaluatedArgs, input, environment);
        } catch (err) {
            if(!err.position) {
                // add the position field to the error
                err.position = expr.position;
            }
            if (!err.token) {
                // and the function identifier
                err.token = procName;
            }
            throw err;
        }
        return result;
    }

    /**
     * Apply procedure or function
     * @param {Object} proc - Procedure
     * @param {Array} args - Arguments
     * @param {Object} input - input
     * @param {Object} environment - environment
     * @returns {*} Result of procedure
     */
    function* apply(proc, args, input, environment) {
        var result;
        result = yield * applyInner(proc, args, input, environment);
        while(isLambda(result) && result.thunk === true) {
            // trampoline loop - this gets invoked as a result of tail-call optimization
            // the function returned a tail-call thunk
            // unpack it, evaluate its arguments, and apply the tail call
            var next = yield * evaluate(result.body.procedure, result.input, result.environment);
            if(result.body.procedure.type === 'variable') {
                next.token = result.body.procedure.value;
            }
            next.position = result.body.procedure.position;
            var evaluatedArgs = [];
            for(var ii = 0; ii < result.body.arguments.length; ii++) {
                evaluatedArgs.push(yield * evaluate(result.body.arguments[ii], result.input, result.environment));
            }

            result = yield * applyInner(next, evaluatedArgs, input, environment);
        }
        return result;
    }

    /**
     * Apply procedure or function
     * @param {Object} proc - Procedure
     * @param {Array} args - Arguments
     * @param {Object} input - input
     * @param {Object} environment - environment
     * @returns {*} Result of procedure
     */
    function* applyInner(proc, args, input, environment) {
        var result;
        try {
            var validatedArgs = args;
            if (proc) {
                validatedArgs = validateArguments(proc.signature, args, input);
            }

            if (isLambda(proc)) {
                result = yield* applyProcedure(proc, validatedArgs);
            } else if (proc && proc._jsonata_function === true) {
                var focus = {
                    environment: environment,
                    input: input
                };
                // the `focus` is passed in as the `this` for the invoked function
                result = proc.implementation.apply(focus, validatedArgs);
                // `proc.implementation` might be a generator function
                // and `result` might be a generator - if so, yield
                if (isIterable(result)) {
                    result = yield* result;
                }
            } else if (typeof proc === 'function') {
                // typically these are functions that are returned by the invocation of plugin functions
                // the `input` is being passed in as the `this` for the invoked function
                // this is so that functions that return objects containing functions can chain
                // e.g. $func().next().next()
                result = proc.apply(input, validatedArgs);
                /* istanbul ignore next */
                if (isIterable(result)) {
                    result = yield* result;
                }
            } else {
                throw {
                    code: "T1006",
                    stack: (new Error()).stack
                };
            }
        } catch(err) {
            if(proc) {
                if (typeof err.token == 'undefined' && typeof proc.token !== 'undefined') {
                    err.token = proc.token;
                }
                err.position = proc.position;
            }
            throw err;
        }
        return result;
    }

    /**
     * Evaluate lambda against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {{lambda: boolean, input: *, environment: *, arguments: *, body: *}} Evaluated input data
     */
    function evaluateLambda(expr, input, environment) {
        // make a function (closure)
        var procedure = {
            _jsonata_lambda: true,
            input: input,
            environment: environment,
            arguments: expr.arguments,
            signature: expr.signature,
            body: expr.body
        };
        if(expr.thunk === true) {
            procedure.thunk = true;
        }
        procedure.apply = function*(self, args) {
            return yield * apply(procedure, args, input, self.environment);
        };
        return procedure;
    }

    /**
     * Evaluate partial application
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function* evaluatePartialApplication(expr, input, environment) {
        // partially apply a function
        var result;
        // evaluate the arguments
        var evaluatedArgs = [];
        for(var ii = 0; ii < expr.arguments.length; ii++) {
            var arg = expr.arguments[ii];
            if (arg.type === 'operator' && arg.value === '?') {
                evaluatedArgs.push(arg);
            } else {
                evaluatedArgs.push(yield * evaluate(arg, input, environment));
            }
        }
        // lookup the procedure
        var proc = yield * evaluate(expr.procedure, input, environment);
        if (typeof proc === 'undefined' && expr.procedure.type === 'path' && environment.lookup(expr.procedure.steps[0].value)) {
            // help the user out here if they simply forgot the leading $
            throw {
                code: "T1007",
                stack: (new Error()).stack,
                position: expr.position,
                token: expr.procedure.steps[0].value
            };
        }
        if (isLambda(proc)) {
            result = partialApplyProcedure(proc, evaluatedArgs);
        } else if (proc && proc._jsonata_function === true) {
            result = partialApplyNativeFunction(proc.implementation, evaluatedArgs);
        } else if (typeof proc === 'function') {
            result = partialApplyNativeFunction(proc, evaluatedArgs);
        } else {
            throw {
                code: "T1008",
                stack: (new Error()).stack,
                position: expr.position,
                token: expr.procedure.type === 'path' ? expr.procedure.steps[0].value : expr.procedure.value
            };
        }
        return result;
    }

    /**
     * Validate the arguments against the signature validator (if it exists)
     * @param {Function} signature - validator function
     * @param {Array} args - function arguments
     * @param {*} context - context value
     * @returns {Array} - validated arguments
     */
    function validateArguments(signature, args, context) {
        if(typeof signature === 'undefined') {
            // nothing to validate
            return args;
        }
        var validatedArgs = signature.validate(args, context);
        return validatedArgs;
    }

    /**
     * Apply procedure
     * @param {Object} proc - Procedure
     * @param {Array} args - Arguments
     * @returns {*} Result of procedure
     */
    function* applyProcedure(proc, args) {
        var result;
        var env = createFrame(proc.environment);
        proc.arguments.forEach(function (param, index) {
            env.bind(param.value, args[index]);
        });
        if (typeof proc.body === 'function') {
            // this is a lambda that wraps a native function - generated by partially evaluating a native
            result = yield * applyNativeFunction(proc.body, env);
        } else {
            result = yield * evaluate(proc.body, proc.input, env);
        }
        return result;
    }

    /**
     * Partially apply procedure
     * @param {Object} proc - Procedure
     * @param {Array} args - Arguments
     * @returns {{lambda: boolean, input: *, environment: {bind, lookup}, arguments: Array, body: *}} Result of partially applied procedure
     */
    function partialApplyProcedure(proc, args) {
        // create a closure, bind the supplied parameters and return a function that takes the remaining (?) parameters
        var env = createFrame(proc.environment);
        var unboundArgs = [];
        proc.arguments.forEach(function (param, index) {
            var arg = args[index];
            if (arg && arg.type === 'operator' && arg.value === '?') {
                unboundArgs.push(param);
            } else {
                env.bind(param.value, arg);
            }
        });
        var procedure = {
            _jsonata_lambda: true,
            input: proc.input,
            environment: env,
            arguments: unboundArgs,
            body: proc.body
        };
        return procedure;
    }

    /**
     * Partially apply native function
     * @param {Function} native - Native function
     * @param {Array} args - Arguments
     * @returns {{lambda: boolean, input: *, environment: {bind, lookup}, arguments: Array, body: *}} Result of partially applying native function
     */
    function partialApplyNativeFunction(native, args) {
        // create a lambda function that wraps and invokes the native function
        // get the list of declared arguments from the native function
        // this has to be picked out from the toString() value
        var sigArgs = getNativeFunctionArguments(native);
        sigArgs = sigArgs.map(function (sigArg) {
            return '$' + sigArg.trim();
        });
        var body = 'function(' + sigArgs.join(', ') + '){ _ }';

        var bodyAST = parser(body);
        bodyAST.body = native;

        var partial = partialApplyProcedure(bodyAST, args);
        return partial;
    }

    /**
     * Apply native function
     * @param {Object} proc - Procedure
     * @param {Object} env - Environment
     * @returns {*} Result of applying native function
     */
    function* applyNativeFunction(proc, env) {
        var sigArgs = getNativeFunctionArguments(proc);
        // generate the array of arguments for invoking the function - look them up in the environment
        var args = sigArgs.map(function (sigArg) {
            return env.lookup(sigArg.trim());
        });

        var focus = {
            environment: env
        };
        var result = proc.apply(focus, args);
        if(isIterable(result)) {
            result = yield * result;
        }
        return result;
    }

    /**
     * Get native function arguments
     * @param {Function} func - Function
     * @returns {*|Array} Native function arguments
     */
    function getNativeFunctionArguments(func) {
        var signature = func.toString();
        var sigParens = /\(([^)]*)\)/.exec(signature)[1]; // the contents of the parens
        var sigArgs = sigParens.split(',');
        return sigArgs;
    }

    /**
     * Creates a function definition
     * @param {Function} func - function implementation in Javascript
     * @param {string} signature - JSONata function signature definition
     * @returns {{implementation: *, signature: *}} function definition
     */
    function defineFunction(func, signature) {
        var definition = {
            _jsonata_function: true,
            implementation: func
        };
        if(typeof signature !== 'undefined') {
            definition.signature = parseSignature(signature);
        }
        return definition;
    }


    /**
     * parses and evaluates the supplied expression
     * @param {string} expr - expression to evaluate
     * @returns {*} - result of evaluating the expression
     */
    function* functionEval(expr, focus) {
        // undefined inputs always return undefined
        if(typeof expr === 'undefined') {
            return undefined;
        }
        var input = this.input;
        if(typeof focus !== 'undefined') {
            input = focus;
        }

        try {
            var ast = parser(expr, false);
        } catch(err) {
            // error parsing the expression passed to $eval
            populateMessage(err);
            throw {
                stack: (new Error()).stack,
                code: "D3120",
                value: err.message,
                error: err
            };
        }
        try {
            var result = yield* evaluate(ast, input, this.environment);
        } catch(err) {
            // error evaluating the expression passed to $eval
            populateMessage(err);
            throw {
                stack: (new Error()).stack,
                code: "D3121",
                value:err.message,
                error: err
            };
        }

        return result;
    }

    /**
     * Clones an object
     * @param {Object} arg - object to clone (deep copy)
     * @returns {*} - the cloned object
     */
    function functionClone(arg) {
        // undefined inputs always return undefined
        if(typeof arg === 'undefined') {
            return undefined;
        }

        return JSON.parse(fn.string(arg));
    }

    /**
     * Create frame
     * @param {Object} enclosingEnvironment - Enclosing environment
     * @returns {{bind: bind, lookup: lookup}} Created frame
     */
    function createFrame(enclosingEnvironment) {
        var bindings = {};
        return {
            bind: function (name, value) {
                bindings[name] = value;
            },
            lookup: function (name) {
                var value;
                if(bindings.hasOwnProperty(name)) {
                    value = bindings[name];
                } else if (enclosingEnvironment) {
                    value = enclosingEnvironment.lookup(name);
                }
                return value;
            },
            timestamp: enclosingEnvironment ? enclosingEnvironment.timestamp : null,
            async: enclosingEnvironment ? enclosingEnvironment.async : false
        };
    }

    // Function registration
    staticFrame.bind('sum', defineFunction(fn.sum, '<a<n>:n>'));
    staticFrame.bind('count', defineFunction(fn.count, '<a:n>'));
    staticFrame.bind('max', defineFunction(fn.max, '<a<n>:n>'));
    staticFrame.bind('min', defineFunction(fn.min, '<a<n>:n>'));
    staticFrame.bind('average', defineFunction(fn.average, '<a<n>:n>'));
    staticFrame.bind('string', defineFunction(fn.string, '<x-:s>'));
    staticFrame.bind('substring', defineFunction(fn.substring, '<s-nn?:s>'));
    staticFrame.bind('substringBefore', defineFunction(fn.substringBefore, '<s-s:s>'));
    staticFrame.bind('substringAfter', defineFunction(fn.substringAfter, '<s-s:s>'));
    staticFrame.bind('lowercase', defineFunction(fn.lowercase, '<s-:s>'));
    staticFrame.bind('uppercase', defineFunction(fn.uppercase, '<s-:s>'));
    staticFrame.bind('length', defineFunction(fn.length, '<s-:n>'));
    staticFrame.bind('trim', defineFunction(fn.trim, '<s-:s>'));
    staticFrame.bind('pad', defineFunction(fn.pad, '<s-ns?:s>'));
    staticFrame.bind('match', defineFunction(fn.match, '<s-f<s:o>n?:a<o>>'));
    staticFrame.bind('contains', defineFunction(fn.contains, '<s-(sf):b>')); // TODO <s-(sf<s:o>):b>
    staticFrame.bind('replace', defineFunction(fn.replace, '<s-(sf)(sf)n?:s>')); // TODO <s-(sf<s:o>)(sf<o:s>)n?:s>
    staticFrame.bind('split', defineFunction(fn.split, '<s-(sf)n?:a<s>>')); // TODO <s-(sf<s:o>)n?:a<s>>
    staticFrame.bind('join', defineFunction(fn.join, '<a<s>s?:s>'));
    staticFrame.bind('formatNumber', defineFunction(fn.formatNumber, '<n-so?:s>'));
    staticFrame.bind('formatBase', defineFunction(fn.formatBase, '<n-n?:s>'));
    staticFrame.bind('formatInteger', defineFunction(datetime.formatInteger, '<n-s:s>'));
    staticFrame.bind('parseInteger', defineFunction(datetime.parseInteger, '<s-s:n>'));
    staticFrame.bind('number', defineFunction(fn.number, '<(nsb)-:n>'));
    staticFrame.bind('floor', defineFunction(fn.floor, '<n-:n>'));
    staticFrame.bind('ceil', defineFunction(fn.ceil, '<n-:n>'));
    staticFrame.bind('round', defineFunction(fn.round, '<n-n?:n>'));
    staticFrame.bind('abs', defineFunction(fn.abs, '<n-:n>'));
    staticFrame.bind('sqrt', defineFunction(fn.sqrt, '<n-:n>'));
    staticFrame.bind('power', defineFunction(fn.power, '<n-n:n>'));
    staticFrame.bind('random', defineFunction(fn.random, '<:n>'));
    staticFrame.bind('boolean', defineFunction(fn.boolean, '<x-:b>'));
    staticFrame.bind('not', defineFunction(fn.not, '<x-:b>'));
    staticFrame.bind('map', defineFunction(fn.map, '<af>'));
    staticFrame.bind('zip', defineFunction(fn.zip, '<a+>'));
    staticFrame.bind('filter', defineFunction(fn.filter, '<af>'));
    staticFrame.bind('reduce', defineFunction(fn.foldLeft, '<afj?:j>')); // TODO <f<jj:j>a<j>j?:j>
    staticFrame.bind('sift', defineFunction(fn.sift, '<o-f?:o>'));
    staticFrame.bind('keys', defineFunction(fn.keys, '<x-:a<s>>'));
    staticFrame.bind('lookup', defineFunction(fn.lookup, '<x-s:x>'));
    staticFrame.bind('append', defineFunction(fn.append, '<xx:a>'));
    staticFrame.bind('exists', defineFunction(fn.exists, '<x:b>'));
    staticFrame.bind('spread', defineFunction(fn.spread, '<x-:a<o>>'));
    staticFrame.bind('merge', defineFunction(fn.merge, '<a<o>:o>'));
    staticFrame.bind('reverse', defineFunction(fn.reverse, '<a:a>'));
    staticFrame.bind('each', defineFunction(fn.each, '<o-f:a>'));
    staticFrame.bind('sort', defineFunction(fn.sort, '<af?:a>'));
    staticFrame.bind('shuffle', defineFunction(fn.shuffle, '<a:a>'));
    staticFrame.bind('base64encode', defineFunction(fn.base64encode, '<s-:s>'));
    staticFrame.bind('base64decode', defineFunction(fn.base64decode, '<s-:s>'));
    staticFrame.bind('eval', defineFunction(functionEval, '<sx?:x>'));
    staticFrame.bind('toMillis', defineFunction(datetime.toMillis, '<s-s?:n>'));
    staticFrame.bind('fromMillis', defineFunction(datetime.fromMillis, '<n-s?s?:s>'));
    staticFrame.bind('clone', defineFunction(functionClone, '<(oa)-:o>'));

    /**
     * Error codes
     *
     * Sxxxx    - Static errors (compile time)
     * Txxxx    - Type errors
     * Dxxxx    - Dynamic errors (evaluate time)
     *  01xx    - tokenizer
     *  02xx    - parser
     *  03xx    - regex parser
     *  04xx    - function signature parser/evaluator
     *  10xx    - evaluator
     *  20xx    - operators
     *  3xxx    - functions (blocks of 10 for each function)
     */
    var errorCodes = {
        "S0101": "String literal must be terminated by a matching quote",
        "S0102": "Number out of range: {{token}}",
        "S0103": "Unsupported escape sequence: \\{{token}}",
        "S0104": "The escape sequence \\u must be followed by 4 hex digits",
        "S0105": "Quoted property name must be terminated with a backquote (`)",
        "S0106": "Comment has no closing tag",
        "S0201": "Syntax error: {{token}}",
        "S0202": "Expected {{value}}, got {{token}}",
        "S0203": "Expected {{value}} before end of expression",
        "S0204": "Unknown operator: {{token}}",
        "S0205": "Unexpected token: {{token}}",
        "S0206": "Unknown expression type: {{token}}",
        "S0207": "Unexpected end of expression",
        "S0208": "Parameter {{value}} of function definition must be a variable name (start with $)",
        "S0209": "A predicate cannot follow a grouping expression in a step",
        "S0210": "Each step can only have one grouping expression",
        "S0211": "The symbol {{token}} cannot be used as a unary operator",
        "S0212": "The left side of := must be a variable name (start with $)",
        "S0213": "The literal value {{value}} cannot be used as a step within a path expression",
        "S0301": "Empty regular expressions are not allowed",
        "S0302": "No terminating / in regular expression",
        "S0402": "Choice groups containing parameterized types are not supported",
        "S0401": "Type parameters can only be applied to functions and arrays",
        "S0500": "Attempted to evaluate an expression containing syntax error(s)",
        "T0410": "Argument {{index}} of function {{token}} does not match function signature",
        "T0411": "Context value is not a compatible type with argument {{index}} of function {{token}}",
        "T0412": "Argument {{index}} of function {{token}} must be an array of {{type}}",
        "D1001": "Number out of range: {{value}}",
        "D1002": "Cannot negate a non-numeric value: {{value}}",
        "T1003": "Key in object structure must evaluate to a string; got: {{value}}",
        "D1004": "Regular expression matches zero length string",
        "T1005": "Attempted to invoke a non-function. Did you mean ${{{token}}}?",
        "T1006": "Attempted to invoke a non-function",
        "T1007": "Attempted to partially apply a non-function. Did you mean ${{{token}}}?",
        "T1008": "Attempted to partially apply a non-function",
        "D1009": "Multiple key definitions evaluate to same key: {{value}}",
        "T1010": "The matcher function argument passed to function {{token}} does not return the correct object structure",
        "T2001": "The left side of the {{token}} operator must evaluate to a number",
        "T2002": "The right side of the {{token}} operator must evaluate to a number",
        "T2003": "The left side of the range operator (..) must evaluate to an integer",
        "T2004": "The right side of the range operator (..) must evaluate to an integer",
        "D2005": "The left side of := must be a variable name (start with $)",  // defunct - replaced by S0212 parser error
        "T2006": "The right side of the function application operator ~> must be a function",
        "T2007": "Type mismatch when comparing values {{value}} and {{value2}} in order-by clause",
        "T2008": "The expressions within an order-by clause must evaluate to numeric or string values",
        "T2009": "The values {{value}} and {{value2}} either side of operator {{token}} must be of the same data type",
        "T2010": "The expressions either side of operator {{token}} must evaluate to numeric or string values",
        "T2011": "The insert/update clause of the transform expression must evaluate to an object: {{value}}",
        "T2012": "The delete clause of the transform expression must evaluate to a string or array of strings: {{value}}",
        "T2013": "The transform expression clones the input object using the $clone() function.  This has been overridden in the current scope by a non-function.",
        "D2014": "The size of the sequence allocated by the range operator (..) must not exceed 1e6.  Attempted to allocate {{value}}.",
        "D3001": "Attempting to invoke string function on Infinity or NaN",
        "D3010": "Second argument of replace function cannot be an empty string",
        "D3011": "Fourth argument of replace function must evaluate to a positive number",
        "D3012": "Attempted to replace a matched string with a non-string value",
        "D3020": "Third argument of split function must evaluate to a positive number",
        "D3030": "Unable to cast value to a number: {{value}}",
        "D3040": "Third argument of match function must evaluate to a positive number",
        "D3050": "First argument of reduce function must be a function with two arguments",
        "D3060": "The sqrt function cannot be applied to a negative number: {{value}}",
        "D3061": "The power function has resulted in a value that cannot be represented as a JSON number: base={{value}}, exponent={{exp}}",
        "D3070": "The single argument form of the sort function can only be applied to an array of strings or an array of numbers.  Use the second argument to specify a comparison function",
        "D3080": "The picture string must only contain a maximum of two sub-pictures",
        "D3081": "The sub-picture must not contain more than one instance of the 'decimal-separator' character",
        "D3082": "The sub-picture must not contain more than one instance of the 'percent' character",
        "D3083": "The sub-picture must not contain more than one instance of the 'per-mille' character",
        "D3084": "The sub-picture must not contain both a 'percent' and a 'per-mille' character",
        "D3085": "The mantissa part of a sub-picture must contain at least one character that is either an 'optional digit character' or a member of the 'decimal digit family'",
        "D3086": "The sub-picture must not contain a passive character that is preceded by an active character and that is followed by another active character",
        "D3087": "The sub-picture must not contain a 'grouping-separator' character that appears adjacent to a 'decimal-separator' character",
        "D3088": "The sub-picture must not contain a 'grouping-separator' at the end of the integer part",
        "D3089": "The sub-picture must not contain two adjacent instances of the 'grouping-separator' character",
        "D3090": "The integer part of the sub-picture must not contain a member of the 'decimal digit family' that is followed by an instance of the 'optional digit character'",
        "D3091": "The fractional part of the sub-picture must not contain an instance of the 'optional digit character' that is followed by a member of the 'decimal digit family'",
        "D3092": "A sub-picture that contains a 'percent' or 'per-mille' character must not contain a character treated as an 'exponent-separator'",
        "D3093": "The exponent part of the sub-picture must comprise only of one or more characters that are members of the 'decimal digit family'",
        "D3100": "The radix of the formatBase function must be between 2 and 36.  It was given {{value}}",
        "D3110": "The argument of the toMillis function must be an ISO 8601 formatted timestamp. Given {{value}}",
        "D3120": "Syntax error in expression passed to function eval: {{value}}",
        "D3121": "Dynamic error evaluating the expression passed to function eval: {{value}}",
        "D3130": "Formatting an integer as a sequence starting with {{value}} is not supported by this implementation",
        "D3131": "In a decimal digit pattern, all digits must be from the same decimal group",
        "D3132": "Unknown component specifier {{value}} in date/time picture string",
        "D3133": "The 'name' modifier can only be applied to months and days in the date/time picture string, not {{value}}",
        "D3134": "The timezone integer format specifier cannot have more than four digits",
        "D3135": "No matching closing bracket ']' in date/time picture string",
        "D3136": "The date/time picture string is missing specifiers required to parse the timestamp"
    };

    /**
     * lookup a message template from the catalog and substitute the inserts.
     * Populates `err.message` with the substituted message. Leaves `err.message`
     * untouched if code lookup fails.
     * @param {string} err - error code to lookup
     * @returns {undefined} - `err` is modified in place
     */
    function populateMessage(err) {
        var template = errorCodes[err.code];
        if(typeof template !== 'undefined') {
            // if there are any handlebars, replace them with the field references
            // triple braces - replace with value
            // double braces - replace with json stringified value
            var message = template.replace(/\{\{\{([^}]+)}}}/g, function() {
                return err[arguments[1]];
            });
            message = message.replace(/\{\{([^}]+)}}/g, function() {
                return JSON.stringify(err[arguments[1]]);
            });
            err.message = message;
        }
        // Otherwise retain the original `err.message`
    }

    /**
     * JSONata
     * @param {Object} expr - JSONata expression
     * @param {boolean} options - recover: attempt to recover on parse error
     * @returns {{evaluate: evaluate, assign: assign}} Evaluated expression
     */
    function jsonata(expr, options) {
        var ast;
        var errors;
        try {
            ast = parser(expr, options && options.recover);
            errors = ast.errors;
            delete ast.errors;
        } catch(err) {
            // insert error message into structure
            populateMessage(err); // possible side-effects on `err`
            throw err;
        }
        var environment = createFrame(staticFrame);

        var timestamp = new Date(); // will be overridden on each call to evalute()
        environment.bind('now', defineFunction(function(picture, timezone) {
            return datetime.fromMillis(timestamp.getTime(), picture, timezone);
        }, '<s?s?:s>'));
        environment.bind('millis', defineFunction(function() {
            return timestamp.getTime();
        }, '<:n>'));

        return {
            evaluate: function (input, bindings, callback) {
                // throw if the expression compiled with syntax errors
                if(typeof errors !== 'undefined') {
                    var err = {
                        code: 'S0500',
                        position: 0
                    };
                    populateMessage(err); // possible side-effects on `err`
                    throw err;
                }

                if (typeof bindings !== 'undefined') {
                    var exec_env;
                    // the variable bindings have been passed in - create a frame to hold these
                    exec_env = createFrame(environment);
                    for (var v in bindings) {
                        exec_env.bind(v, bindings[v]);
                    }
                } else {
                    exec_env = environment;
                }
                // put the input document into the environment as the root object
                exec_env.bind('$', input);

                // capture the timestamp and put it in the execution environment
                // the $now() and $millis() functions will return this value - whenever it is called
                timestamp = new Date();
                exec_env.timestamp = timestamp;

                var result, it;
                // if a callback function is supplied, then drive the generator in a promise chain
                if(typeof callback === 'function') {
                    exec_env.async = true;
                    var catchHandler = function (err) {
                        populateMessage(err); // possible side-effects on `err`
                        callback(err, null);
                    };
                    var thenHandler = function (response) {
                        result = it.next(response);
                        if (result.done) {
                            callback(null, result.value);
                        } else {
                            result.value.then(thenHandler).catch(catchHandler);
                        }
                    };
                    it = evaluate(ast, input, exec_env);
                    result = it.next();
                    result.value.then(thenHandler).catch(catchHandler);
                } else {
                    // no callback function - drive the generator to completion synchronously
                    try {
                        it = evaluate(ast, input, exec_env);
                        result = it.next();
                        while (!result.done) {
                            result = it.next(result.value);
                        }
                        return result.value;
                    } catch (err) {
                        // insert error message into structure
                        populateMessage(err); // possible side-effects on `err`
                        throw err;
                    }
                }
            },
            assign: function (name, value) {
                environment.bind(name, value);
            },
            registerFunction: function(name, implementation, signature) {
                var func = defineFunction(implementation, signature);
                environment.bind(name, func);
            },
            ast: function() {
                return ast;
            },
            errors: function() {
                return errors;
            }
        };
    }

    jsonata.parser = parser; // TODO remove this in a future release - use ast() instead

    return jsonata;

})();

module.exports = jsonata;
