import * as nodes from "./tinyjs-node";
import * as tokens from "./tinyjs-token";
import { TinyJSSyntax } from "./syntax-state-machine";
import { AstBuilder } from "../../../core/lib/parser/ast-builder";
import type { NextHandler } from "./syntax-state-machine";
import type { Node as TinyJSNode } from "./tinyjs-node";
import type { Token as TinyJSToken } from "./tinyjs-token";

export class TinyJSAstBuilder implements AstBuilder<TinyJSToken, TinyJSNode> {
  private stack: Array<TinyJSNode> = [];
  private readonly syntax: TinyJSSyntax = new TinyJSSyntax();
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

  consumeToken(token: TinyJSToken): boolean {
    if (this.currentTokenHandler === null) {
      return false;
    }
    this.currentTokenHandler = this.currentTokenHandler(token);
    return true;
  }

  private createProgram(): nodes.TinyJSProgram {
    const declarations: Array<nodes.TinyJSProcedureDeclaration> = new Array(
      this.stack.length
    );
    for (let i = 0; i < this.stack.length; i++) {
      const declaration = this.stack[i];
      this.assertProcedureDeclaration(declaration);
      declarations[i] = declaration;
    }
    return new nodes.TinyJSProgram(declarations);
  }

  private pushProcedureDeclaration() {
    if (this.stack.length === 0) return;
    const statements: Array<nodes.Statement> = [];
    let currentStatement = this.stack.pop();
    while (
      this.stack.length !== 0 &&
      currentStatement !== undefined &&
      !(currentStatement instanceof nodes.TinyJSIdentifier)
    ) {
      this.assertStatement(currentStatement);
      statements.unshift(currentStatement);
      currentStatement = this.stack.pop();
    }
    if (!(currentStatement instanceof nodes.TinyJSIdentifier)) {
      return;
    }
    this.stack.push(
      new nodes.TinyJSProcedureDeclaration(currentStatement, statements)
    );
  }

  private pushNumberNode(token: tokens.NumberToken) {
    this.stack.push(new nodes.TinyJSNumber(token.text));
  }

  private pushIdentifierNode(token: tokens.IdentifierToken) {
    this.stack.push(new nodes.TinyJSIdentifier(token.name));
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
    node: TinyJSNode | undefined
  ): asserts node is nodes.Expression {
    this.assert(node !== undefined, new Error("never"));
    this.assert(
      node instanceof nodes.TinyJSIdentifier || node instanceof nodes.TinyJSNumber,
      new SyntaxError("Only expressions available here!")
    );
  }

  private assertIdentifier(
    node: TinyJSNode | undefined
  ): asserts node is nodes.TinyJSIdentifier {
    this.assert(node !== undefined, new Error("never"));
    this.assert(
      node instanceof nodes.TinyJSIdentifier,
      new SyntaxError("Only identifiers available here!")
    );
  }

  private assertProcedureDeclaration(
    node: TinyJSNode | undefined
  ): asserts node is nodes.TinyJSProcedureDeclaration {
    this.assert(node !== undefined, new Error("never"));
    this.assert(
      node instanceof nodes.TinyJSProcedureDeclaration,
      new SyntaxError("Only procedure declarations available here!")
    );
  }

  private assertStatement(
    node: TinyJSNode | undefined
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
