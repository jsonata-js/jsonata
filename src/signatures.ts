import { isFunction } from './utils';

export interface Signature {
    definition: string;
    validate: (args: any, context: any) => any[];
}

export interface Parameter {
    regex: string;
    type: string;
    array: boolean;
    context?: boolean;
    contextRegex?: RegExp;
    subtype?: string;
}

/**
 * Parses a function signature definition and returns a validation function
 * @param {string} signature - the signature between the <angle brackets>
 * @returns {Function} validation function
 */
export function parseSignature(signature: string): Signature {
    // create a Regex that represents this signature and return a function that when invoked,
    // returns the validated (possibly fixed-up) arguments, or throws a validation error
    // step through the signature, one symbol at a time
    var position = 1;
    var params: Parameter[] = [];
    var prevParam: undefined | Parameter = undefined;
    while (position < signature.length) {
        var symbol = signature.charAt(position);
        if (symbol === ":") {
            // TODO figure out what to do with the return type
            // ignore it for now
            break;
        }

        var next = function(param: Parameter) {
            params.push(param);
            prevParam = param;
        };

        var findClosingBracket = function(str, start, openSymbol, closeSymbol) {
            // returns the position of the closing symbol (e.g. bracket) in a string
            // that balances the opening symbol at position start
            var depth = 1;
            var position = start;
            while (position < str.length) {
                position++;
                symbol = str.charAt(position);
                if (symbol === closeSymbol) {
                    depth--;
                    if (depth === 0) {
                        // we're done
                        break; // out of while loop
                    }
                } else if (symbol === openSymbol) {
                    depth++;
                }
            }
            return position;
        };

        switch (symbol) {
            case "s": // string
            case "n": // number
            case "b": // boolean
            case "l": // not so sure about expecting null?
            case "o": // object
                next({
                    regex: "[" + symbol + "m]",
                    type: symbol,
                    array: false,
                });
                break;
            case "a": // array
                //  normally treat any value as singleton array
                next({
                    regex: "[asnblfom]",
                    type: symbol,
                    array: true,
                });
                break;
            case "f": // function
                next({
                    regex: "f",
                    type: symbol, 
                    array: false,   
                });
                break;
            case "j": // any JSON type
                next({
                    regex: "[asnblom]",
                    type: symbol, 
                    array: false,
                });
                break;
            case "x": // any type
                next({
                    regex: "[asnblfom]",
                    type: symbol,
                    array: false,
                });
                break;
            case "-": // use context if param not supplied
                prevParam.context = true;
                prevParam.contextRegex = new RegExp(prevParam.regex); // pre-compiled to test the context type at runtime
                prevParam.regex += "?";
                break;
            case "?": // optional param
            case "+": // one or more
                prevParam.regex += symbol;
                break;
            case "(": // choice of types
                // search forward for matching ')'
                var endParen = findClosingBracket(signature, position, "(", ")");
                var choice = signature.substring(position + 1, endParen);
                if (choice.indexOf("<") !==-1) {
                    // TODO harder
                    throw {
                        code: "S0402",
                        stack: new Error().stack,
                        value: choice,
                        offset: position,
                    };
                }
                position = endParen;
                next({
                    regex: "[" + choice + "m]",
                    type: "(" + choice + ")",  
                    array: false,
                });
                break;
            case "<": // type parameter - can only be applied to 'a' and 'f'
                if (prevParam.type === "a" || prevParam.type === "f") {
                    // search forward for matching '>'
                    var endPos = findClosingBracket(signature, position, "<", ">");
                    prevParam.subtype = signature.substring(position + 1, endPos);
                    position = endPos;
                } else {
                    throw {
                        code: "S0401",
                        stack: new Error().stack,
                        value: prevParam.type,
                        offset: position,
                    };
                }
                break;
        }
        position++;
    }
    var regexStr =
        "^" +
        params
            .map(function(param) {
                return "(" + param.regex + ")";
            })
            .join("") +
        "$";
    var regex = new RegExp(regexStr);
    var getSymbol = function(value) {
        var symbol;
        if (isFunction(value)) {
            symbol = "f";
        } else {
            var type = typeof value;
            switch (type) {
                case "string":
                    symbol = "s";
                    break;
                case "number":
                    symbol = "n";
                    break;
                case "boolean":
                    symbol = "b";
                    break;
                case "object":
                    if (value === null) {
                        symbol = "l";
                    } else if (Array.isArray(value)) {
                        symbol = "a";
                    } else {
                        symbol = "o";
                    }
                    break;
                case "undefined":
                default:
                    // any value can be undefined, but should be allowed to match
                    symbol = "m"; // m for missing
            }
        }
        return symbol;
    };

    var throwValidationError = function(badArgs, badSig): never {
        // to figure out where this went wrong we need apply each component of the
        // regex to each argument until we get to the one that fails to match
        var partialPattern = "^";
        var goodTo = 0;
        for (var index = 0; index < params.length; index++) {
            partialPattern += params[index].regex;
            var match = badSig.match(partialPattern);
            if (match === null) {
                // failed here
                throw {
                    code: "T0410",
                    stack: new Error().stack,
                    value: badArgs[goodTo],
                    index: goodTo + 1,
                };
            }
            goodTo = match[0].length;
        }
        // if it got this far, it's probably because of extraneous arguments (we
        // haven't added the trailing '$' in the regex yet.
        throw {
            code: "T0410",
            stack: new Error().stack,
            value: badArgs[goodTo],
            index: goodTo + 1,
        };
    };

    return {
        definition: signature,
        validate: function(args, context) {
            var suppliedSig = "";
            args.forEach(function(arg) {
                suppliedSig += getSymbol(arg);
            });
            var isValid = regex.exec(suppliedSig);
            if (isValid) {
                var validatedArgs = [];
                var argIndex = 0;
                params.forEach(function(param, index) {
                    var arg = args[argIndex];
                    var match = isValid[index + 1];
                    if (match === "") {
                        if (param.context && param.contextRegex) {
                            // substitute context value for missing arg
                            // first check that the context value is the right type
                            var contextType = getSymbol(context);
                            // test contextType against the regex for this arg (without the trailing ?)
                            if (param.contextRegex.test(contextType)) {
                                validatedArgs.push(context);
                            } else {
                                // context value not compatible with this argument
                                throw {
                                    code: "T0411",
                                    stack: new Error().stack,
                                    value: context,
                                    index: argIndex + 1,
                                };
                            }
                        } else {
                            validatedArgs.push(arg);
                            argIndex++;
                        }
                    } else {
                        // may have matched multiple args (if the regex ends with a '+'
                        // split into single tokens
                        match.split("").forEach(function(single) {
                            if (param.type === "a") {
                                if (single === "m") {
                                    // missing (undefined)
                                    arg = undefined;
                                } else {
                                    arg = args[argIndex];
                                    var arrayOK = true;
                                    // is there type information on the contents of the array?
                                    if (typeof param.subtype !== "undefined") {
                                        if (single !== "a" && match !== param.subtype) {
                                            arrayOK = false;
                                        } else if (single === "a") {
                                            if (arg.length > 0) {
                                                var itemType = getSymbol(arg[0]);
                                                if (itemType !== param.subtype.charAt(0)) {
                                                    // TODO recurse further
                                                    arrayOK = false;
                                                } else {
                                                    // make sure every item in the array is this type
                                                    var differentItems = arg.filter(function(val) {
                                                        return getSymbol(val) !== itemType;
                                                    });
                                                    arrayOK = differentItems.length === 0;
                                                }
                                            }
                                        }
                                    }
                                    if (!arrayOK) {
                                        throw {
                                            code: "T0412",
                                            stack: new Error().stack,
                                            value: arg,
                                            index: argIndex + 1,
                                            type: param.subtype, // TODO translate symbol to type name
                                        };
                                    }
                                    // the function expects an array. If it's not one, make it so
                                    if (single !== "a") {
                                        arg = [arg];
                                    }
                                }
                                validatedArgs.push(arg);
                                argIndex++;
                            } else {
                                validatedArgs.push(arg);
                                argIndex++;
                            }
                        });
                    }
                });
                return validatedArgs;
            }
            return throwValidationError(args, suppliedSig);
        },
    };
}

export interface FunctionDefinition {
    _jsonata_function: boolean;
    implementation: Function;
    signature?: Signature;
}

/**
 * Creates a function definition
 * @param {Function} func - function implementation in Javascript
 * @param {string} signature - JSONata function signature definition
 * @returns {{implementation: *, signature: *}} function definition
 */
export function defineFunction(func: Function, signature?: string): FunctionDefinition {
    var definition: FunctionDefinition = {
        _jsonata_function: true,
        implementation: func,
        signature: undefined,
    };
    if (typeof signature !== "undefined") {
        definition.signature = parseSignature(signature);
    }
    return definition;
}
