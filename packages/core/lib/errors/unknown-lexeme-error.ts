import { CheckedError } from "./checked-error";

export class UnknownLexemeError extends CheckedError {
  constructor(lexeme: string) {
    super(`Unknown lexeme "${lexeme}", in file`);
  }
}
