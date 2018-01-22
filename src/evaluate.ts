import {
    isNumeric,
    isArrayOfNumbers,
    flatten,
    createFrame,
    isFunction,
    isGenerator,
    isLambda,
    isArrayOfStrings,
    createSequence,
    toSequence,
} from "./utils";
import { defineFunction } from "./signatures";
import { parser } from "./parser";
import { functionBoolean, functionAppend, functionString, functionSort, createStandardFrame } from "./functions";

/**
 * Evaluate expression against input data
 * @param {Object} expr - JSONata expression
 * @param {Object} input - Input data to evaluate against
 * @param {Object} environment - Environment
 * @returns {*} Evaluated input data
 */
export function* evaluate(expr, input, environment) {
    var result;

    var entryCallback = environment.lookup("__evaluate_entry");
    if (entryCallback) {
        entryCallback(expr, input, environment);
    }

    switch (expr.type) {
        case "path":
            result = yield* evaluatePath(expr, input, environment);
            break;
        case "binary":
            result = yield* evaluateBinary(expr, input, environment);
            break;
        case "unary":
            result = yield* evaluateUnary(expr, input, environment);
            break;
        case "name":
            result = evaluateName(expr, input, environment);
            break;
        case "literal":
            result = evaluateLiteral(expr, input, environment);
            break;
        case "wildcard":
            result = evaluateWildcard(expr, input, environment);
            break;
        case "descendant":
            result = evaluateDescendants(expr, input, environment);
            break;
        case "condition":
            result = yield* evaluateCondition(expr, input, environment);
            break;
        case "block":
            result = yield* evaluateBlock(expr, input, environment);
            break;
        case "bind":
            result = yield* evaluateBindExpression(expr, input, environment);
            break;
        case "regex":
            result = evaluateRegex(expr, input, environment);
            break;
        case "function":
            result = yield* evaluateFunction(expr, input, environment);
            break;
        case "variable":
            result = evaluateVariable(expr, input, environment);
            break;
        case "lambda":
            result = evaluateLambda(expr, input, environment);
            break;
        case "partial":
            result = yield* evaluatePartialApplication(expr, input, environment);
            break;
        case "apply":
            result = yield* evaluateApplyExpression(expr, input, environment);
            break;
        case "sort":
            result = yield* evaluateSortExpression(expr, input, environment);
            break;
        case "transform":
            result = evaluateTransformExpression(expr, input, environment);
            break;
    }

    if (
        environment.lookup("__jsonata_async") &&
        (typeof result === "undefined" || result === null || typeof result.then !== "function")
    ) {
        result = Promise.resolve(result);
    }
    if (
        environment.lookup("__jsonata_async") &&
        typeof result.then === "function" &&
        expr.nextFunction &&
        typeof result[expr.nextFunction] === "function"
    ) {
        // although this is a 'thenable', it is chaining a different function
        // so don't yield since yielding will trigger the .then()
    } else {
        result = yield result;
    }

    if (expr.hasOwnProperty("predicate")) {
        result = yield* applyPredicates(expr.predicate, result, environment);
    }
    if (expr.hasOwnProperty("group")) {
        result = yield* evaluateGroupExpression(expr.group, result, environment);
    }

    var exitCallback = environment.lookup("__evaluate_exit");
    if (exitCallback) {
        exitCallback(expr, input, environment, result);
    }

    if (result && result.sequence) {
        result = result.value();
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
    if (expr.steps[0].type === "variable") {
        inputSequence = createSequence(input); // dummy singleton sequence for first (absolute) step
    } else if (Array.isArray(input)) {
        inputSequence = input;
    } else {
        // if input is not an array, make it so
        inputSequence = createSequence(input);
    }

    var resultSequence;

    // evaluate each step in turn
    for (var ii = 0; ii < expr.steps.length; ii++) {
        var step = expr.steps[ii];

        // if the first step is an explicit array constructor, then just evaluate that (i.e. don't iterate over a context array)
        if (ii === 0 && step.consarray) {
            resultSequence = yield* evaluate(step, inputSequence, environment);
        } else {
            resultSequence = yield* evaluateStep(step, inputSequence, environment, ii === expr.steps.length - 1);
        }

        if (typeof resultSequence === "undefined" || resultSequence.length === 0) {
            break;
        }
        inputSequence = resultSequence;
    }

    if (expr.keepSingletonArray) {
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

    for (var ii = 0; ii < input.length; ii++) {
        var res = yield* evaluate(expr, input[ii], environment);
        if (typeof res !== "undefined") {
            result.push(res);
        }
    }

    var resultSequence = createSequence();
    if (lastStep && result.length === 1 && Array.isArray(result[0]) && !result[0].sequence) {
        resultSequence = result[0];
    } else {
        // flatten the sequence
        result.forEach(function(res) {
            // TODO: These any casts are a bit sloppy
            if (!Array.isArray(res) || (res as any).cons || (res as any).keepSingleton) {
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
    for (var ii = 0; ii < predicates.length; ii++) {
        var predicate = predicates[ii];
        // if it's not an array, turn it into one
        // since in XPath >= 2.0 an item is equivalent to a singleton sequence of that item
        // if input is not an array, make it so
        if (!Array.isArray(inputSequence)) {
            inputSequence = createSequence(inputSequence);
        }
        results = createSequence();
        if (predicate.type === "literal" && isNumeric(predicate.value)) {
            var index = predicate.value;
            if (!Number.isInteger(index)) {
                // round it down
                index = Math.floor(index);
            }
            if (index < 0) {
                // count in from end of array
                index = inputSequence.length + index;
            }
            results = inputSequence[index];
        } else {
            results = yield* evaluateFilter(predicate, inputSequence, environment);
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
    for (var index = 0; index < input.length; index++) {
        var item = input[index];
        var res = yield* evaluate(predicate, item, environment);
        if (isNumeric(res)) {
            res = [res];
        }
        if (isArrayOfNumbers(res)) {
            res.forEach(function(ires) {
                if (!Number.isInteger(ires)) {
                    // round it down
                    ires = Math.floor(ires);
                }
                if (ires < 0) {
                    // count in from end of array
                    ires = input.length + ires;
                }
                if (ires === index) {
                    results.push(item);
                }
            });
        } else if (functionBoolean(res)) {
            // truthy
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
function* evaluateBinary(expr, input, environment) {
    var result;
    var lhs = yield* evaluate(expr.lhs, input, environment);
    var rhs = yield* evaluate(expr.rhs, input, environment);
    var op = expr.value;

    try {
        switch (op) {
            case "+":
            case "-":
            case "*":
            case "/":
            case "%":
                result = evaluateNumericExpression(lhs, rhs, op);
                break;
            case "=":
            case "!=":
            case "<":
            case "<=":
            case ">":
            case ">=":
                result = evaluateComparisonExpression(lhs, rhs, op);
                break;
            case "&":
                result = evaluateStringConcat(lhs, rhs);
                break;
            case "and":
            case "or":
                result = evaluateBooleanExpression(lhs, rhs, op);
                break;
            case "..":
                result = evaluateRangeExpression(lhs, rhs);
                break;
            case "in":
                result = evaluateIncludesExpression(lhs, rhs);
                break;
        }
    } catch (err) {
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
        case "-":
            result = yield* evaluate(expr.expression, input, environment);
            if (typeof result === "undefined") {
                result = undefined;
            } else if (isNumeric(result)) {
                result = -result;
            } else {
                throw {
                    code: "D1002",
                    stack: new Error().stack,
                    position: expr.position,
                    token: expr.value,
                    value: result,
                };
            }
            break;
        case "[":
            // array constructor - evaluate each item
            result = [];
            for (var ii = 0; ii < expr.expressions.length; ii++) {
                var item = expr.expressions[ii];
                var value = yield* evaluate(item, input, environment);
                if (typeof value !== "undefined") {
                    if (item.value === "[") {
                        result.push(value);
                    } else {
                        result = functionAppend(result, value);
                    }
                }
            }
            if (expr.consarray) {
                Object.defineProperty(result, "cons", {
                    enumerable: false,
                    configurable: false,
                    value: true,
                });
            }
            break;
        case "{":
            // object constructor - apply grouping
            result = yield* evaluateGroupExpression(expr, input, environment);
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
export function evaluateName(expr, input, environment) {
    // lookup the 'name' item in the input
    var result;
    if (Array.isArray(input)) {
        result = createSequence();
        for (var ii = 0; ii < input.length; ii++) {
            var res = evaluateName(expr, input[ii], environment);
            if (typeof res !== "undefined") {
                result.push(res);
            }
        }
    } else if (input !== null && typeof input === "object") {
        result = input[expr.value];
    }
    return result;
}

/**
 * Evaluate literal against input data
 * @param {Object} expr - JSONata expression
 * @returns {*} Evaluated input data
 */
function evaluateLiteral(expr, input, environment) {
    return expr.value;
}

/**
 * Evaluate wildcard against input data
 * @param {Object} expr - JSONata expression
 * @param {Object} input - Input data to evaluate against
 * @returns {*} Evaluated input data
 */
function evaluateWildcard(expr, input, environment) {
    var results = createSequence();
    if (input !== null && typeof input === "object") {
        Object.keys(input).forEach(function(key) {
            var value = input[key];
            if (Array.isArray(value)) {
                value = flatten(value);
                results = functionAppend(results, value);
            } else {
                results.push(value);
            }
        });
    }

    //        result = normalizeSequence(results);
    return results;
}

/**
 * Evaluate descendants against input data
 * @param {Object} expr - JSONata expression
 * @param {Object} input - Input data to evaluate against
 * @returns {*} Evaluated input data
 */
function evaluateDescendants(expr, input, environment) {
    var result;
    var resultSequence = createSequence();
    if (typeof input !== "undefined") {
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
        input.forEach(function(member) {
            recurseDescendants(member, results);
        });
    } else if (input !== null && typeof input === "object") {
        Object.keys(input).forEach(function(key) {
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

    if (typeof lhs === "undefined" || typeof rhs === "undefined") {
        // if either side is undefined, the result is undefined
        return result;
    }

    if (!isNumeric(lhs)) {
        throw {
            code: "T2001",
            stack: new Error().stack,
            value: lhs,
        };
    }
    if (!isNumeric(rhs)) {
        throw {
            code: "T2002",
            stack: new Error().stack,
            value: rhs,
        };
    }

    switch (op) {
        case "+":
            result = lhs + rhs;
            break;
        case "-":
            result = lhs - rhs;
            break;
        case "*":
            result = lhs * rhs;
            break;
        case "/":
            result = lhs / rhs;
            break;
        case "%":
            result = lhs % rhs;
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

    if (ltype === "undefined" || rtype === "undefined") {
        // if either side is undefined, the result is false
        return false;
    }

    var validate = function() {
        // if aa or bb are not string or numeric values, then throw an error
        if (!(ltype === "string" || ltype === "number") || !(rtype === "string" || rtype === "number")) {
            throw {
                code: "T2010",
                stack: new Error().stack,
                value: !(ltype === "string" || ltype === "number") ? lhs : rhs,
            };
        }

        //if aa and bb are not of the same type
        if (ltype !== rtype) {
            throw {
                code: "T2009",
                stack: new Error().stack,
                value: lhs,
                value2: rhs,
            };
        }
    };

    switch (op) {
        case "=":
            result = lhs === rhs;
            break;
        case "!=":
            result = lhs !== rhs;
            break;
        case "<":
            validate();
            result = lhs < rhs;
            break;
        case "<=":
            validate();
            result = lhs <= rhs;
            break;
        case ">":
            validate();
            result = lhs > rhs;
            break;
        case ">=":
            validate();
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

    if (typeof lhs === "undefined" || typeof rhs === "undefined") {
        // if either side is undefined, the result is false
        return false;
    }

    if (!Array.isArray(rhs)) {
        rhs = [rhs];
    }

    for (var i = 0; i < rhs.length; i++) {
        if (rhs[i] === lhs) {
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

    switch (op) {
        case "and":
            result = functionBoolean(lhs) && functionBoolean(rhs);
            break;
        case "or":
            result = functionBoolean(lhs) || functionBoolean(rhs);
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

    var lstr = "";
    var rstr = "";
    if (typeof lhs !== "undefined") {
        lstr = functionString(lhs);
    }
    if (typeof rhs !== "undefined") {
        rstr = functionString(rhs);
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
    for (var itemIndex = 0; itemIndex < input.length; itemIndex++) {
        var item = input[itemIndex];
        for (var pairIndex = 0; pairIndex < expr.lhs.length; pairIndex++) {
            var pair = expr.lhs[pairIndex];
            var key = yield* evaluate(pair[0], item, environment);
            // key has to be a string
            if (typeof key !== "string") {
                throw {
                    code: "T1003",
                    stack: new Error().stack,
                    position: expr.position,
                    value: key,
                };
            }
            var entry = { data: item, expr: pair[1] };
            if (groups.hasOwnProperty(key)) {
                // a value already exists in this slot
                // append it as an array
                groups[key].data = functionAppend(groups[key].data, item);
            } else {
                groups[key] = entry;
            }
        }
    }

    // iterate over the groups to evaluate the 'value' expression
    for (key in groups) {
        entry = groups[key];
        var value = yield* evaluate(entry.expr, entry.data, environment);
        if (typeof value !== "undefined") {
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

    if (typeof lhs === "undefined" || typeof rhs === "undefined") {
        // if either side is undefined, the result is undefined
        return result;
    }

    if (lhs > rhs) {
        // if the lhs is greater than the rhs, return undefined
        return result;
    }

    if (!Number.isInteger(lhs)) {
        throw {
            code: "T2003",
            stack: new Error().stack,
            value: lhs,
        };
    }
    if (!Number.isInteger(rhs)) {
        throw {
            code: "T2004",
            stack: new Error().stack,
            value: rhs,
        };
    }

    result = new Array(rhs - lhs + 1);
    for (var item = lhs, index = 0; item <= rhs; item++, index++) {
        result[index] = item;
    }
    return toSequence(result);
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
    // The LHS is the name of the variable to bind to - should be a VARIABLE token
    var value = yield* evaluate(expr.rhs, input, environment);
    if (expr.lhs.type !== "variable") {
        throw {
            code: "D2005",
            stack: new Error().stack,
            position: expr.position,
            token: expr.value,
            value: expr.lhs.type === "path" ? expr.lhs.steps[0].value : expr.lhs.value,
        };
    }
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
    var condition = yield* evaluate(expr.condition, input, environment);
    if (functionBoolean(condition)) {
        result = yield* evaluate(expr.then, input, environment);
    } else if (typeof expr.else !== "undefined") {
        result = yield* evaluate(expr.else, input, environment);
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
    for (var ii = 0; ii < expr.expressions.length; ii++) {
        result = yield* evaluate(expr.expressions[ii], input, frame);
    }

    return result;
}

/**
 * Prepare a regex
 * @param {Object} expr - expression containing regex
 * @returns {Function} Higher order function representing prepared regex
 */
function evaluateRegex(expr, input, environment) {
    expr.value.lastIndex = 0;
    var closure = function(str) {
        var re = expr.value;
        var result;
        var match = re.exec(str);
        if (match !== null) {
            result = {
                match: match[0],
                start: match.index,
                end: match.index + match[0].length,
                groups: [],
            };
            if (match.length > 1) {
                for (var i = 1; i < match.length; i++) {
                    result.groups.push(match[i]);
                }
            }
            result.next = function() {
                if (re.lastIndex >= str.length) {
                    return undefined;
                } else {
                    var next = closure(str);
                    if (next && next.match === "" && re.lastIndex === expr.value.lastIndex) {
                        // matches zero length string; this will never progress
                        throw {
                            code: "D1004",
                            stack: new Error().stack,
                            position: expr.position,
                            value: expr.value.source,
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
    if (expr.value === "") {
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
    var lhs = yield* evaluate(expr.lhs, input, environment);

    // sort the lhs array
    // use comparator function
    var comparator = function(a, b) {
        // expr.rhs is an array of order-by in priority order
        var comp = 0;
        for (var index = 0; comp === 0 && index < expr.rhs.length; index++) {
            var term = expr.rhs[index];
            //evaluate the rhs expression in the context of a
            var aa = driveGenerator(term.expression, a, environment);
            //evaluate the rhs expression in the context of b
            var bb = driveGenerator(term.expression, b, environment);

            // type checks
            var atype = typeof aa;
            var btype = typeof bb;
            // undefined should be last in sort order
            if (atype === "undefined") {
                // swap them, unless btype is also undefined
                comp = btype === "undefined" ? 0 : 1;
                continue;
            }
            if (btype === "undefined") {
                comp = -1;
                continue;
            }

            // if aa or bb are not string or numeric values, then throw an error
            if (!(atype === "string" || atype === "number") || !(btype === "string" || btype === "number")) {
                throw {
                    code: "T2008",
                    stack: new Error().stack,
                    position: expr.position,
                    value: !(atype === "string" || atype === "number") ? aa : bb,
                };
            }

            //if aa and bb are not of the same type
            if (atype !== btype) {
                throw {
                    code: "T2007",
                    stack: new Error().stack,
                    position: expr.position,
                    value: aa,
                    value2: bb,
                };
            }
            if (aa === bb) {
                // both the same - move on to next term
                continue;
            } else if (aa < bb) {
                comp = -1;
            } else {
                comp = 1;
            }
            if (term.descending === true) {
                comp = -comp;
            }
        }
        // only swap a & b if comp equals 1
        return comp === 1;
    };

    result = functionSort(lhs, comparator);

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
    var transformer = function*(obj) {
        // signature <(oa):o>
        // undefined inputs always return undefined
        if (typeof obj === "undefined") {
            return undefined;
        }

        // this function returns a copy of obj with changes specified by the pattern/operation
        var cloneFunction = environment.lookup("clone");
        if (!isFunction(cloneFunction)) {
            // throw type error
            throw {
                code: "T2013",
                stack: new Error().stack,
                position: expr.position,
            };
        }
        var result = yield* apply(cloneFunction, [obj], environment);
        var matches = yield* evaluate(expr.pattern, result, environment);
        if (typeof matches !== "undefined") {
            if (!Array.isArray(matches)) {
                matches = [matches];
            }
            for (var ii = 0; ii < matches.length; ii++) {
                var match = matches[ii];
                // evaluate the update value for each match
                var update = yield* evaluate(expr.update, match, environment);
                // update must be an object
                var updateType = typeof update;
                if (updateType !== "undefined") {
                    if (updateType !== "object" || update === null) {
                        // throw type error
                        throw {
                            code: "T2011",
                            stack: new Error().stack,
                            position: expr.update.position,
                            value: update,
                        };
                    }
                    // merge the update
                    for (var prop in update) {
                        match[prop] = update[prop];
                    }
                }

                // delete, if specified, must be an array of strings (or single string)
                if (typeof expr.delete !== "undefined") {
                    var deletions = yield* evaluate(expr.delete, match, environment);
                    if (typeof deletions !== "undefined") {
                        var val = deletions;
                        if (!Array.isArray(deletions)) {
                            deletions = [deletions];
                        }
                        if (!isArrayOfStrings(deletions)) {
                            // throw type error
                            throw {
                                code: "T2012",
                                stack: new Error().stack,
                                position: expr.delete.position,
                                value: val,
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

    return defineFunction(transformer, "<(oa):o>");
}

/**
 * Evaluate an expression by driving the generator to completion
 * Used when it's not possible to yield
 * @param {Object} expr - AST
 * @param {Object} input - Input data to evaluate against
 * @param {Object} environment - Environment
 * @returns {*} result
 */
function driveGenerator(expr, input, environment) {
    var gen = evaluate(expr, input, environment);
    // returns a generator - so iterate over it
    var comp = gen.next();
    while (!comp.done) {
        comp = gen.next(comp.value);
    }
    return comp.value;
}

/**
 * Apply the function on the RHS using the sequence on the LHS as the first argument
 * @param {Object} expr - JSONata expression
 * @param {Object} input - Input data to evaluate against
 * @param {Object} environment - Environment
 * @returns {*} Evaluated input data
 */
function* evaluateApplyExpression(expr, input, environment) {
    var result;

    const standardFrame = createStandardFrame();
    var chain = driveGenerator(parser("function($f, $g) { function($x){ $g($f($x)) } }"), null, standardFrame);

    if (expr.rhs.type === "function") {
        // this is a function _invocation_; invoke it with lhs expression as the first argument
        expr.rhs.arguments.unshift(expr.lhs);
        result = yield* evaluateFunction(expr.rhs, input, environment);
        expr.rhs.arguments.shift();
    } else {
        var lhs = yield* evaluate(expr.lhs, input, environment);
        var func = yield* evaluate(expr.rhs, input, environment);

        if (!isFunction(func)) {
            throw {
                code: "T2006",
                stack: new Error().stack,
                position: expr.position,
                value: func,
            };
        }

        if (isFunction(lhs)) {
            // this is function chaining (func1 ~> func2)
            // λ($f, $g) { λ($x){ $g($f($x)) } }
            result = yield* apply(chain, [lhs, func], environment);
        } else {
            result = yield* apply(func, [lhs], environment);
        }
    }

    return result;
}

/**
 * Evaluate function against input data
 * @param {Object} expr - JSONata expression
 * @param {Object} input - Input data to evaluate against
 * @param {Object} environment - Environment
 * @param {Object} [applyto] - LHS of ~> operator
 * @returns {*} Evaluated input data
 */
function* evaluateFunction(expr, input, environment) {
    var result;

    // create the procedure
    // can't assume that expr.procedure is a lambda type directly
    // could be an expression that evaluates to a function (e.g. variable reference, parens expr etc.
    // evaluate it generically first, then check that it is a function.  Throw error if not.
    var proc = yield* evaluate(expr.procedure, input, environment);

    if (
        typeof proc === "undefined" &&
        expr.procedure.type === "path" &&
        environment.lookup(expr.procedure.steps[0].value)
    ) {
        // help the user out here if they simply forgot the leading $
        throw {
            code: "T1005",
            stack: new Error().stack,
            position: expr.position,
            token: expr.procedure.steps[0].value,
        };
    }

    var evaluatedArgs = [];
    // eager evaluation - evaluate the arguments
    for (var jj = 0; jj < expr.arguments.length; jj++) {
        evaluatedArgs.push(yield* evaluate(expr.arguments[jj], input, environment));
    }
    // apply the procedure
    try {
        result = yield* apply(proc, evaluatedArgs, input);
    } catch (err) {
        // add the position field to the error
        err.position = expr.position;
        // and the function identifier
        err.token = expr.procedure.type === "path" ? expr.procedure.steps[0].value : expr.procedure.value;
        throw err;
    }
    return result;
}

/**
 * Apply procedure or function
 * @param {Object} proc - Procedure
 * @param {Array} args - Arguments
 * @param {Object} self - Self
 * @returns {*} Result of procedure
 */
export function* apply(proc, args, self) {
    var result;
    result = yield* applyInner(proc, args, self);
    while (isLambda(result) && result.thunk === true) {
        // trampoline loop - this gets invoked as a result of tail-call optimization
        // the function returned a tail-call thunk
        // unpack it, evaluate its arguments, and apply the tail call
        var next = yield* evaluate(result.body.procedure, result.input, result.environment);
        var evaluatedArgs = [];
        for (var ii = 0; ii < result.body.arguments.length; ii++) {
            evaluatedArgs.push(yield* evaluate(result.body.arguments[ii], result.input, result.environment));
        }

        result = yield* applyInner(next, evaluatedArgs, self);
    }
    return result;
}

/**
 * Apply procedure or function
 * @param {Object} proc - Procedure
 * @param {Array} args - Arguments
 * @param {Object} self - Self
 * @returns {*} Result of procedure
 */
function* applyInner(proc, args, self) {
    var result;
    var validatedArgs = args;
    if (proc) {
        validatedArgs = validateArguments(proc.signature, args, self);
    }
    if (isLambda(proc)) {
        result = yield* applyProcedure(proc, validatedArgs);
    } else if (proc && proc._jsonata_function === true) {
        result = proc.implementation.apply(self, validatedArgs);
        // `proc.implementation` might be a generator function
        // and `result` might be a generator - if so, yield
        if (isGenerator(result)) {
            result = yield* result;
        }
    } else if (typeof proc === "function") {
        result = proc.apply(self, validatedArgs);
        /* istanbul ignore next */
        if (isGenerator(result)) {
            result = yield* result;
        }
    } else {
        throw {
            code: "T1006",
            stack: new Error().stack,
        };
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
        body: expr.body,
        thunk: undefined,
    };
    if (expr.thunk === true) {
        procedure.thunk = true;
    }
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
    for (var ii = 0; ii < expr.arguments.length; ii++) {
        var arg = expr.arguments[ii];
        if (arg.type === "operator" && arg.value === "?") {
            evaluatedArgs.push(arg);
        } else {
            evaluatedArgs.push(yield* evaluate(arg, input, environment));
        }
    }
    // lookup the procedure
    var proc = yield* evaluate(expr.procedure, input, environment);
    if (
        typeof proc === "undefined" &&
        expr.procedure.type === "path" &&
        environment.lookup(expr.procedure.steps[0].value)
    ) {
        // help the user out here if they simply forgot the leading $
        throw {
            code: "T1007",
            stack: new Error().stack,
            position: expr.position,
            token: expr.procedure.steps[0].value,
        };
    }
    if (isLambda(proc)) {
        result = partialApplyProcedure(proc, evaluatedArgs);
    } else if (proc && proc._jsonata_function === true) {
        result = partialApplyNativeFunction(proc.implementation, evaluatedArgs);
    } else if (typeof proc === "function") {
        result = partialApplyNativeFunction(proc, evaluatedArgs);
    } else {
        throw {
            code: "T1008",
            stack: new Error().stack,
            position: expr.position,
            token: expr.procedure.type === "path" ? expr.procedure.steps[0].value : expr.procedure.value,
        };
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
    proc.arguments.forEach(function(param, index) {
        var arg = args[index];
        if (arg && arg.type === "operator" && arg.value === "?") {
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
        body: proc.body,
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
    sigArgs = sigArgs.map(function(sigArg) {
        return "$" + sigArg.trim();
    });
    var body = "function(" + sigArgs.join(", ") + "){ _ }";

    var bodyAST = parser(body);

    /* istanbul ignore else */
    if (bodyAST.type==="lambda") {
        // TODO: Check node type...
        bodyAST.body = native;
    } else {
        throw new Error("Expected parsing of partially applied native function to return a 'lambda' node");
    }

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
    var args = sigArgs.map(function(sigArg) {
        return env.lookup(sigArg.trim());
    });

    var result = proc.apply(null, args);
    if (isGenerator(result)) {
        result = yield* result;
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
    var sigArgs = sigParens.split(",");
    return sigArgs;
}

/**
 * Validate the arguments against the signature validator (if it exists)
 * @param {Function} signature - validator function
 * @param {Array} args - function arguments
 * @param {*} context - context value
 * @returns {Array} - validated arguments
 */
function validateArguments(signature, args, context) {
    if (typeof signature === "undefined") {
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
    proc.arguments.forEach(function(param, index) {
        env.bind(param.value, args[index]);
    });
    if (typeof proc.body === "function") {
        // this is a lambda that wraps a native function - generated by partially evaluating a native
        result = yield* applyNativeFunction(proc.body, env);
    } else {
        result = yield* evaluate(proc.body, proc.input, env);
    }
    return result;
}
