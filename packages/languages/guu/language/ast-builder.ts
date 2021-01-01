import * as nodes from "./guu-node";
import * as tokens from "./guu-token";
import { GuuSyntax } from "./syntax-state-machine";
import { AstBuilder } from "../../../core/lib/parser/ast-builder";
import type { NextHandler } from "./syntax-state-machine";
import type { Node as GuuNode } from "./guu-node";
import type { Token as GuuToken } from "./guu-token";

export class GuuAstBuilder implements AstBuilder<GuuToken, GuuNode> {
  private stack: Array<GuuNode> = [];
  private readonly syntax: GuuSyntax = new GuuSyntax();
  private currentTokenHandler: NextHandler = this.syntax.getInitialHandler();

  constructor() {
    this.syntax.handleSetBy(() => this.pushSetStatement());
    this.syntax.handleCallBy(() => this.pushCallStatement());
    this.syntax.handlePrintBy(() => this.pushPrintStatement());
    this.syntax.handleIdentifierBy((token) => this.pushIdentifierNode(token));
    this.syntax.handleNumberBy((token) => this.pushNumberNode(token));
    this.syntax.handleSubprogramBy(() => this.pushProcedureDeclaration());
  }

  getFullAST() {
    if (this.currentTokenHandler !== null) {
      this.currentTokenHandler = this.currentTokenHandler(
        new tokens.EndOfFile()
      );
    }
    return this.createProgram();
  }

  consumeToken(token: GuuToken): boolean {
    if (this.currentTokenHandler === null) {
      return false;
    }
    this.currentTokenHandler = this.currentTokenHandler(token);
    return true;
  }

  private createProgram(): nodes.GuuProgram {
    const declarations: Array<nodes.GuuProcedureDeclaration> = new Array(
      this.stack.length
    );
    for (let i = 0; i < this.stack.length; i++) {
      const declaration = this.stack[i];
      this.assertProcedureDeclaration(declaration);
      declarations[i] = declaration;
    }
    return new nodes.GuuProgram(declarations);
  }

  private pushProcedureDeclaration() {
    if (this.stack.length === 0) return;
    const statements: Array<nodes.Statement> = [];
    let currentStatement = this.stack.pop();
    while (
      this.stack.length !== 0 &&
      currentStatement !== undefined &&
      !(currentStatement instanceof nodes.GuuIdentifier)
    ) {
      this.assertStatement(currentStatement);
      statements.unshift(currentStatement);
      currentStatement = this.stack.pop();
    }
    if (!(currentStatement instanceof nodes.GuuIdentifier)) {
      return;
    }
    this.stack.push(
      new nodes.GuuProcedureDeclaration(currentStatement, statements)
    );
  }

  private pushNumberNode(token: tokens.NumberToken) {
    this.stack.push(new nodes.GuuNumber(token.text));
  }

  private pushIdentifierNode(token: tokens.IdentifierToken) {
    this.stack.push(new nodes.GuuIdentifier(token.name));
  }

  private pushCallStatement() {
    const callee = this.stack.pop();
    this.assertIdentifier(callee);
    this.stack.push(new nodes.CallStatement(callee));
  }

  private pushPrintStatement() {
    const argument = this.stack.pop();
    this.assertExpression(argument);
    this.stack.push(new nodes.PrintStatement(argument));
  }

  private pushSetStatement() {
    const value = this.stack.pop();
    this.assertExpression(value);
    const identifier = this.stack.pop();
    this.assertIdentifier(identifier);
    this.stack.push(new nodes.SetStatement(identifier, value));
  }

  private assert(condition: unknown, error: Error): asserts condition {
    if (!condition) {
      throw error;
    }
  }

  private assertExpression(
    node: GuuNode | undefined
  ): asserts node is nodes.Expression {
    this.assert(node !== undefined, new Error("never"));
    this.assert(
      node instanceof nodes.GuuIdentifier || node instanceof nodes.GuuNumber,
      new SyntaxError("Only expressions available here!")
    );
  }

  private assertIdentifier(
    node: GuuNode | undefined
  ): asserts node is nodes.GuuIdentifier {
    this.assert(node !== undefined, new Error("never"));
    this.assert(
      node instanceof nodes.GuuIdentifier,
      new SyntaxError("Only identifiers available here!")
    );
  }

  private assertProcedureDeclaration(
    node: GuuNode | undefined
  ): asserts node is nodes.GuuProcedureDeclaration {
    this.assert(node !== undefined, new Error("never"));
    this.assert(
      node instanceof nodes.GuuProcedureDeclaration,
      new SyntaxError("Only procedure declarations available here!")
    );
  }

  private assertStatement(
    node: GuuNode | undefined
  ): asserts node is nodes.Statement {
    this.assert(node !== undefined, new Error("never"));
    this.assert(
      node instanceof nodes.PrintStatement ||
        node instanceof nodes.CallStatement ||
        node instanceof nodes.SetStatement,

      new SyntaxError("Only statements available here!")
    );
  }
}
