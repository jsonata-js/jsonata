// Type definitions for jsonata 1.7
// Project: https://github.com/jsonata-js/jsonata
// Definitions by: Nick <https://github.com/nick121212> and Michael M. Tiller <https://github.com/xogeny>

declare function jsonata(str: string): jsonata.Expression;
declare namespace jsonata {

  interface ExprNode {
    type: string;
    value: any;
    position: number;
  }

  interface JsonataError extends Error {
    code: string;
    position: number;
    token: string;
  }

  interface Environment {
    bind(name: string, value: any): void;
    lookup(name: string): any;
    readonly timestamp: Date;
    readonly async: boolean;
  }

  interface Focus {
    readonly environment: Environment;
    readonly input: any;
  }
  interface Expression {
    evaluate(input: any, bindings?: Record<string, any>): any;
    evaluate(input: any, bindings: Record<string, any> | undefined, callback: (err: JsonataError, resp: any) => void): void;
    assign(name: string, value: any): void;
    registerFunction(name: string, implementation: (this: Focus, ...args: any[]) => any, signature?: string): void;
    ast(): ExprNode;
  }
}

export = jsonata;
