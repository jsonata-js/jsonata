import { isNumeric } from "../utils";
import { tail_call_optimize } from "./tail_call";
import { ErrorCollector } from "./types";
import * as ast from "../ast";

// post-parse stage
// the purpose of this is flatten the parts of the AST representing location paths,
// converting them to arrays of steps which in turn may contain arrays of predicates.
// following this, nodes containing '.' and '[' should be eliminated from the AST.
export function ast_optimize(expr: ast.ASTNode, collect: undefined | ErrorCollector): ast.ASTNode {
    switch (expr.type) {
        case "binary": {
            switch (expr.value) {
                case ".":
                    let lstep = ast_optimize(expr.lhs, collect);
                    let steps: ast.ASTNode[] = [];
                    let keepSA: boolean = false;
                    if (lstep.type === "path") {
                        steps = lstep.steps;
                        if (lstep.keepSingletonArray) keepSA = true;
                    } else {
                        steps = [lstep];
                    }
                    let rest = ast_optimize(expr.rhs, collect);
                    let last = steps[steps.length - 1];

                    if (
                        rest.type === "function" &&
                        rest.procedure.type === "path" &&
                        rest.procedure.steps.length === 1 &&
                        rest.procedure.steps[0].type === "name" &&
                        last.type === "function"
                    ) {
                        // next function in chain of functions - will override a thenable
                        last.nextFunction = rest.procedure.steps[0].value;
                    }

                    if (rest.type === "path") {
                        steps = [...steps, ...rest.steps];
                    } else {
                        steps = [...steps, rest];
                    }
                    // any steps within a path that are literals, should be changed to 'name'
                    steps.filter(step => step.type === "literal").forEach(lit => {
                        lit.type = "name";
                    });

                    /* istanbul ignore else */
                    if (steps.length > 0) {
                        // If I understand the previous comments, if the first "step" is a
                        // unary node with a value of "[", that indicates it is a path constructor.
                        // However, if the last step is also a unary node with a value of "[", that makes
                        // it an array constructor.  In either case, our goal here is to set the
                        // consarray field to be true for either of these if they are unary nodes with
                        // value of "["

                        // if first step is a path constructor, flag it for special handling
                        markAsArray(steps[0]); // Check for PATH!
                        // if last step is an array constructor, flag ti for special handling
                        markAsArray(steps[steps.length - 1]);
                    }

                    return {
                        type: "path",
                        position: expr.position,
                        value: expr.value,
                        steps: steps,
                        keepSingletonArray: keepSA,
                    };
                case "[": {
                    // predicated step
                    // LHS is a step or a predicated step
                    // RHS is the predicate expr
                    let node = ast_optimize(expr.lhs, collect);
                    var step = node;
                    if (node.type === "path") {
                        step = node.steps[node.steps.length - 1];
                    }
                    if (typeof step.group !== "undefined") {
                        throw {
                            code: "S0209",
                            stack: new Error().stack,
                            position: expr.position,
                        };
                    }
                    // If no predicates are associated with this step, initialize the
                    // array to be empty.
                    if (typeof step.predicate === "undefined") {
                        step.predicate = [];
                    }
                    // Add the current RHS to the list of predicates for this step.
                    // Multiple predicates can accumulate (i.e., step.predicate may
                    // have already had elements in it before getting here).
                    step.predicate.push(ast_optimize(expr.rhs, collect));
                    return node;
                }
                case "{": {
                    // group-by
                    // LHS is a step or a predicated step
                    // RHS is the object constructor expr
                    let node = ast_optimize(expr.lhs, collect);
                    if (typeof node.group !== "undefined") {
                        throw {
                            code: "S0210",
                            stack: new Error().stack,
                            position: expr.position,
                        };
                    }
                    // object constructor - process each pair
                    node.group = {
                        lhs: expr.rhs.map(pair => {
                            return [ast_optimize(pair[0], collect), ast_optimize(pair[1], collect)];
                        }),
                        position: expr.position,
                    };
                    return node;
                }
                case ":=": {
                    let lhs = ast_optimize(expr.lhs, collect);
                    let rhs = ast_optimize(expr.rhs, collect);
                    return {
                        type: "bind",
                        value: expr.value,
                        position: expr.position,
                        lhs: lhs,
                        rhs: rhs,
                    };
                }
                case "~>": {
                    let lhs = ast_optimize(expr.lhs, collect);
                    let rhs = ast_optimize(expr.rhs, collect);
                    return {
                        type: "apply",
                        value: expr.value,
                        position: expr.position,
                        lhs: lhs,
                        rhs: rhs,
                    };
                }
                default:
                    return {
                        ...expr,
                        lhs: ast_optimize(expr.lhs, collect),
                        rhs: ast_optimize(expr.rhs, collect),
                    };
            }
        }
        case "sort":
            return {
                type: "sort",
                value: expr.value,
                position: expr.position,
                lhs: ast_optimize(expr.lhs, collect),
                rhs: expr.rhs.map(term => ({ ...term, expression: ast_optimize(term.expression, collect) })),
            };
        case "unary":
            switch (expr.value) {
                case "[": {
                    let expressions = expr.expressions.map(item => ast_optimize(item, collect));
                    return {
                        ...expr,
                        expressions: expressions,
                    };
                }
                case "{": {
                    let lhs = expr.lhs.map(pair => {
                        return [ast_optimize(pair[0], collect), ast_optimize(pair[1], collect)];
                    });
                    return {
                        ...expr,
                        lhs: lhs,
                    };
                }
                default: {
                    // all other unary expressions - just process the expression
                    let expression = ast_optimize(expr.expression, collect);
                    // if unary minus on a number, then pre-process
                    if (expr.value === "-" && expression.type === "literal" && isNumeric(expression.value)) {
                        return {
                            ...expression,
                            value: -expression.value,
                        };
                    }
                    return {
                        ...expr,
                        expression: expression,
                    };
                }
            }
        case "function":
        case "partial": {
            let args = expr.arguments.map(arg => {
                return ast_optimize(arg, collect);
            });
            let procedure = ast_optimize(expr.procedure, collect);
            return {
                ...expr,
                arguments: args,
                procedure: procedure,
            };
        }
        case "lambda": {
            let body = ast_optimize(expr.body, collect);
            body = tail_call_optimize(body);
            // All arguments to a lambda should be variables so running
            // ast_optimize should be a NO-OP.  But I run it anyway just in case
            // those semantics change some day.  This keeps things consistent
            // and doesn't impact the results.
            let args = expr.arguments.map(arg => ast_optimize(arg, collect));
            return {
                ...expr,
                body: body,
                arguments: args,
            };
        }
        case "condition": {
            let condition = ast_optimize(expr.condition, collect);
            let then = ast_optimize(expr.then, collect);
            let otherwise: undefined | ast.ASTNode = undefined;
            if (typeof expr.else !== "undefined") {
                otherwise = ast_optimize(expr.else, collect);
            }
            return {
                type: "condition",
                position: expr.position,
                value: expr.value,
                condition: condition,
                then: then,
                else: otherwise,
            };
        }
        case "transform": {
            let pattern = ast_optimize(expr.pattern, collect);
            let update = ast_optimize(expr.update, collect);
            let del: undefined | ast.ASTNode = undefined;
            if (typeof expr.delete !== "undefined") {
                del = ast_optimize(expr.delete, collect);
            }
            return {
                type: "transform",
                position: expr.position,
                value: expr.value,
                pattern: pattern,
                update: update,
                delete: del,
            };
        }
        case "block":
            // TODO scan the array of expressions to see if any of them assign variables
            // if so, need to mark the block as one that needs to create a new frame
            let expressions = expr.expressions.map(item => {
                return ast_optimize(item, collect);
            });
            return {
                type: "block",
                value: expr.value,
                position: expr.position,
                expressions: expressions,
            };
        case "name":
            return {
                type: "path",
                value: expr.value,
                position: expr.position,
                keepSingletonArray: false,
                steps: [expr],
            };
        case "literal":
        case "wildcard":
        case "descendant":
        case "variable":
        case "regex":
            return expr;
        case "singleton": {
            // Optimize the AST node wrapped by this singleton decorator
            let opt = ast_optimize(expr.next, collect);

            // No matter which branch we take, we replace the singleton with
            // a path node with the keepSingleArray flag set.
            if (opt.type==="path") {
                // If this is a path, then we can simply set the keepSingleArray
                // fields on it.
                return {
                    ...opt,
                    keepSingletonArray: true,
                }
            } else {
                // If this isn't a path, create a length 1 path and mark it as preserving
                // singleton arrays.
                return {
                    type: "path",
                    value: opt.value,
                    position: opt.position,
                    steps: [opt],
                    keepSingletonArray: true,
                }
            }
        }
        case "operator":
            // the tokens 'and' and 'or' might have been used as a name rather than an operator
            if (expr.value === "and" || expr.value === "or" || expr.value === "in") {
                return ast_optimize({ ...expr, type: "name" }, collect);
            } else {
                /* istanbul ignore else */
                if (expr.value === "?") {
                    // partial application
                    return { ...expr };
                } else {
                    throw {
                        code: "S0201",
                        stack: new Error().stack,
                        position: expr.position,
                        token: expr.value,
                    };
                }
            }
        case "error":
            if (expr.lhs) {
                return ast_optimize(expr.lhs, collect);
            }
            return expr;
        default:
            var code = "S0206";
            /* istanbul ignore else */
            if (expr.type == "end") {
                code = "S0207";
            }
            var err: ast.ErrorFields = {
                code: code,
                position: expr.position,
                token: expr.value,
            };
            if (collect) {
                collect(err);
                return {
                    type: "error",
                    error: err,
                    lhs: expr,
                    remaining: [],
                    value: expr.value,
                    position: expr.position,
                };
            } else {
                err.stack = new Error().stack;
                throw err;
            }
    }
}

/**
 * This checks a node to see if it is an array constructor.  If so,
 * it marks it with the `consarray` field which is used to indicate the
 * node should not be flattened. (?)
 *
 * @param node The node to check
 */
function markAsArray(node: ast.ASTNode) {
    if (node.type === "unary") {
        let unary = node;
        if (unary.value === "[") {
            let array = unary;
            array.consarray = true;
        }
    }
}
