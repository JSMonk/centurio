"use strict";
exports.__esModule = true;
exports.ASTNodeType = exports.Operators = void 0;
var Operators;
(function (Operators) {
    Operators["EQUALS"] = "Equals";
})(Operators = exports.Operators || (exports.Operators = {}));
var ASTNodeType;
(function (ASTNodeType) {
    ASTNodeType["BINARY_OPERATION"] = "BinaryExpression";
    ASTNodeType["BLOCK"] = "Block";
    ASTNodeType["CALL"] = "CallExpression";
    ASTNodeType["FUNCTION_DECLARATION"] = "FunctionDeclaration";
    ASTNodeType["IDENTIFIER"] = "Identifier";
    ASTNodeType["NUMERIC_LITERAL"] = "NumericLiteral";
    ASTNodeType["SOURCE_FILE"] = "SourceFile";
})(ASTNodeType = exports.ASTNodeType || (exports.ASTNodeType = {}));
