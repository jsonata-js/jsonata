import * as ast from '../ast';
import { parseSignature } from "../signatures";

// tail call optimization
// this is invoked by the post parser to analyse lambda functions to see
// if they make a tail call.  If so, it is replaced by a thunk which will
// be invoked by the trampoline loop during function application.
// This enables tail-recursive functions to be written without growing the stack
export function tail_call_optimize(expr: ast.ASTNode): ast.ASTNode {
    switch(expr.type) {
        case "function": {
            return {
                type: "lambda",
                value: expr.value,
                position: expr.position,
                body: expr,
                // Not in v1.5, but ensures that signature isn't undefined
                signature: parseSignature(""),
                thunk: true,
                arguments: [],
            };
        }
        case "condition": {
            let then = tail_call_optimize(expr.then);
            let otherwise: undefined | ast.ASTNode = undefined;
            if (typeof expr.else!=="undefined") {
                otherwise = tail_call_optimize(expr.else);
            }
            return {
                ...expr,
                then: then,
                else: otherwise,
            }
        }
        case "block": {
            let expressions = expr.expressions.map((e, i) => i==expr.expressions.length-1 ? tail_call_optimize(e) : e);
            return {
                ...expr,
                expressions: expressions,
            }
        }
        default:
            return { ...expr };
    }
}
