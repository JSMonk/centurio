import * as tokens from "./tinyjs-token";

export type TokenCallback<T extends tokens.Token> = (token: T) => void;
export type NextHandler =
  | null
  | ((token: tokens.Token, next?: NextHandler) => NextHandler);

const DEFAULT_CALLBACK = (_: tokens.Token) => null;

export class TinyJSSyntax {
  private identifierCallback: TokenCallback<tokens.IdentifierToken> = DEFAULT_CALLBACK;
  private numberCallback: TokenCallback<tokens.NumberToken> = DEFAULT_CALLBACK;
  private printCallback: TokenCallback<tokens.PrintToken> = DEFAULT_CALLBACK;
  private callCallback: TokenCallback<tokens.IdentifierToken> = DEFAULT_CALLBACK;
  private equalsCallback: TokenCallback<tokens.EqualsToken> = DEFAULT_CALLBACK;
  private subprogramCallback: TokenCallback<tokens.SubprogramToken> = DEFAULT_CALLBACK;

  handleSubprogramBy(callback: TokenCallback<tokens.SubprogramToken>) {
    this.subprogramCallback = callback;
  }

  handlePrintBy(callback: TokenCallback<tokens.PrintToken>) {
    this.printCallback = callback;
  }

  handleEqualsBy(callback: TokenCallback<tokens.EqualsToken>) {
    this.equalsCallback = callback;
  }

  handleCallBy(callback: TokenCallback<tokens.IdentifierToken>) {
    this.callCallback = callback;
  }

  handleIdentifierBy(callback: TokenCallback<tokens.IdentifierToken>) {
    this.identifierCallback = callback;
  }

  handleNumberBy(callback: TokenCallback<tokens.NumberToken>) {
    this.numberCallback = callback;
  }

  public getInitialHandler() {
    return (token: tokens.Token) => {
      if (token instanceof tokens.EndOfFile) {
        return null;
      }
      return this.subprogramHandler(token);
    };
  }

  private subprogramHandler(potentialSub: tokens.Token): NextHandler {
    this.assertSubToken(potentialSub);
    return (potentialIdentifier: tokens.Token) => {
      this.identifierHandler(potentialIdentifier);
      return (potentialSubprogramStart: tokens.Token) => {
        this.assertSubprogramBodyToken(potentialSubprogramStart);
        const statementOrSubprogram = (token: tokens.Token) => {
          if (this.isStatement(token)) {
            return this.statementHandler(token, statementOrSubprogram);
          }
          this.assertSubprogramBodyEndToken(token);
          this.subprogramCallback(potentialSub);
          return this.getInitialHandler();
        };
        return statementOrSubprogram;
      };
    };
  }

  private callOrEqualsHandler(
    potentialIdentifier: tokens.Token,
    next?: NextHandler
  ): NextHandler {
    this.assertIdentifierToken(potentialIdentifier);
    return (equalsOrParenthes: tokens.Token) => {
      if (equalsOrParenthes instanceof tokens.EqualsToken) {
        return this.equalsHandler(potentialIdentifier, next)(
          equalsOrParenthes,
          next
        );
      }
      if (equalsOrParenthes instanceof tokens.LeftParanthes) {
        return this.callHandler(potentialIdentifier, next)(
          equalsOrParenthes,
          next
        );
      }
      throw new SyntaxError(
        `Unexpected token: ${equalsOrParenthes.constructor.name}`
      );
    };
  }

  private equalsHandler(
    potentialIdentifier: tokens.Token,
    next?: NextHandler
  ): NextHandler {
    this.identifierHandler(potentialIdentifier);
    return (potentialEquals: tokens.Token) => {
      this.assertEqualsToken(potentialEquals);
      return (potentialExpression: tokens.Token) => {
        this.expressionHandler(potentialExpression);
        this.equalsCallback(potentialEquals);
        return next ?? null;
      };
    };
  }

  private callHandler(
    potentialCall: tokens.Token,
    next?: NextHandler
  ): NextHandler {
    this.identifierHandler(potentialCall);
    return (potentialLeftParenthes: tokens.Token) => {
      this.assertLeftParanthes(potentialLeftParenthes);
      return (potentialRightParenthes: tokens.Token) => {
        this.assertRightParanthes(potentialRightParenthes);
        this.callCallback(potentialCall as tokens.IdentifierToken);
        return next ?? null;
      };
    };
  }

  private printHandler(
    potentialPrint: tokens.Token,
    next?: NextHandler
  ): NextHandler {
    this.assertPrintToken(potentialPrint);
    return (potentialLeftParenthes: tokens.Token) => {
      this.assertLeftParanthes(potentialLeftParenthes);
      return (potentialExpression: tokens.Token) => {
        this.expressionHandler(potentialExpression);
        return (potentialRightParenthes: tokens.Token) => {
          this.assertRightParanthes(potentialRightParenthes);
          this.printCallback(potentialPrint);
          return next ?? null;
        };
      };
    };
  }

