import { tokenizer, Tokenizer, Token } from "../tokenizer";
import { ast_optimize } from "./optimize";
import { createTable } from "./symbols";
import * as ast from "./ast";

import { Symbol, ParserState, SymbolTable } from "./types";

/**
 * The parser was made into a class primarily so it was easier to track the state of
 * the parser.  In version 1.x, the shared state was represented by variables inside
 * a closure, but this way it is a bit easier to see the shared state and a bit easier
 * to implement the supporting functions (as methods).
 */
class Parser implements ParserState {
    symbol: Symbol = undefined;
    previousToken: Token = undefined;
    token: Token = undefined;
    error: any = undefined;

    protected lexer: Tokenizer;
    protected errors: string[] = [];
    protected symbol_table: SymbolTable;
    constructor(protected source: string, protected recover?: boolean) {
        // now invoke the tokenizer and the parser and return the syntax tree
        this.lexer = tokenizer(source);
        this.symbol_table = createTable(recover, this.errors, () => this.remainingTokens());    
    }
    parse(): ast.ASTNode {
        this.advance();
        // parse the tokens
        var expr = this.expression(0);
        if (this.symbol.id !== "(end)") {
            var err = {
                code: "S0201",
                position: this.token.position,
                token: this.token.value,
            };
            this.handleError(err);
        }
    
        // Decide if we want to collect errors and recover, or just throw an error
        let collect = this.recover ? err => this.errors.push(err) : undefined;
        expr = ast_optimize(expr, collect);
    
        if (this.errors.length > 0) {
            expr.errors = this.errors;
        }
    
        return expr;
    }

    private remainingTokens(): Token[] {
        var remaining: Token[] = [];
        if (this.symbol.id !== "(end)") {
            remaining.push(this.token);
        }
        var nxt: Token = this.lexer(undefined);
        while (nxt !== null) {
            remaining.push(nxt);
            nxt = this.lexer(undefined);
        }
        return remaining;
    }

    handleError(err: any): void {
        if (this.recover) {
            // tokenize the rest of the buffer and add it to an error token
            err.remaining = this.remainingTokens();
            this.errors.push(err);
            var symbol = this.symbol_table["(error)"];
            this.symbol = Object.create(symbol);
            this.previousToken = this.token;
            this.token = {
                type: "(error)",
                value: null,
                position: this.token.position,
            };
            this.error = err;
        } else {
            err.stack = new Error().stack;
            throw err;
        }
    }

    advance(id?: string, infix?: boolean) {
        if (id && this.symbol.id !== id) {
            var code;
            if (this.symbol.id === "(end)") {
                // unexpected end of buffer
                code = "S0203";
            } else {
                code = "S0202";
            }
            var err = {
                code: code,
                position: this.token.position,
                token: this.token.value,
                value: id,
            };
            return this.handleError(err);
        }
        var next_token: Token = this.lexer(infix);
        if (next_token === null) {
            let symbol = this.symbol_table["(end)"];
            this.symbol = Object.create(symbol);
            this.previousToken = this.token;
            this.token = {
                type: "(end)",
                value: symbol.value,
                position: this.source.length,
            };
            this.error = undefined;
            return;
        }
        var value = next_token.value;
        var type = next_token.type;
        var symbol;
        switch (type) {
            case "name":
            case "variable":
                symbol = this.symbol_table["(name)"];
                break;
            case "operator":
                symbol = this.symbol_table[value];
                if (!symbol) {
                    return this.handleError({
                        code: "S0204",
                        stack: new Error().stack,
                        position: next_token.position,
                        token: value,
                    });
                }
                break;
            case "string":
            case "number":
            case "value":
                type = "literal";
                symbol = this.symbol_table["(literal)"];
                break;
            case "regex":
                type = "regex";
                symbol = this.symbol_table["(regex)"];
                break;
            /* istanbul ignore next */
            default:
                return this.handleError({
                    code: "S0205",
                    stack: new Error().stack,
                    position: next_token.position,
                    token: value,
                });
        }
    
        this.symbol = Object.create(symbol);
        this.previousToken = this.token;
        this.token = {
                value: value,
                type: type,
                position: next_token.position,
            };
        this.error = undefined;
        return;
    }

    expression(rbp: number): ast.ASTNode {
        let symbol = this.symbol;
        this.advance(null, true);
        var left: ast.ASTNode = symbol.nud(this);
        while (rbp < this.symbol.lbp) {
            symbol = this.symbol;
            this.advance();
            left = symbol.led(this, left);
        }
        return left;
    }
}

// This parser implements the 'Top down operator precedence' algorithm developed by Vaughan R Pratt; http://dl.acm.org/citation.cfm?id=512931.
// and builds on the Javascript framework described by Douglas Crockford at http://javascript.crockford.com/tdop/tdop.html
// and in 'Beautiful Code', edited by Andy Oram and Greg Wilson, Copyright 2007 O'Reilly Media, Inc. 798-0-596-51004-6
export function parser(source: string, recover?: boolean) {
    let p = new Parser(source, recover);
    return p.parse();
}

