import { GuuASTNodeType } from "./guu-node-type";

export type Node =
  | Expression
  | Statement
  | GuuProcedureDeclaration
  | GuuProgram;

export class GuuProgram {
  readonly type = GuuASTNodeType.SOURCE_FILE;
  constructor(public readonly declarations: Array<GuuProcedureDeclaration>) {}
}
export class GuuBlock {
  readonly type = GuuASTNodeType.BLOCK;
  constructor(public readonly statements: Array<Statement>) {}
}
export class GuuProcedureDeclaration {
  readonly type = GuuASTNodeType.PROCEDURE_DECLARATION;
  constructor(
    public readonly identifier: GuuIdentifier,
    public readonly body: Array<Statement>
  ) {}
}
export class GuuFunctionDeclaration {
  readonly type = GuuASTNodeType.FUNCTION_DECLARATION;
  constructor(
    public readonly identifier: GuuIdentifier,
    public readonly args: Array<GuuIdentifier>,
    public readonly body: GuuBlock
  ) {}
}

// Statements
export type Statement = CallStatement | PrintStatement | SetStatement;

export class CallStatement {
  readonly type = GuuASTNodeType.CALL;
  readonly arguments = [];
  constructor(public readonly identifier: GuuIdentifier) {}
}
export class PrintStatement {
  readonly type = GuuASTNodeType.PRINT;
  constructor(public readonly argument: Expression) {}
}
export class SetStatement {
  readonly type = GuuASTNodeType.ASSIGNMENT;
  constructor(
    public readonly variable: GuuIdentifier,
    public readonly value: Expression
  ) {}
}
// Expressions
export type Expression = GuuNumber | GuuIdentifier;

export class GuuIdentifier {
  readonly type = GuuASTNodeType.IDENTIFIER;
  constructor(public readonly escapedText: string) {}
}
export class GuuNumber {
  readonly type = GuuASTNodeType.NUMERIC_LITERAL;
  constructor(public readonly text: string) {}
}
