import { Token } from "./tokenizer";
import { Signature } from './signatures';

// Potential AST changes
//
//   - Make predicate and group into AST nodes instead of optional fields on every node.
//   - Change unary operator "[" to a different type...?
//   - Get errors? off of BaseNode
//   - Rationalize unary nodes

export interface BaseNode {
    type: string;
    value: any;
    position: number;
    // This gets added to nodes to indicate how a value (assuming it is an object)
    // should be grouped.
    // TODO: Rename lhs...?
    group?: { lhs: ASTNode[][], position: number };
    // This gets added to nodes to specify a list of predicates to filter on.
    predicate?: ASTNode[];
}

export interface WildcardNode extends BaseNode {
    type: "wildcard";
}

export interface DescendantNode extends BaseNode {
    type: "descendant";
}

export interface ErrorFields {
    code: string;
    position?: number;
    token?: string;
    stack?: string;
}

export interface ErrorNode extends BaseNode {
    type: "error";
    error: ErrorFields;
    lhs: ASTNode;
    remaining: Token[];
}

export interface VariableNode extends BaseNode {
    type: "variable";
}

export interface NameNode extends BaseNode {
    type: "name";
}
export interface LiteralNode extends BaseNode {
    type: "literal";
}

export interface RegexNode extends BaseNode {
    type: "regex";
}

export interface OperatorNode extends BaseNode {
    type: "operator";
}

export interface EndNode extends BaseNode {
    type: "end";
    value: string;
}

export type TerminalNode = VariableNode | NameNode | LiteralNode | RegexNode | OperatorNode | EndNode;

export interface UnaryMinusNode extends BaseNode {
    type: "unary";
    value: "-";
    expression: ASTNode;
}

export interface ArrayConstructorNode extends BaseNode {
    type: "unary";
    value: "[";
    expressions: ASTNode[];
    consarray: boolean;
}

export interface UnaryObjectNode extends BaseNode {
    type: "unary";
    value: "{";
    lhs: ASTNode[][];
}

export type UnaryNode = UnaryMinusNode | ArrayConstructorNode | UnaryObjectNode;

export interface BinaryOperationNode extends BaseNode {
    type: "binary";
    value: "+" | "-" | "*" | "/" | "[" | ".." | "." | "[" | ":=" | "~>"; // TODO: There must be more?!? (e.g., comparisons)
    lhs: ASTNode;
    rhs: ASTNode; // ASTNode if operator is "." | "[" | ":=" | "~>"
}

export interface BinaryObjectNode extends BaseNode {
    type: "binary";
    value: "{";
    lhs: ASTNode;
    rhs: ASTNode[]; // ASTNode[] if operator is "{"
}

export type BinaryNode = BinaryOperationNode | BinaryObjectNode;

export interface SortTerm {
    descending: boolean;
    expression: ASTNode;
}

export interface SortNode extends BaseNode {
    type: "sort";
    lhs: ASTNode;
    rhs: SortTerm[];
}

export interface TernaryNode extends BaseNode {
    type: "condition";
    condition: ASTNode;
    then: ASTNode;
    else: ASTNode;
    position: number;
}

export interface BlockNode extends BaseNode {
    type: "block";
    expressions: ASTNode[];
}

export interface TransformNode extends BaseNode {
    type: "transform";
    pattern: ASTNode;
    update: ASTNode;
    delete?: ASTNode;
}

export interface FunctionInvocationNode extends BaseNode {
    type: "function" | "partial";
    procedure: ASTNode;
    arguments: ASTNode[];
    // This is added when creating PathNodes.
    nextFunction?: Function;
}

export interface LambdaDefinitionNode extends BaseNode {
    type: "lambda";
    body: ASTNode;
    signature: Signature;
    arguments: ASTNode[];
    thunk: boolean;
}

export interface SingletonArrayDecorator extends BaseNode {
    type: "singleton";
    next: ASTNode;
}

// This type of node only appears after the AST is optimized
export interface PathNode extends BaseNode {
    type: "path";
    steps: ASTNode[];
    keepSingletonArray: boolean,
}

export interface BindNode extends BaseNode {
    type: "bind";
    lhs: ASTNode;
    rhs: ASTNode;
}

export interface ApplyNode extends BaseNode {
    type: "apply";
    lhs: ASTNode;
    rhs: ASTNode;
}

/**
 * These are the AST nodes that come directly out of the parser before
 * ast_optimize is called.
 */
export type ASTNode =
    | WildcardNode
    | DescendantNode
    | ErrorNode
    | LiteralNode
    | NameNode
    | VariableNode
    | RegexNode
    | OperatorNode
    | UnaryNode
    | BinaryNode
    | BinaryObjectNode
    | SortNode
    | TernaryNode
    | BlockNode
    | TransformNode
    | FunctionInvocationNode
    | LambdaDefinitionNode
    | PathNode
    | BindNode
    | ApplyNode
    | EndNode
    | SingletonArrayDecorator;

