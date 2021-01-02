import * as token from "./tinyjs-token";
import { TinyJSKeyword } from "./tinyjs-keywords";
import type { Tokenizer } from "../../../core/lib/parser/tokenizer";
import type { Token as TinyJSToken } from "./tinyjs-token";

export class TinyJSTokenizer implements Tokenizer<TinyJSToken> {
  getTokenFor(lexeme: string): TinyJSToken | null {
    switch (true) {
      case this.isSetKeyword(lexeme):
        return new token.SetToken();
      case this.isCallKeyword(lexeme):
        return new token.CallToken();
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
    }
    return null;
  }

  private isIdentifierLexeme(lexeme: string): boolean {
    return /^\w[\d\w_]*$/g.test(lexeme);
  }

  private isNumberLexeme(lexeme: string): boolean {
    return /^\d+$/gi.test(lexeme);
  }

  private isSetKeyword(lexeme: string): lexeme is TinyJSKeyword.SET {
    return lexeme === TinyJSKeyword.SET;
  }

  private isCallKeyword(lexeme: string): lexeme is TinyJSKeyword.CALL {
    return lexeme === TinyJSKeyword.CALL;
  }

  private isPrintKeyword(lexeme: string): lexeme is TinyJSKeyword.PRINT {
    return lexeme === TinyJSKeyword.PRINT;
  }

  private isSubProgramKeyword(lexeme: string): lexeme is TinyJSKeyword.SUBPROGRAM {
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
