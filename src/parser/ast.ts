import { Token } from "../tokenizer";

export interface BaseNode {
    type: string;
    value: any;
    keepArray?: boolean;
    // TODO: This is only added to the root expression node...should probably be a separate return value from parser
    errors?: string[];
}

export interface WildcardNode extends BaseNode {
    type: "wildcard";
}

export interface DescendantNode extends BaseNode {
    type: "descendant";
}

export interface ErrorNode extends BaseNode {
    type: "error";
    // TODO: refine
    error: any;
    // TODO: refine
    lhs: any;
    remaining: Token[];
}

export interface VariableNode extends BaseNode {
    type: "variable";
    position: number;
}

export interface NameNode extends BaseNode {
    type: "name";
    position: number;
}
export interface LiteralNode extends BaseNode {
    type: "literal";
    position: number;
}

export interface RegexNode extends BaseNode {
    type: "regex";
    position: number;
}

export interface OperatorNode extends BaseNode {
    type: "operator";
    position: number;
}

export interface EndNode extends BaseNode {
    type: "end";
    value: string;
    position: number;
}

export type TerminalNode = VariableNode | NameNode | LiteralNode | RegexNode | OperatorNode | EndNode;

export interface UnaryNode extends BaseNode {
    type: "unary";
    // TODO: refine
    expression?: any;
    // TODO: Used by objectParser (should get rid of this eventually)
    lhs?: any;
    // TODO: Used by array constructor
    expressions?: any;
}

export interface BinaryNode extends BaseNode {
    type: "binary";
    value: string; // Could be refined
    lhs: any;
    rhs: any;
    position?: number; // Required for sort operator!?!
}

export interface TernaryNode extends BaseNode {
    type: "condition";
    condition: any;
    then: any;
    else: any;
}

export interface BlockNode extends BaseNode {
    type: "block";
    // TODO: refine
    expressions: any[];
}

export interface TransformNode extends BaseNode {
    type: "transform";
    // TODO: Refine these
    pattern: any;
    update: any;
    delete?: any;
}

export interface FunctionInvocationNode extends BaseNode {
    type: "function" | "partial";
    procedure: any;
    arguments: any;
    position: number;
}

export interface LambdaDefinitionNode extends BaseNode {
    type: "lambda";
    body: any;
    signature: any;
    procedure: any;
    arguments: any;
}

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
    | TernaryNode
    | BlockNode
    | TransformNode
    | FunctionInvocationNode
    | LambdaDefinitionNode
    | EndNode;
