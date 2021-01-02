import { TinyJSASTNodeType } from "./tinyjs-node-type";

export type Node =
  | Expression
  | Statement
  | TinyJSProcedureDeclaration
  | TinyJSProgram;

export class TinyJSProgram {
  readonly type = TinyJSASTNodeType.SOURCE_FILE;
  constructor(public readonly declarations: Array<TinyJSProcedureDeclaration>) {}
}
export class TinyJSBlock {
  readonly type = TinyJSASTNodeType.BLOCK;
  constructor(public readonly statements: Array<Statement>) {}
}
export class TinyJSProcedureDeclaration {
  readonly type = TinyJSASTNodeType.PROCEDURE_DECLARATION;
  constructor(
    public readonly identifier: TinyJSIdentifier,
    public readonly body: Array<Statement>
  ) {}
}
export class TinyJSFunctionDeclaration {
  readonly type = TinyJSASTNodeType.FUNCTION_DECLARATION;
  constructor(
    public readonly identifier: TinyJSIdentifier,
    public readonly args: Array<TinyJSIdentifier>,
    public readonly body: TinyJSBlock
  ) {}
}

// Statements
export type Statement = CallStatement | PrintStatement | SetStatement;

export class CallStatement {
  readonly type = TinyJSASTNodeType.CALL;
  readonly arguments = [];
  constructor(public readonly identifier: TinyJSIdentifier) {}
}
export class PrintStatement {
  readonly type = TinyJSASTNodeType.PRINT;
  constructor(public readonly argument: Expression) {}
}
export class SetStatement {
  readonly type = TinyJSASTNodeType.ASSIGNMENT;
  constructor(
    public readonly variable: TinyJSIdentifier,
    public readonly value: Expression
  ) {}
}
// Expressions
export type Expression = TinyJSNumber | TinyJSIdentifier;

export class TinyJSIdentifier {
  readonly type = TinyJSASTNodeType.IDENTIFIER;
  constructor(public readonly escapedText: string) {}
}
export class TinyJSNumber {
  readonly type = TinyJSASTNodeType.NUMERIC_LITERAL;
  constructor(public readonly text: string) {}
}
