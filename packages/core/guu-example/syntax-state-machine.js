"use strict";
exports.__esModule = true;
exports.GuuSyntax = void 0;
var tokens = require("./guu-token");
var DEFAULT_CALLBACK = function (_) { return null; };
var GuuSyntax = /** @class */ (function () {
    function GuuSyntax() {
        this.identifierCallback = DEFAULT_CALLBACK;
        this.numberCallback = DEFAULT_CALLBACK;
        this.printCallback = DEFAULT_CALLBACK;
        this.callCallback = DEFAULT_CALLBACK;
        this.setCallback = DEFAULT_CALLBACK;
        this.subprogramCallback = DEFAULT_CALLBACK;
    }
    GuuSyntax.prototype.handleSubprogramBy = function (callback) {
        this.subprogramCallback = callback;
    };
    GuuSyntax.prototype.handlePrintBy = function (callback) {
        this.printCallback = callback;
    };
    GuuSyntax.prototype.handleSetBy = function (callback) {
        this.setCallback = callback;
    };
    GuuSyntax.prototype.handleCallBy = function (callback) {
        this.callCallback = callback;
    };
    GuuSyntax.prototype.handleIdentifierBy = function (callback) {
        this.identifierCallback = callback;
    };
    GuuSyntax.prototype.handleNumberBy = function (callback) {
        this.numberCallback = callback;
    };
    GuuSyntax.prototype.getInitialHandler = function () {
        var _this = this;
        return function (token) {
            if (token instanceof tokens.EndOfFile) {
                return null;
            }
            return _this.subprogramHandler(token);
        };
    };
    GuuSyntax.prototype.subprogramHandler = function (potentialSub) {
        var _this = this;
        this.assertSubToken(potentialSub);
        return function (potentialIdentifier) {
            _this.assertNotEOF(potentialIdentifier);
            _this.identifierHandler(potentialIdentifier);
            return function (potentialSubprogramStart) {
                _this.assertNotEOF(potentialSubprogramStart);
                _this.assertSubprogramBodyToken(potentialSubprogramStart);
                var statementOrSubprogram = function (token) {
                    if (token instanceof tokens.EndOfFile) {
                        _this.subprogramCallback(potentialSub);
                        return null;
                    }
                    if (token instanceof tokens.SubprogramToken) {
                        _this.subprogramCallback(potentialSub);
                        return _this.subprogramHandler(token);
                    }
                    return _this.statementHandler(token, statementOrSubprogram);
                };
                return statementOrSubprogram;
            };
        };
    };
    GuuSyntax.prototype.setHandler = function (potentialSet, next) {
        var _this = this;
        this.assertSetToken(potentialSet);
        return function (potentialIdentifier) {
            _this.assertNotEOF(potentialIdentifier);
            return function (potentialExpression) {
                _this.assertNotEOF(potentialExpression);
                _this.identifierHandler(potentialIdentifier);
                _this.expressionHandler(potentialExpression);
                _this.setCallback(potentialSet);
                return next !== null && next !== void 0 ? next : null;
            };
        };
    };
    GuuSyntax.prototype.callHandler = function (potentialCall, next) {
        var _this = this;
        this.assertCallToken(potentialCall);
        return function (potentialIdentifier) {
            _this.assertNotEOF(potentialIdentifier);
            _this.identifierHandler(potentialIdentifier);
            _this.callCallback(potentialCall);
            return next !== null && next !== void 0 ? next : null;
        };
    };
    GuuSyntax.prototype.printHandler = function (potentialPrint, next) {
        var _this = this;
        this.assertPrintToken(potentialPrint);
        return function (potentialExpression) {
            _this.assertNotEOF(potentialExpression);
            _this.expressionHandler(potentialExpression);
            _this.printCallback(potentialPrint);
            return next !== null && next !== void 0 ? next : null;
        };
    };
    GuuSyntax.prototype.identifierHandler = function (token, next) {
        this.assertIdentifierToken(token);
        this.identifierCallback(token);
        return next !== null && next !== void 0 ? next : null;
    };
    GuuSyntax.prototype.numberHandler = function (token, next) {
        this.assertNumberToken(token);
        this.numberCallback(token);
        return next !== null && next !== void 0 ? next : null;
    };
    GuuSyntax.prototype.expressionHandler = function (token, next) {
        this.assertExpressionToken(token);
        if (token instanceof tokens.IdentifierToken) {
            this.identifierHandler(token, next);
        }
        if (token instanceof tokens.NumberToken) {
            this.numberHandler(token, next);
        }
        return next !== null && next !== void 0 ? next : null;
    };
    GuuSyntax.prototype.statementHandler = function (token, next) {
        this.assertStatementToken(token);
        if (token instanceof tokens.SetToken) {
            return this.setHandler(token, next);
        }
        if (token instanceof tokens.CallToken) {
            return this.callHandler(token, next);
        }
        if (token instanceof tokens.PrintToken) {
            return this.printHandler(token, next);
        }
        return next !== null && next !== void 0 ? next : null;
    };
    GuuSyntax.prototype.assertIdentifierToken = function (token) {
        this.assert(token !== undefined, new Error("never"));
        this.assert(token instanceof tokens.IdentifierToken, new SyntaxError("Only identifiers available here!"));
    };
    GuuSyntax.prototype.assertNumberToken = function (token) {
        this.assert(token !== undefined, new Error("never"));
        this.assert(token instanceof tokens.NumberToken, new SyntaxError("Only numbers available here!"));
    };
    GuuSyntax.prototype.assertPrintToken = function (token) {
        this.assert(token !== undefined, new Error("never"));
        this.assert(token instanceof tokens.PrintToken, new SyntaxError("Only print available here!"));
    };
    GuuSyntax.prototype.assertCallToken = function (token) {
        this.assert(token !== undefined, new Error("never"));
        this.assert(token instanceof tokens.CallToken, new SyntaxError("Only call available here!"));
    };
    GuuSyntax.prototype.assertSetToken = function (token) {
        this.assert(token !== undefined, new Error("never"));
        this.assert(token instanceof tokens.SetToken, new SyntaxError("Only set available here!"));
    };
    GuuSyntax.prototype.assertSubToken = function (token) {
        this.assert(token !== undefined, new Error("never"));
        this.assert(token instanceof tokens.SubprogramToken, new SyntaxError("Only subprogram declaration available here!"));
    };
    GuuSyntax.prototype.assertSubprogramBodyToken = function (token) {
        this.assert(token !== undefined, new Error("never"));
        this.assert(token instanceof tokens.SubprogramBodyStartToken, new SyntaxError("':' missed after procedure declaration"));
    };
    GuuSyntax.prototype.assertStatementToken = function (token) {
        this.assert(token !== undefined, new Error("never"));
        this.assert(token instanceof tokens.CallToken ||
            token instanceof tokens.PrintToken ||
            tokens.SetToken, new SyntaxError("Only statements like (set, call or print) available here"));
    };
    GuuSyntax.prototype.assertExpressionToken = function (token) {
        this.assert(token !== undefined, new Error("never"));
        this.assert(token instanceof tokens.NumberToken ||
            token instanceof tokens.IdentifierToken, new SyntaxError("Only expressions available here!"));
    };
    GuuSyntax.prototype.assertNotEOF = function (token) {
        this.assert(!(token instanceof tokens.EndOfFile), new SyntaxError("Unexpected end of file"));
    };
    GuuSyntax.prototype.assert = function (condition, error) {
        if (!condition) {
            throw error;
        }
    };
    return GuuSyntax;
}());
exports.GuuSyntax = GuuSyntax;
