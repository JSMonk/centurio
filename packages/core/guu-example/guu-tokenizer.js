"use strict";
exports.__esModule = true;
exports.GuuTokenizer = void 0;
var token = require("./guu-token");
var guu_keywords_1 = require("./guu-keywords");
var GuuTokenizer = /** @class */ (function () {
    function GuuTokenizer() {
    }
    GuuTokenizer.prototype.getTokenFor = function (lexeme) {
        switch (true) {
            case this.isSetKeyword(lexeme):
                return new token.SetToken();
            case this.isCallKeyword(lexeme):
                return new token.CallToken();
            case this.isPrintKeyword(lexeme):
                return new token.PrintToken();
            case this.isSubProgramKeyword(lexeme):
                return new token.SubprogramToken();
            case this.isSubProgramBody(lexeme):
                return new token.SubprogramBodyStartToken();
            case this.isNumberLexeme(lexeme):
                return new token.NumberToken(lexeme);
            case this.isIdentifierLexeme(lexeme):
                return new token.IdentifierToken(lexeme);
        }
        return null;
    };
    GuuTokenizer.prototype.isIdentifierLexeme = function (lexeme) {
        return /^\w[\d\w_]*$/g.test(lexeme);
    };
    GuuTokenizer.prototype.isNumberLexeme = function (lexeme) {
        return /^\d+$/gi.test(lexeme);
    };
    GuuTokenizer.prototype.isSetKeyword = function (lexeme) {
        return lexeme === guu_keywords_1.GuuKeyword.SET;
    };
    GuuTokenizer.prototype.isCallKeyword = function (lexeme) {
        return lexeme === guu_keywords_1.GuuKeyword.CALL;
    };
    GuuTokenizer.prototype.isPrintKeyword = function (lexeme) {
        return lexeme === guu_keywords_1.GuuKeyword.PRINT;
    };
    GuuTokenizer.prototype.isSubProgramKeyword = function (lexeme) {
        return lexeme === guu_keywords_1.GuuKeyword.SUBPROGRAM;
    };
    GuuTokenizer.prototype.isSubProgramBody = function (lexeme) {
        return lexeme === guu_keywords_1.GuuKeyword.SUBPROGRAM_BODY;
    };
    return GuuTokenizer;
}());
exports.GuuTokenizer = GuuTokenizer;
