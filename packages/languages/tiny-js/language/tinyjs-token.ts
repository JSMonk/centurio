export class EndOfFile {}
export class EqualsToken {}
export class LeftParanthes {}
export class RightParanthes {}
export class PrintToken {}
export class SubprogramToken {}
export class SubprogramBodyStartToken {}
export class SubprogramBodyEndToken {}
export class NumberToken { constructor(public readonly text: string) {} }
export class IdentifierToken { constructor(public readonly name: string) {} }

export type Token = 
  | EndOfFile
  | EqualsToken
  | LeftParanthes
  | RightParanthes
  | PrintToken
  | SubprogramToken
  | SubprogramBodyStartToken
  | SubprogramBodyEndToken
  | NumberToken
  | IdentifierToken;
