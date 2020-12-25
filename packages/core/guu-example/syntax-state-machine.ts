import * as tokens from "./guu-token";

export type TokenCallback<T extends tokens.Token> = (token: T) => void;
export type NextHandler =
  | null
  | ((token: tokens.Token, next?: NextHandler) => NextHandler);

const DEFAULT_CALLBACK = (_: tokens.Token) => null;

export class GuuSyntax {
  private identifierCallback: TokenCallback<tokens.IdentifierToken> = DEFAULT_CALLBACK;
  private numberCallback: TokenCallback<tokens.NumberToken> = DEFAULT_CALLBACK;
  private printCallback: TokenCallback<tokens.PrintToken> = DEFAULT_CALLBACK;
  private callCallback: TokenCallback<tokens.CallToken> = DEFAULT_CALLBACK;
  private setCallback: TokenCallback<tokens.SetToken> = DEFAULT_CALLBACK;
  private subprogramCallback: TokenCallback<tokens.SubprogramToken> = DEFAULT_CALLBACK;

  handleSubprogramBy(callback: TokenCallback<tokens.SubprogramToken>) {
    this.subprogramCallback = callback;
  }

  handlePrintBy(callback: TokenCallback<tokens.PrintToken>) {
    this.printCallback = callback;
  }

  handleSetBy(callback: TokenCallback<tokens.SetToken>) {
    this.setCallback = callback;
  }

  handleCallBy(callback: TokenCallback<tokens.CallToken>) {
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
      this.assertNotEOF(potentialIdentifier);
      this.identifierHandler(potentialIdentifier);
      return (potentialSubprogramStart: tokens.Token) => {
        this.assertNotEOF(potentialSubprogramStart);
        this.assertSubprogramBodyToken(potentialSubprogramStart);
        const statementOrSubprogram = (token: tokens.Token) => {
          if (token instanceof tokens.EndOfFile) {
            this.subprogramCallback(potentialSub);
            return null;
          }
          if (token instanceof tokens.SubprogramToken) {
            this.subprogramCallback(potentialSub);
            return this.subprogramHandler(token);
          }
          return this.statementHandler(token, statementOrSubprogram);
        };
        return statementOrSubprogram;
      };
    };
  }

  private setHandler(
    potentialSet: tokens.Token,
    next?: NextHandler
  ): NextHandler {
    this.assertSetToken(potentialSet);
    return (potentialIdentifier: tokens.Token) => {
      this.assertNotEOF(potentialIdentifier);
      return (potentialExpression: tokens.Token) => {
        this.assertNotEOF(potentialExpression);
        this.identifierHandler(potentialIdentifier);
        this.expressionHandler(potentialExpression);
        this.setCallback(potentialSet);
        return next ?? null;
      };
    };
  }

  private callHandler(
    potentialCall: tokens.Token,
    next?: NextHandler
  ): NextHandler {
    this.assertCallToken(potentialCall);
    return (potentialIdentifier: tokens.Token) => {
      this.assertNotEOF(potentialIdentifier);
      this.identifierHandler(potentialIdentifier);
      this.callCallback(potentialCall);
      return next ?? null;
    };
  }

  private printHandler(
    potentialPrint: tokens.Token,
    next?: NextHandler
  ): NextHandler {
    this.assertPrintToken(potentialPrint);
    return (potentialExpression: tokens.Token) => {
      this.assertNotEOF(potentialExpression);
      this.expressionHandler(potentialExpression);
      this.printCallback(potentialPrint);
      return next ?? null;
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
    if (token instanceof tokens.SetToken) {
      return this.setHandler(token, next);
    }
    if (token instanceof tokens.CallToken) {
      return this.callHandler(token, next);
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

  private assertCallToken(
    token: tokens.Token | undefined
  ): asserts token is tokens.CallToken {
    this.assert(token !== undefined, new Error("never"));
    this.assert(
      token instanceof tokens.CallToken,
      new SyntaxError("Only call available here!")
    );
  }

  private assertSetToken(
    token: tokens.Token | undefined
  ): asserts token is tokens.SetToken {
    this.assert(token !== undefined, new Error("never"));
    this.assert(
      token instanceof tokens.SetToken,
      new SyntaxError("Only set available here!")
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
      new SyntaxError("':' missed after procedure declaration")
    );
  }

  private assertStatementToken(
    token: tokens.Token | undefined
  ): asserts token is tokens.CallToken | tokens.PrintToken | tokens.SetToken {
    this.assert(token !== undefined, new Error("never"));
    this.assert(
      token instanceof tokens.CallToken ||
        token instanceof tokens.PrintToken ||
        tokens.SetToken,
      new SyntaxError(
        "Only statements like (set, call or print) available here"
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
