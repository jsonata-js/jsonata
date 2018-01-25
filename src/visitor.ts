import * as ast from "./ast";

export interface Visitor {
    visitWildcard?: (node: ast.WildcardNode) => void;
    visitDescendant?: (node: ast.DescendantNode) => void;
    visitError?: (node: ast.ErrorNode) => void;
    visitVariable?: (node: ast.VariableNode) => void;
    visitName?: (node: ast.NameNode) => void;
    visitLiteral?: (node: ast.LiteralNode) => void;
    visitRegex?: (node: ast.RegexNode) => void;
    visitOperator?: (node: ast.OperatorNode) => void;
    visitEnd?: (node: ast.EndNode) => void;
    enterUnary?: (node: ast.UnaryNode) => void;
    exitUnary?: (node: ast.UnaryNode) => void;
    enterBinary?: (node: ast.BinaryNode) => void;
    exitBinary?: (node: ast.BinaryNode) => void;
    enterBinaryObject?: (node: ast.BinaryObjectNode) => void;
    exitBinaryObject?: (node: ast.BinaryObjectNode) => void;
    enterSort?: (node: ast.BinaryObjectNode) => void;
    exitSort?: (node: ast.BinaryObjectNode) => void;
    enterTernary?: (node: ast.TernaryNode) => void;
    exitTernary?: (node: ast.TernaryNode) => void;
    enterBlock?: (node: ast.BlockNode) => void;
    exitBlock?: (node: ast.BlockNode) => void;
    enterTransform?: (node: ast.TransformNode) => void;
    exitTransform?: (node: ast.TransformNode) => void;
    enterFunction?: (node: ast.FunctionInvocationNode) => void;
    exitFunction?: (node: ast.FunctionInvocationNode) => void;
    enterLambda?: (node: ast.LambdaDefinitionNode) => void;
    exitLambda?: (node: ast.LambdaDefinitionNode) => void;
}

export function throwNever(node: ast.ASTNode, x: never): never {
    throw new Error("Unhandled node type: " + node.type + ": " + JSON.stringify(node));
}

export function walk(node: ast.ASTNode, visitor: Visitor): void {
    let visit = <T extends ast.ASTNode>(f?: (node: T) => void) =>
        void {
            if(f) {
                f(node);
            },
        };
    switch (node.type) {
        case "wildcard":
            return visit(visitor.visitWildcard);
        case "descendant":
            return visit(visitor.visitDescendant);
        case "error":
            return visit(visitor.visitError);
        case "variable":
            return visit(visitor.visitVariable);
        case "name":
            return visit(visitor.visitName);
    }
    //return throwNever(node, node);
}
