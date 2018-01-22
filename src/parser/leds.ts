import { LED, ParserState } from "./types";
import { parseSignature } from "../signatures";
import * as ast from "./ast";
import { operators } from "../constants";

export const infixDefaultLED = (bindingPower: number): LED => {
    return (state: ParserState, left: ast.ASTNode): ast.BinaryNode => {
        let initialToken = state.previousToken;
        let rhs = state.expression(bindingPower);
        return {
            value: initialToken.value,
            type: "binary",
            lhs: left,
            rhs: rhs,
        };
    };
};

export const functionLED: LED = (
    state: ParserState,
    left: ast.ASTNode,
): ast.FunctionInvocationNode | ast.LambdaDefinitionNode => {
    // left is is what we are trying to invoke
    let type: "function" | "partial" = "function";
    let args = [];
    let initialToken = state.previousToken;
    if (state.symbol.id !== ")") {
        for (;;) {
            if (state.token.type === "operator" && state.symbol.id === "?") {
                // partial function application
                type = "partial";
                args.push({
                    type: "operator",
                    position: state.token.position,
                    value: state.token.value,
                });
                state.advance("?");
            } else {
                args.push(state.expression(0));
            }
            if (state.symbol.id !== ",") break;
            state.advance(",");
        }
    }
    state.advance(")", true);

    // if the name of the function is 'function' or λ, then this is function definition (lambda function)
    let isLambda = left.type === "name" && (left.value === "function" || left.value === "\u03BB");

    if (!isLambda) {
        let alt: ast.FunctionInvocationNode = {
            position: initialToken.position,
            value: initialToken.value,
            type: type,
            arguments: args,
            procedure: left,
        };
        return alt;
    }
    // all of the args must be VARIABLE tokens
    args.forEach((arg, index) => {
        if (arg.type !== "variable") {
            return state.handleError({
                code: "S0208",
                stack: new Error().stack,
                position: arg.position,
                token: arg.value,
                value: index + 1,
            });
        }
    });
    // is the next token a '<' - if so, parse the function signature
    let signature = undefined;
    if (state.symbol.id === "<") {
        var sigPos = state.token.position;
        var depth = 1;
        var sig = "<";
        let id = state.symbol.id;
        // TODO: Bug in typescript compiler?...doesn't recognize side effects in advance and impact on node value
        while (depth > 0 && id !== "{" && id !== "(end)") {
            state.advance();
            id = state.symbol.id;
            if (id === ">") {
                depth--;
            } else if (id === "<") {
                depth++;
            }
            sig += state.token.value;
        }
        state.advance(">");
        try {
            signature = parseSignature(sig);
        } catch (err) {
            // insert the position into this error
            err.position = sigPos + err.offset;
            // TODO: If recover is true, we need to force the return of an
            // error node here.  In the tests, recover is never set so this
            // always throws.
            state.handleError(err);
            /* istanbul ignore next */
            throw err;
        }
    }
    // parse the function body
    state.advance("{");
    let body = state.expression(0);
    state.advance("}");
    return {
        value: initialToken.value,
        type: "lambda",
        body: body,
        signature: signature,
        procedure: left,
        arguments: args,
    };
};

export const filterLED: LED = (state: ParserState, left: ast.ASTNode): ast.ASTNode | ast.BinaryNode => {
    let initialToken = state.previousToken;
    if (state.symbol.id === "]") {
        // empty predicate means maintain singleton arrays in the output
        var step = left;
        while (step && step.type === "binary" && step.value === "[") {
            let s = step as ast.BinaryNode;
            step = s.lhs;
        }
        step.keepArray = true;
        state.advance("]");
        return left;
    } else {
        let rhs = state.expression(operators["]"]);
        state.advance("]", true);
        let ret: ast.BinaryNode = {
            value: initialToken.value,
            type: "binary",
            lhs: left,
            rhs: rhs,
        };
        return ret;
    }
};

export const orderByLED: LED = (state: ParserState, left: ast.ASTNode): ast.BinaryNode => {
    let initialToken = state.previousToken;
    state.advance("(");
    var terms = [];
    for (;;) {
        var term = {
            descending: false,
        };
        if (state.symbol.id === "<") {
            // ascending sort
            state.advance("<");
        } else if (state.symbol.id === ">") {
            // descending sort
            term.descending = true;
            state.advance(">");
        } else {
            //unspecified - default to ascending
        }
        // TODO: Fix any cast
        (term as any).expression = state.expression(0);
        terms.push(term);
        if (state.symbol.id !== ",") {
            break;
        }
        state.advance(",");
    }
    state.advance(")");
    return {
        position: initialToken.position, // REQUIRED?!?
        value: initialToken.value,
        type: "binary",
        lhs: left,
        rhs: terms, // TODO: Not an expression node...different node type recommended
    };
};

export const objectParserLED: LED = (state: ParserState, left: ast.ASTNode): ast.BinaryNode => {
    var a = [];
    let initialToken = state.previousToken;
    /* istanbul ignore else */
    if (state.symbol.id !== "}") {
        for (;;) {
            var n = state.expression(0);
            state.advance(":");
            var v = state.expression(0);
            a.push([n, v]); // holds an array of name/value expression pairs
            if (state.symbol.id !== ",") {
                break;
            }
            state.advance(",");
        }
    }
    state.advance("}", true);
    // LED - binary infix form
    return {
        value: initialToken.value,
        type: "binary",
        lhs: left,
        rhs: a,
    };
};
