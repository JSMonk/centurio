import { ASTNodeType } from "../lib/parser/ast-node-type";
import { GuuASTNodeType } from "./guu-node-type";

export type Node =
  | Expression
  | Statement
  | GuuProcedureDeclaration
  | GuuProgram;

export class GuuProgram {
  readonly type = ASTNodeType.SOURCE_FILE;
  constructor(public readonly statements: Array<GuuProcedureDeclaration>) {}
}
export class GuuBlock {
  readonly type = ASTNodeType.BLOCK;
  constructor(public readonly statements: Array<Statement>) {}
}
export class GuuProcedureDeclaration {
  readonly type = GuuASTNodeType.PROCEDURE_DECLARATION;
  constructor(
    public readonly identifier: GuuIdentifier,
    public readonly body: Array<Statement>
  ) {}
}

// Statements
export type Statement = CallStatement | PrintStatement | SetStatement;

export class CallStatement {
  readonly type = ASTNodeType.CALL;
  readonly arguments = [];
  constructor(public readonly expression: GuuIdentifier) {}
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
  readonly type = ASTNodeType.IDENTIFIER;
  constructor(public readonly escapedText: string) {}
}
export class GuuNumber {
  readonly type = ASTNodeType.NUMERIC_LITERAL;
  constructor(public readonly text: string) {}
}
