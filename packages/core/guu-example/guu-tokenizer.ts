import * as token from "./guu-token";
import { GuuKeyword } from "./guu-keywords";
import type { Tokenizer } from "../lib/parser/tokenizer";
import type { Token as GuuToken } from "./guu-token";

export class GuuTokenizer implements Tokenizer<GuuToken> {
  getTokenFor(lexeme: string): GuuToken | null {
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

  private isSetKeyword(lexeme: string): lexeme is GuuKeyword.SET {
    return lexeme === GuuKeyword.SET;
  }

  private isCallKeyword(lexeme: string): lexeme is GuuKeyword.CALL {
    return lexeme === GuuKeyword.CALL;
  }

  private isPrintKeyword(lexeme: string): lexeme is GuuKeyword.PRINT {
    return lexeme === GuuKeyword.PRINT;
  }

  private isSubProgramKeyword(lexeme: string): lexeme is GuuKeyword.SUBPROGRAM {
    return lexeme === GuuKeyword.SUBPROGRAM;
  }

  private isSubProgramBody(
    lexeme: string
  ): lexeme is GuuKeyword.SUBPROGRAM_BODY {
    return lexeme === GuuKeyword.SUBPROGRAM_BODY;
  }
}
