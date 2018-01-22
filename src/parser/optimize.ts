import { isNumeric } from "../utils";
import { tail_call_optimize } from "./tail_call";
import { ErrorCollector } from "./types";

// post-parse stage
// the purpose of this is flatten the parts of the AST representing location paths,
// converting them to arrays of steps which in turn may contain arrays of predicates.
// following this, nodes containing '.' and '[' should be eliminated from the AST.
// TODO: Add types and adjust for errors
export function ast_optimize(expr /* : ast.ASTNode */, collect: undefined | ErrorCollector) {
    var result;
    switch (expr.type) {
        case "binary":
            switch (expr.value) {
                case ".":
                    var lstep = ast_optimize(expr.lhs, collect);
                    result = { type: "path", steps: [] };
                    if (lstep.type === "path") {
                        Array.prototype.push.apply(result.steps, lstep.steps);
                    } else {
                        result.steps = [lstep];
                    }
                    var rest = ast_optimize(expr.rhs, collect);
                    if (
                        rest.type === "function" &&
                        rest.procedure.type === "path" &&
                        rest.procedure.steps.length === 1 &&
                        rest.procedure.steps[0].type === "name" &&
                        result.steps[result.steps.length - 1].type === "function"
                    ) {
                        // next function in chain of functions - will override a thenable
                        result.steps[result.steps.length - 1].nextFunction = rest.procedure.steps[0].value;
                    }
                    if (rest.type !== "path") {
                        rest = { type: "path", steps: [rest] };
                    }
                    Array.prototype.push.apply(result.steps, rest.steps);
                    // any steps within a path that are literals, should be changed to 'name'
                    result.steps
                        .filter(function(step) {
                            return step.type === "literal";
                        })
                        .forEach(function(lit) {
                            lit.type = "name";
                        });
                    // any step that signals keeping a singleton array, should be flagged on the path
                    if (
                        result.steps.filter(function(step) {
                            return step.keepArray === true;
                        }).length > 0
                    ) {
                        result.keepSingletonArray = true;
                    }
                    // if first step is a path constructor, flag it for special handling
                    var firststep = result.steps[0];
                    if (firststep.type === "unary" && firststep.value === "[") {
                        firststep.consarray = true;
                    }
                    // if the last step is an array constructor, flag it so it doesn't flatten
                    var laststep = result.steps[result.steps.length - 1];
                    if (laststep.type === "unary" && laststep.value === "[") {
                        laststep.consarray = true;
                    }
                    break;
                case "[":
                    // predicated step
                    // LHS is a step or a predicated step
                    // RHS is the predicate expr
                    result = ast_optimize(expr.lhs, collect);
                    var step = result;
                    if (result.type === "path") {
                        step = result.steps[result.steps.length - 1];
                    }
                    if (typeof step.group !== "undefined") {
                        throw {
                            code: "S0209",
                            stack: new Error().stack,
                            position: expr.position,
                        };
                    }
                    if (typeof step.predicate === "undefined") {
                        step.predicate = [];
                    }
                    step.predicate.push(ast_optimize(expr.rhs, collect));
                    break;
                case "{":
                    // group-by
                    // LHS is a step or a predicated step
                    // RHS is the object constructor expr
                    result = ast_optimize(expr.lhs, collect);
                    if (typeof result.group !== "undefined") {
                        throw {
                            code: "S0210",
                            stack: new Error().stack,
                            position: expr.position,
                        };
                    }
                    // object constructor - process each pair
                    result.group = {
                        lhs: expr.rhs.map(function(pair) {
                            return [ast_optimize(pair[0], collect), ast_optimize(pair[1], collect)];
                        }),
                        position: expr.position,
                    };
                    break;
                case "^":
                    // order-by
                    // LHS is the array to be ordered
                    // RHS defines the terms
                    result = { type: "sort", value: expr.value, position: expr.position };
                    result.lhs = ast_optimize(expr.lhs, collect);
                    result.rhs = expr.rhs.map(function(terms) {
                        return {
                            descending: terms.descending,
                            expression: ast_optimize(terms.expression, collect),
                        };
                    });
                    break;
                case ":=":
                    result = { type: "bind", value: expr.value, position: expr.position };
                    result.lhs = ast_optimize(expr.lhs, collect);
                    result.rhs = ast_optimize(expr.rhs, collect);
                    break;
                case "~>":
                    result = { type: "apply", value: expr.value, position: expr.position };
                    result.lhs = ast_optimize(expr.lhs, collect);
                    result.rhs = ast_optimize(expr.rhs, collect);
                    break;
                default:
                    result = { type: expr.type, value: expr.value, position: expr.position };
                    result.lhs = ast_optimize(expr.lhs, collect);
                    result.rhs = ast_optimize(expr.rhs, collect);
            }
            break;
        case "unary":
            result = { type: expr.type, value: expr.value, position: expr.position };
            if (expr.value === "[") {
                // array constructor - process each item
                result.expressions = expr.expressions.map(function(item) {
                    return ast_optimize(item, collect);
                });
            } else if (expr.value === "{") {
                // object constructor - process each pair
                result.lhs = expr.lhs.map(function(pair) {
                    return [ast_optimize(pair[0], collect), ast_optimize(pair[1], collect)];
                });
            } else {
                // all other unary expressions - just process the expression
                result.expression = ast_optimize(expr.expression, collect);
                // if unary minus on a number, then pre-process
                if (expr.value === "-" && result.expression.type === "literal" && isNumeric(result.expression.value)) {
                    result = result.expression;
                    result.value = -result.value;
                }
            }
            break;
        case "function":
        case "partial":
            result = { type: expr.type, name: expr.name, value: expr.value, position: expr.position };
            result.arguments = expr.arguments.map(function(arg) {
                return ast_optimize(arg, collect);
            });
            result.procedure = ast_optimize(expr.procedure, collect);
            break;
        case "lambda":
            result = {
                type: expr.type,
                arguments: expr.arguments,
                signature: expr.signature,
                position: expr.position,
            };
            var body = ast_optimize(expr.body, collect);
            result.body = tail_call_optimize(body);
            break;
        case "condition":
            result = { type: expr.type, position: expr.position };
            result.condition = ast_optimize(expr.condition, collect);
            // TODO: Yikes!  This is very dangerous (might appear like a Promise)
            result.then = ast_optimize(expr.then, collect);
            if (typeof expr.else !== "undefined") {
                result.else = ast_optimize(expr.else, collect);
            }
            break;
        case "transform":
            result = { type: expr.type, position: expr.position };
            result.pattern = ast_optimize(expr.pattern, collect);
            result.update = ast_optimize(expr.update, collect);
            if (typeof expr.delete !== "undefined") {
                result.delete = ast_optimize(expr.delete, collect);
            }
            break;
        case "block":
            result = { type: expr.type, position: expr.position };
            // array of expressions - process each one
            result.expressions = expr.expressions.map(function(item) {
                return ast_optimize(item, collect);
            });
            // TODO scan the array of expressions to see if any of them assign variables
            // if so, need to mark the block as one that needs to create a new frame
            break;
        case "name":
            result = { type: "path", steps: [expr] };
            if (expr.keepArray) {
                result.keepSingletonArray = true;
            }
            break;
        case "literal":
        case "wildcard":
        case "descendant":
        case "variable":
        case "regex":
            result = expr;
            break;
        case "operator":
            // the tokens 'and' and 'or' might have been used as a name rather than an operator
            if (expr.value === "and" || expr.value === "or" || expr.value === "in") {
                expr.type = "name";
                result = ast_optimize(expr, collect);
            } else {
                /* istanbul ignore else */

                if (expr.value === "?") {
                    // partial application
                    result = expr;
                } else {
                    throw {
                        code: "S0201",
                        stack: new Error().stack,
                        position: expr.position,
                        token: expr.value,
                    };
                }
            }
            break;
        case "error":
            result = expr;
            if (expr.lhs) {
                result = ast_optimize(expr.lhs, collect);
            }
            break;
        default:
            var code = "S0206";
            /* istanbul ignore else */
            if (expr.type == "end") {
                code = "S0207";
            }
            var err = {
                code: code,
                position: expr.position,
                token: expr.value,
            };
            if (collect) {
                collect(err);
                return { type: "error", error: err };
            } else {
                (err as any).stack = new Error().stack;
                throw err;
            }
    }
    return result;
}
