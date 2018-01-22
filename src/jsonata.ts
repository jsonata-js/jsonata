import { parser } from './parser';
import { lookupMessage, createFrame } from './utils';
import { evaluate } from './evaluate';
import { defineFunction } from './signatures';
import { createStandardFrame } from './functions';

export interface Options {
    recover: boolean;
}

export type Callback = (err: Error, result: any) => void;

export interface Expression {
    evaluate: (input?: any, bindings?: { [name: string]: any }, callback?: Callback) => any;
    assign: (key: string, value: any) => void;
    registerFunction: (name: string, implementation: Function, signature?: string) => void;
    ast: () => AST;
    errors: () => string[];
}

export type AST = any;

/**
 * JSONata
 * @param {Object} expr - JSONata expression
 * @param {boolean} options - recover: attempt to recover on parse error
 * @returns {{evaluate: evaluate, assign: assign}} Evaluated expression
 */
export function jsonata(expr: string, options?: Partial<Options>): Expression {
    var ast;
    var errors;
    try {
        ast = parser(expr, options && options.recover);
        errors = ast.errors;
        delete ast.errors;
    } catch (err) {
        // insert error message into structure
        err.message = lookupMessage(err);
        throw err;
    }

    const staticFrame = createStandardFrame();
    var environment = createFrame(staticFrame);

    var timestamp = new Date(); // will be overridden on each call to evalute()
    environment.bind(
        "now",
        defineFunction(function() {
            return timestamp.toJSON();
        }, "<:s>"),
    );
    environment.bind(
        "millis",
        defineFunction(function() {
            return timestamp.getTime();
        }, "<:n>"),
    );

    return {
        evaluate: function(input, bindings, callback) {
            // throw if the expression compiled with syntax errors
            if (typeof errors !== "undefined") {
                var err: any = {
                    code: "S0500",
                    position: 0,
                };
                err.message = lookupMessage(err);
                throw err;
            }

            if (typeof bindings !== "undefined") {
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
            exec_env.bind("$", input);

            // capture the timestamp and put it in the execution environment
            // the $now() and $millis() functions will return this value - whenever it is called
            timestamp = new Date();

            var result, it;
            // if a callback function is supplied, then drive the generator in a promise chain
            if (typeof callback === "function") {
                exec_env.bind("__jsonata_async", true);
                var thenHandler = function(response) {
                    result = it.next(response);
                    if (result.done) {
                        callback(null, result.value);
                    } else {
                        result.value.then(thenHandler).catch(function(err) {
                            err.message = lookupMessage(err);
                            callback(err, null);
                        });
                    }
                };
                it = evaluate(ast, input, exec_env);
                result = it.next();
                result.value.then(thenHandler);
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
                    err.message = lookupMessage(err);
                    throw err;
                }
            }
        },
        assign: function(name, value) {
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
        },
    };
}
