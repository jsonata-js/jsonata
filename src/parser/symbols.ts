import { operators } from "../constants";
import { Symbol, LED, NUD, ParserState, SymbolTable } from "./types";
import { Token } from "../tokenizer";
import * as nuds from "./nuds";
import * as leds from "./leds";
import * as ast from "../ast";

export function createTable(recover: boolean, errors: string[], remainingTokens: () => Token[]): SymbolTable {
    let symbol_table: { [id: string]: Symbol } = {};

    var getSymbol = (id, bp: number): Symbol => {
        bp = bp || 0;
        if (symbol_table.hasOwnProperty(id)) {
            let s = symbol_table[id];
            // TODO: Should this ever happen?!?  Aren't we overwriting something?!?
            if (bp >= s.lbp) {
                s.lbp = bp;
            }
            return s;
        } else {
            let s: Symbol = {
                id: id,
                lbp: bp,
                value: id,
                nud: nuds.defaultNUD(recover, errors, remainingTokens),
            };
            symbol_table[id] = s;
            return s;
        }
    };

    // A terminal could be a 'literal', 'variable', 'name'
    var terminal = id => {
        var s = getSymbol(id, 0);
        s.nud = nuds.terminalNUD;
    };

    // match infix operators
    // <expression> <operator> <expression>
    // left associative
    // TODO: Add default values for bp and led
    var infix = (id: string, bp?: number, led?: LED) => {
        var bindingPower = bp || operators[id];
        var s = getSymbol(id, bindingPower);
        let defaultLED: LED = leds.infixDefaultLED(bindingPower);
        s.led = led || defaultLED;
        return s;
    };

    // match infix operators
    // <expression> <operator> <expression>
    // right associative
    // TODO: Add default values for bp and led
    var infixr = (id, bp?, led?: LED) => {
        var bindingPower = bp || operators[id];
        var s = getSymbol(id, bindingPower);
        let defaultLED: LED = leds.infixDefaultLED(bindingPower - 1); // subtract 1 from bindingPower for right associative operators
        s.led = led || defaultLED;
        return s;
    };

    // match prefix operators
    // <operator> <expression>
    var prefix = (id, nud?: NUD) => {
        var s = getSymbol(id, 0);
        let defaultNUD: NUD = nuds.prefixDefaultNUD(70);
        s.nud = nud || defaultNUD;
        return s;
    };

    terminal("(end)");
    terminal("(name)");
    terminal("(literal)");
    terminal("(regex)");
    getSymbol(":", 0);
    getSymbol(";", 0);
    getSymbol(",", 0);
    getSymbol(")", 0);
    getSymbol("]", 0);
    getSymbol("}", 0);
    getSymbol("..", 0); // range operator
    infix("."); // field reference
    infix("+"); // numeric addition
    infix("-"); // numeric subtraction
    infix("*"); // numeric multiplication
    infix("/"); // numeric division
    infix("%"); // numeric modulus
    infix("="); // equality
    infix("<"); // less than
    infix(">"); // greater than
    infix("!="); // not equal to
    infix("<="); // less than or equal
    infix(">="); // greater than or equal
    infix("&"); // string concatenation
    infix("and"); // Boolean AND
    infix("or"); // Boolean OR
    infix("in"); // is member of array
    terminal("and"); // the 'keywords' can also be used as terminals (field names)
    terminal("or"); //
    terminal("in"); //
    infixr(":="); // bind variable
    prefix("-"); // unary numeric negation
    infix("~>"); // function application

    infixr("(error)", 10, (state: ParserState, left: ast.ASTNode): ast.ErrorNode => {
        return {
            value: state.token.value,
            position: state.token.position,
            lhs: left,
            error: state.error,
            remaining: remainingTokens(),
            type: "error",
        };
    });

    // field wildcard (single level)
    prefix("*", nuds.wildcardNUD);

    // descendant wildcard (multi-level)
    prefix("**", nuds.descendantNUD);

    // function invocation
    infix("(", operators["("], leds.functionLED);

    // parenthesis - block expression
    prefix("(", nuds.blockNUD);

    // array constructor
    prefix("[", nuds.arrayNUD);

    // filter - predicate or array index
    infix("[", operators["["], leds.filterLED);

    // order-by
    infix("^", operators["^"], leds.orderByLED);

    // object constructor
    prefix("{", nuds.objectParserNUD);

    // object grouping
    infix("{", operators["{"], leds.objectParserLED);

    // if/then/else ternary operator ?:
    infix("?", operators["?"], (state: ParserState, left): ast.TernaryNode => {
        let initialToken = state.previousToken;
        let then = state.expression(0);
        let otherwise = undefined;
        if (state.symbol.id === ":") {
            // else condition
            state.advance(":");
            otherwise = state.expression(0);
        }
        return {
            value: initialToken.value,
            position: initialToken.position,
            type: "condition",
            condition: left,
            then: then,
            else: otherwise,
        };
    });

    // object transformer
    prefix("|", nuds.transformerNUD);

    return symbol_table;
}
