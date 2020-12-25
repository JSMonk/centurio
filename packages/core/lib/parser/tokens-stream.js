"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.TokensStream = void 0;
var stream_1 = require("stream");
var errors_1 = require("../errors");
var TokensStream = /** @class */ (function (_super) {
    __extends(TokensStream, _super);
    function TokensStream(tokenizer, opts) {
        var _this = _super.call(this, __assign(__assign({}, opts), { readableObjectMode: true })) || this;
        _this.tokenizer = tokenizer;
        return _this;
    }
    TokensStream.prototype._transform = function (bytes, _, push) {
        var lexeme = bytes.toString();
        var token = this.tokenizer.getTokenFor(lexeme);
        if (token === null) {
            push(new errors_1.UnknownLexemeError(lexeme));
        }
        else {
            push(null, token);
        }
    };
    return TokensStream;
}(stream_1.Transform));
exports.TokensStream = TokensStream;
