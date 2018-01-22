import { NUD, ParserState } from "./types";
import { Token } from "../tokenizer";
import * as ast from "./ast";

export const defaultNUD = (recover: boolean, errors: string[], remainingTokens: () => Token[]): NUD => {
    return (state: ParserState): ast.ErrorNode => {
        // error - symbol has been invoked as a unary operator
        var err: any = {
            code: "S0211",
            // TODO: impacts parser-recovery.js (expects previous token)
            token: state.previousToken.value,
            position: state.previousToken.position,
        };

        if (recover) {
            err.remaining = remainingTokens();
            err.type = "error";
            errors.push(err);
            return err;
        } else {
            err.stack = new Error().stack;
            throw err;
        }
    };
};

export const prefixDefaultNUD = (bindingPower: number): NUD => {
    return (state: ParserState): ast.UnaryNode => {
        let initialToken = state.previousToken;
        let expr = state.expression(bindingPower);
        return {
            value: initialToken.value,
            type: "unary",
            expression: expr,
        };
    };
};

export const terminalNUD: NUD = (state: ParserState): ast.TerminalNode => {
    let token = state.previousToken;
    switch (token.type) {
        case "variable":
            return {
                type: "variable",
                value: token.value,
                position: token.position,
            };
        case "name":
            return {
                type: "name",
                value: token.value,
                position: token.position,
            };
        case "literal":
            return {
                type: "literal",
                value: token.value,
                position: token.position,
            };
        case "regex":
            return {
                type: "regex",
                value: token.value,
                position: token.position,
            };
        case "operator":
            return {
                type: "operator",
                value: token.value,
                position: token.position,
            };
        default:
            /* istanbul ignore next */
            if (state.symbol.id !== "(end)") {
                throw new Error("Unexpected terminal: " + JSON.stringify(self));
            }
            return {
                type: "end",
                value: "(end)",
                position: token.position,
            };
    }
};

export const wildcardNUD = (state: ParserState): ast.WildcardNode => {
    return {
        value: state.previousToken.value,
        type: "wildcard",
    };
};

export const descendantNUD = (state: ParserState): ast.DescendantNode => {
    return {
        value: state.previousToken.value,
        type: "descendant",
    };
};

export const blockNUD = (state: ParserState): ast.BlockNode => {
    var expressions = [];
    while (state.symbol.id !== ")") {
        expressions.push(state.expression(0));
        if (state.symbol.id !== ";") {
            break;
        }
        state.advance(";");
    }
    state.advance(")", true);
    return {
        value: state.token.value,
        type: "block",
        expressions: expressions,
    };
};

export const arrayNUD = (state: ParserState): ast.UnaryNode => {
    var a = [];
    let initialToken = state.previousToken;
    if (state.symbol.id !== "]") {
        for (;;) {
            var item = state.expression(0);
            if (state.symbol.id === "..") {
                let position = state.token.position;
                let lhs = item;
                // range operator
                state.advance("..");
                let rhs = state.expression(0);
                var range: ast.BinaryNode = {
                    type: "binary",
                    value: "..",
                    position: position,
                    lhs: lhs,
                    rhs: rhs,
                };
                item = range;
            }
            a.push(item);
            if (state.symbol.id !== ",") {
                break;
            }
            state.advance(",");
        }
    }
    state.advance("]", true);
    // TODO: Should this be a different type...? (not unary)
    return {
        value: initialToken.value,
        type: "unary",
        expressions: a,
    };
};

export const objectParserNUD: NUD = (state: ParserState): ast.UnaryNode => {
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
    // NUD - unary prefix form
    return {
        value: initialToken.value,
        type: "unary",
        lhs: a, // TODO: use expression
    };
};

export const transformerNUD = (state: ParserState): ast.TransformNode => {
    let initialToken = state.previousToken;
    let expr = state.expression(0);
    state.advance("|");
    let update = state.expression(0);
    let del = undefined;
    if (state.symbol.id === ",") {
        state.advance(",");
        del = state.expression(0);
    }
    state.advance("|");
    return {
        value: initialToken.value,
        type: "transform",
        pattern: expr,
        update: update,
        delete: del,
    };
};
