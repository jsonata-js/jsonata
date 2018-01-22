import * as ast from "./ast";
import { Token } from "../tokenizer";
export type NUD = (state: ParserState) => ast.ASTNode;
export type LED = (state: ParserState, left: ast.ASTNode) => ast.ASTNode;

export interface Symbol {
    id: string;
    lbp: number;
    nud: NUD;
    led?: LED;
    position?: number;
    value: any;
}

export interface ParserState {
    readonly symbol: Symbol;
    readonly previousToken: Token;
    readonly token: Token;
    readonly error: any;
    advance: (id?: string, infix?: boolean) => void;
    expression: (rbp: number) => ast.ASTNode;
    handleError: (err) => void;
}

export type SymbolTable = { [id: string]: Symbol };

export type ErrorCollector = (err: any) => void;