  private identifierHandler(
    token: tokens.Token,
    next?: NextHandler
  ): NextHandler {
    this.assertIdentifierToken(token);
    this.identifierCallback(token);
    return next ?? null;
  }

  private numberHandler(token: tokens.Token, next?: NextHandler): NextHandler {
    this.assertNumberToken(token);
    this.numberCallback(token);
    return next ?? null;
  }

  private expressionHandler(
    token: tokens.Token,
    next?: NextHandler
  ): NextHandler {
    this.assertExpressionToken(token);
    if (token instanceof tokens.IdentifierToken) {
      this.identifierHandler(token, next);
    }
    if (token instanceof tokens.NumberToken) {
      this.numberHandler(token, next);
    }
    return next ?? null;
  }

  private statementHandler(
    token: tokens.Token,
    next?: NextHandler
  ): NextHandler {
    this.assertStatementToken(token);
    if (token instanceof tokens.IdentifierToken) {
      return this.callOrEqualsHandler(token, next);
    }
    if (token instanceof tokens.PrintToken) {
      return this.printHandler(token, next);
    }
    return next ?? null;
  }

  private assertIdentifierToken(
    token: tokens.Token | undefined
  ): asserts token is tokens.IdentifierToken {
    this.assert(token !== undefined, new Error("never"));
    this.assert(
      token instanceof tokens.IdentifierToken,
      new SyntaxError("Only identifiers available here!")
    );
  }

  private assertNumberToken(
    token: tokens.Token | undefined
  ): asserts token is tokens.NumberToken {
    this.assert(token !== undefined, new Error("never"));
    this.assert(
      token instanceof tokens.NumberToken,
      new SyntaxError("Only numbers available here!")
    );
  }

  private assertPrintToken(
    token: tokens.Token | undefined
  ): asserts token is tokens.PrintToken {
    this.assert(token !== undefined, new Error("never"));
    this.assert(
      token instanceof tokens.PrintToken,
      new SyntaxError("Only print available here!")
    );
  }

  private assertEqualsToken(
    token: tokens.Token | undefined
  ): asserts token is tokens.EqualsToken {
    this.assert(token !== undefined, new Error("never"));
    this.assert(
      token instanceof tokens.EqualsToken,
      new SyntaxError("Only = available here!")
    );
  }

  private assertSubToken(
    token: tokens.Token | undefined
  ): asserts token is tokens.SubprogramToken {
    this.assert(token !== undefined, new Error("never"));
    this.assert(
      token instanceof tokens.SubprogramToken,
      new SyntaxError("Only subprogram declaration available here!")
    );
  }

  private assertSubprogramBodyToken(
    token: tokens.Token | undefined
  ): asserts token is tokens.SubprogramBodyStartToken {
    this.assert(token !== undefined, new Error("never"));
    this.assert(
      token instanceof tokens.SubprogramBodyStartToken,
      new SyntaxError("'{' missed after procedure declaration")
    );
  }

  private assertSubprogramBodyEndToken(
    token: tokens.Token | undefined
  ): asserts token is tokens.SubprogramBodyEndToken {
    this.assert(token !== undefined, new Error("never"));
    this.assert(
      token instanceof tokens.SubprogramBodyEndToken,
      new SyntaxError("'}' missed after procedure declaration end")
    );
  }

  private isStatement(
    token: tokens.Token | undefined
  ): token is tokens.IdentifierToken | tokens.PrintToken {
    return (
      token instanceof tokens.IdentifierToken ||
      token instanceof tokens.PrintToken
    );
  }

  private assertStatementToken(
    token: tokens.Token | undefined
  ): asserts token is tokens.IdentifierToken | tokens.PrintToken {
    this.assert(token !== undefined, new Error("never"));
    this.assert(
      token instanceof tokens.IdentifierToken ||
        token instanceof tokens.PrintToken,
      new SyntaxError(
        "Only statements like (call, assignment or print) available here"
      )
    );
  }

  private assertExpressionToken(
    token: tokens.Token | undefined
  ): asserts token is tokens.NumberToken | tokens.IdentifierToken {
    this.assert(token !== undefined, new Error("never"));
    this.assert(
      token instanceof tokens.NumberToken ||
        token instanceof tokens.IdentifierToken,
      new SyntaxError("Only expressions available here!")
    );
  }

  private assertLeftParanthes(
    token: tokens.Token
  ): asserts token is tokens.LeftParanthes {
    this.assert(
      token instanceof tokens.LeftParanthes,
      new SyntaxError("Wanted left parthenest!")
    );
  }

  private assertRightParanthes(
    token: tokens.Token
  ): asserts token is tokens.RightParanthes {
    this.assert(
      token instanceof tokens.RightParanthes,
      new SyntaxError("Wanted right parthenest!")
    );
  }

  private assertNotEOF(token: tokens.Token) {
    this.assert(
      !(token instanceof tokens.EndOfFile),
      new SyntaxError("Unexpected end of file")
    );
  }

  private assert(condition: unknown, error: Error): asserts condition {
    if (!condition) {
      throw error;
    }
  }
}
