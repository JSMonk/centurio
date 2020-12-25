export class UnknownLexemeError extends Error {
  constructor(lexeme: string) {
    super(`Unknown lexeme "${lexeme}", in file`);
  } 
}
