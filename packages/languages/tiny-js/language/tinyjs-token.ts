export class EndOfFile {}
export class SetToken {}
export class CallToken {}
export class PrintToken {}
export class SubprogramToken {}
export class SubprogramBodyStartToken {}
export class SubprogramBodyEndToken {}
export class NumberToken { constructor(public readonly text: string) {} }
export class IdentifierToken { constructor(public readonly name: string) {} }

export type Token = 
  | EndOfFile
  | SetToken
  | CallToken
  | PrintToken
  | SubprogramToken
  | SubprogramBodyStartToken
  | SubprogramBodyEndToken
  | NumberToken
  | IdentifierToken;
