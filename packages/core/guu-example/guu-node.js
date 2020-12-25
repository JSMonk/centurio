"use strict";
exports.__esModule = true;
exports.GuuNumber = exports.GuuIdentifier = exports.SetStatement = exports.PrintStatement = exports.CallStatement = exports.GuuProcedureDeclaration = exports.GuuBlock = exports.GuuProgram = void 0;
var ast_node_type_1 = require("../lib/parser/ast-node-type");
var guu_node_type_1 = require("./guu-node-type");
var GuuProgram = /** @class */ (function () {
    function GuuProgram(statements) {
        this.statements = statements;
        this.type = ast_node_type_1.ASTNodeType.SOURCE_FILE;
    }
    return GuuProgram;
}());
exports.GuuProgram = GuuProgram;
var GuuBlock = /** @class */ (function () {
    function GuuBlock(statements) {
        this.statements = statements;
        this.type = ast_node_type_1.ASTNodeType.BLOCK;
    }
    return GuuBlock;
}());
exports.GuuBlock = GuuBlock;
var GuuProcedureDeclaration = /** @class */ (function () {
    function GuuProcedureDeclaration(identifier, body) {
        this.identifier = identifier;
        this.body = body;
        this.type = guu_node_type_1.GuuASTNodeType.PROCEDURE_DECLARATION;
    }
    return GuuProcedureDeclaration;
}());
exports.GuuProcedureDeclaration = GuuProcedureDeclaration;
var CallStatement = /** @class */ (function () {
    function CallStatement(expression) {
        this.expression = expression;
        this.type = ast_node_type_1.ASTNodeType.CALL;
        this.arguments = [];
    }
    return CallStatement;
}());
exports.CallStatement = CallStatement;
var PrintStatement = /** @class */ (function () {
    function PrintStatement(argument) {
        this.argument = argument;
        this.type = guu_node_type_1.GuuASTNodeType.PRINT;
    }
    return PrintStatement;
}());
exports.PrintStatement = PrintStatement;
var SetStatement = /** @class */ (function () {
    function SetStatement(variable, value) {
        this.variable = variable;
        this.value = value;
        this.type = guu_node_type_1.GuuASTNodeType.ASSIGNMENT;
    }
    return SetStatement;
}());
exports.SetStatement = SetStatement;
var GuuIdentifier = /** @class */ (function () {
    function GuuIdentifier(escapedText) {
        this.escapedText = escapedText;
        this.type = ast_node_type_1.ASTNodeType.IDENTIFIER;
    }
    return GuuIdentifier;
}());
exports.GuuIdentifier = GuuIdentifier;
var GuuNumber = /** @class */ (function () {
    function GuuNumber(text) {
        this.text = text;
        this.type = ast_node_type_1.ASTNodeType.NUMERIC_LITERAL;
    }
    return GuuNumber;
}());
exports.GuuNumber = GuuNumber;
