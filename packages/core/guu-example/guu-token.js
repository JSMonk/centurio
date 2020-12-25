"use strict";
exports.__esModule = true;
exports.IdentifierToken = exports.NumberToken = exports.SubprogramBodyStartToken = exports.SubprogramToken = exports.PrintToken = exports.CallToken = exports.SetToken = exports.EndOfFile = void 0;
var EndOfFile = /** @class */ (function () {
    function EndOfFile() {
    }
    return EndOfFile;
}());
exports.EndOfFile = EndOfFile;
var SetToken = /** @class */ (function () {
    function SetToken() {
    }
    return SetToken;
}());
exports.SetToken = SetToken;
var CallToken = /** @class */ (function () {
    function CallToken() {
    }
    return CallToken;
}());
exports.CallToken = CallToken;
var PrintToken = /** @class */ (function () {
    function PrintToken() {
    }
    return PrintToken;
}());
exports.PrintToken = PrintToken;
var SubprogramToken = /** @class */ (function () {
    function SubprogramToken() {
    }
    return SubprogramToken;
}());
exports.SubprogramToken = SubprogramToken;
var SubprogramBodyStartToken = /** @class */ (function () {
    function SubprogramBodyStartToken() {
    }
    return SubprogramBodyStartToken;
}());
exports.SubprogramBodyStartToken = SubprogramBodyStartToken;
var NumberToken = /** @class */ (function () {
    function NumberToken(text) {
        this.text = text;
    }
    return NumberToken;
}());
exports.NumberToken = NumberToken;
var IdentifierToken = /** @class */ (function () {
    function IdentifierToken(name) {
        this.name = name;
    }
    return IdentifierToken;
}());
exports.IdentifierToken = IdentifierToken;
