export enum Operators {
  EQUALS = "Equals",
}

export enum ASTNodeType {
  BINARY_OPERATION = "BinaryExpression",
  BLOCK = "Block",
  CALL = "CallExpression",
  FUNCTION_DECLARATION = "FunctionDeclaration",
  IDENTIFIER = "Identifier",
  NUMERIC_LITERAL = "NumericLiteral",
  SOURCE_FILE = "SourceFile",
}
