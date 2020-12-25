export interface AstBuilder<Token, Node> {
  consumeToken(token: Token): boolean;
  getFullAST(): Node;
}
