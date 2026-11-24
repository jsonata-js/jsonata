// Type definitions for jsonata 2.2
// Project: https://github.com/jsonata-js/jsonata
// Definitions by: Nick <https://github.com/nick121212> and Michael M. Tiller <https://github.com/xogeny>

declare function jsonata(str: string, options?: jsonata.JsonataOptions): jsonata.Expression;
declare namespace jsonata {

  interface JsonataOptions {
    recover?: boolean;
    RegexEngine?: RegExpConstructor;
    timeout?: number;
    stack?: number;
    sequence?: number;
  }

  interface ExprNode {
    type:
        | "binary"
        | "unary"
        | "function"
        | "partial"
        | "lambda"
        | "condition"
        | "transform"
        | "block"
        | "name"
        | "parent"
        | "string"
        | "number"
        | "value"
        | "wildcard"
        | "descendant"
        | "variable"
        | "regexp"
        | "operator"
        | "template"
        | "error";
    value?: any;
    position?: number;
    arguments?: ExprNode[];
    name?: string;
    procedure?: ExprNode;
    steps?: ExprNode[];
    expressions?: ExprNode[];
    stages?: ExprNode[];
    lhs?: ExprNode | ExprNode[] | [ExprNode, ExprNode][];
    rhs?: ExprNode;
    /**
     * for a template string: literal text (strings) and embedded expressions, in order;
     * the position of an embedded expression is that of its opening '{'
     */
    parts?: (string | { expression: ExprNode; position: number })[];
  }

  interface JsonataError extends Error {
    code: string;
    position: number;
    token: string;
  }

  interface Environment {
    bind(name: string | symbol, value: any): void;
    lookup(name: string | symbol): any;
    readonly timestamp: Date;
    readonly async: boolean;
  }

  interface Focus {
    readonly environment: Environment;
    readonly input: any;
  }

  interface Expression {
    evaluate(input: any, bindings?: Record<string, any>): Promise<any>;
    evaluate(input: any, bindings: Record<string, any> | undefined, callback: (err: JsonataError, resp: any) => void): void;
    assign(name: string, value: any): void;
    registerFunction(name: string, implementation: (this: Focus, ...args: any[]) => any, signature?: string): void;
    ast(): ExprNode;
  }
}

export = jsonata;
