export interface Tokenizer<TokenType> {
  getTokenFor(lexeme: string): TokenType | null;
}
