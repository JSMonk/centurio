import * as token from "./tinyjs-token";
import { TinyJSKeyword } from "./tinyjs-keywords";
import type { Tokenizer } from "../../../core/lib/parser/tokenizer";
import type { Token as TinyJSToken } from "./tinyjs-token";

export class TinyJSTokenizer implements Tokenizer<TinyJSToken> {
  getTokenFor(lexeme: string): TinyJSToken | null {
    switch (true) {
      case this.isEqualsKeyword(lexeme):
        return new token.EqualsToken();
      case this.isPrintKeyword(lexeme):
        return new token.PrintToken();
      case this.isSubProgramKeyword(lexeme):
        return new token.SubprogramToken();
      case this.isSubProgramBody(lexeme):
        return new token.SubprogramBodyStartToken();
      case this.isSubProgramEnd(lexeme):
        return new token.SubprogramBodyEndToken();
      case this.isNumberLexeme(lexeme):
        return new token.NumberToken(lexeme);
      case this.isIdentifierLexeme(lexeme):
        return new token.IdentifierToken(lexeme);
      case this.isLeftParenthes(lexeme):
        return new token.LeftParanthes();
      case this.isRightParenthes(lexeme):
        return new token.RightParanthes();
    }
    return null;
  }

  private isIdentifierLexeme(lexeme: string): boolean {
    return /^\w[\d\w_]*$/g.test(lexeme);
  }

  private isNumberLexeme(lexeme: string): boolean {
    return /^\d+$/gi.test(lexeme);
  }

  private isEqualsKeyword(lexeme: string): lexeme is TinyJSKeyword.EQUALS {
    return lexeme === TinyJSKeyword.EQUALS;
  }

  private isLeftParenthes(
    lexeme: string
  ): lexeme is TinyJSKeyword.LEFT_PARENTHESES {
    return lexeme === TinyJSKeyword.LEFT_PARENTHESES;
  }

  private isRightParenthes(
    lexeme: string
  ): lexeme is TinyJSKeyword.RIGHT_PARENTHESES {
    return lexeme === TinyJSKeyword.RIGHT_PARENTHESES;
  }

  private isPrintKeyword(lexeme: string): lexeme is TinyJSKeyword.PRINT {
    return lexeme === TinyJSKeyword.PRINT;
  }

  private isSubProgramKeyword(
    lexeme: string
  ): lexeme is TinyJSKeyword.SUBPROGRAM {
    return lexeme === TinyJSKeyword.SUBPROGRAM;
  }

  private isSubProgramBody(
    lexeme: string
  ): lexeme is TinyJSKeyword.SUBPROGRAM_BODY {
    return lexeme === TinyJSKeyword.SUBPROGRAM_BODY;
  }

  private isSubProgramEnd(
    lexeme: string
  ): lexeme is TinyJSKeyword.SUBPROGRAM_END {
    return lexeme === TinyJSKeyword.SUBPROGRAM_END;
  }
}
