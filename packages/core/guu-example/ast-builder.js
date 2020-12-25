"use strict";
exports.__esModule = true;
exports.GuuAstBuilder = void 0;
var nodes = require("./guu-node");
var tokens = require("./guu-token");
var syntax_state_machine_1 = require("./syntax-state-machine");
var GuuAstBuilder = /** @class */ (function () {
    function GuuAstBuilder() {
        var _this = this;
        this.stack = [];
        this.syntax = new syntax_state_machine_1.GuuSyntax();
        this.currentTokenHandler = this.syntax.getInitialHandler();
        this.syntax.handleSetBy(function () { return _this.pushSetStatement(); });
        this.syntax.handleCallBy(function () { return _this.pushCallStatement(); });
        this.syntax.handlePrintBy(function () { return _this.pushPrintStatement(); });
        this.syntax.handleIdentifierBy(function (token) { return _this.pushIdentifierNode(token); });
        this.syntax.handleNumberBy(function (token) { return _this.pushNumberNode(token); });
        this.syntax.handleSubprogramBy(function () { return _this.pushProcedureDeclaration(); });
    }
    GuuAstBuilder.prototype.getFullAST = function () {
        if (this.currentTokenHandler !== null) {
            this.currentTokenHandler = this.currentTokenHandler(new tokens.EndOfFile());
        }
        return this.createProgram();
    };
    GuuAstBuilder.prototype.consumeToken = function (token) {
        if (this.currentTokenHandler === null) {
            return false;
        }
        this.currentTokenHandler = this.currentTokenHandler(token);
        return true;
    };
    GuuAstBuilder.prototype.createProgram = function () {
        var declarations = new Array(this.stack.length);
        for (var i = 0; i < this.stack.length; i++) {
            var declaration = this.stack[i];
            this.assertProcedureDeclaration(declaration);
            declarations[i] = declaration;
        }
        return new nodes.GuuProgram(declarations);
    };
    GuuAstBuilder.prototype.pushProcedureDeclaration = function () {
        if (this.stack.length === 0)
            return;
        var statements = [];
        var currentStatement = this.stack.pop();
        while (this.stack.length !== 0 &&
            currentStatement !== undefined &&
            !(currentStatement instanceof nodes.GuuIdentifier)) {
            this.assertStatement(currentStatement);
            statements.unshift(currentStatement);
            currentStatement = this.stack.pop();
        }
        if (!(currentStatement instanceof nodes.GuuIdentifier)) {
            return;
        }
        this.stack.push(new nodes.GuuProcedureDeclaration(currentStatement, statements));
    };
    GuuAstBuilder.prototype.pushNumberNode = function (token) {
        this.stack.push(new nodes.GuuNumber(token.text));
    };
    GuuAstBuilder.prototype.pushIdentifierNode = function (token) {
        this.stack.push(new nodes.GuuIdentifier(token.name));
    };
    GuuAstBuilder.prototype.pushCallStatement = function () {
        var callee = this.stack.pop();
        this.assertIdentifier(callee);
        this.stack.push(new nodes.CallStatement(callee));
    };
    GuuAstBuilder.prototype.pushPrintStatement = function () {
        var argument = this.stack.pop();
        this.assertExpression(argument);
        this.stack.push(new nodes.PrintStatement(argument));
    };
    GuuAstBuilder.prototype.pushSetStatement = function () {
        var value = this.stack.pop();
        this.assertExpression(value);
        var identifier = this.stack.pop();
        this.assertIdentifier(identifier);
        this.stack.push(new nodes.SetStatement(identifier, value));
    };
    GuuAstBuilder.prototype.assert = function (condition, error) {
        if (!condition) {
            throw error;
        }
    };
    GuuAstBuilder.prototype.assertExpression = function (node) {
        this.assert(node !== undefined, new Error("never"));
        this.assert(node instanceof nodes.GuuIdentifier || node instanceof nodes.GuuNumber, new SyntaxError("Only expressions available here!"));
    };
    GuuAstBuilder.prototype.assertIdentifier = function (node) {
        this.assert(node !== undefined, new Error("never"));
        this.assert(node instanceof nodes.GuuIdentifier, new SyntaxError("Only identifiers available here!"));
    };
    GuuAstBuilder.prototype.assertProcedureDeclaration = function (node) {
        this.assert(node !== undefined, new Error("never"));
        this.assert(node instanceof nodes.GuuProcedureDeclaration, new SyntaxError("Only procedure declarations available here!"));
    };
    GuuAstBuilder.prototype.assertStatement = function (node) {
        this.assert(node !== undefined, new Error("never"));
        this.assert(node instanceof nodes.PrintStatement ||
            node instanceof nodes.CallStatement ||
            node instanceof nodes.SetStatement, new SyntaxError("Only statements available here!"));
    };
    return GuuAstBuilder;
}());
exports.GuuAstBuilder = GuuAstBuilder;
