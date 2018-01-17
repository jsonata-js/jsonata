// Type definitions for jsonata 1.4
// Project: https://github.com/jsonata-js/jsonata
// Definitions by: Nick <https://github.com/nick121212> and Michael M. Tiller <https://github.com/xogeny>

declare function jsonata(str: string): jsonata.Expression;
declare namespace jsonata {
  interface ExprNode {
      type: string;
      value: any;
      position: number;
  }
  interface Expression {
    evaluate(input: any, bindings?: { [name: string]: any }, callback?: (err: Error, resp: any) => void): any;
    assign(name: string, value: any): void;
    registerFunction(name: string, f: Function, signature?: string): void;
    ast(): ExprNode;
  }
}

export = jsonata;