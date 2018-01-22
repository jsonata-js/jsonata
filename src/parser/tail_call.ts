// tail call optimization
// this is invoked by the post parser to analyse lambda functions to see
// if they make a tail call.  If so, it is replaced by a thunk which will
// be invoked by the trampoline loop during function application.
// This enables tail-recursive functions to be written without growing the stack
export function tail_call_optimize(expr) {
    var result;
    if (expr.type === "function") {
        var thunk = { type: "lambda", thunk: true, arguments: [], position: expr.position, body: expr };
        result = thunk;
    } else if (expr.type === "condition") {
        // analyse both branches
        expr.then = tail_call_optimize(expr.then);
        if (typeof expr.else !== "undefined") {
            expr.else = tail_call_optimize(expr.else);
        }
        result = expr;
    } else if (expr.type === "block") {
        // only the last expression in the block
        var length = expr.expressions.length;
        if (length > 0) {
            expr.expressions[length - 1] = tail_call_optimize(expr.expressions[length - 1]);
        }
        result = expr;
    } else {
        result = expr;
    }
    return result;
}
