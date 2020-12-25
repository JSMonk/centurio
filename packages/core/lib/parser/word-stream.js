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
exports.__esModule = true;
exports.WordStream = void 0;
var stream_1 = require("stream");
var WordStream = /** @class */ (function (_super) {
    __extends(WordStream, _super);
    function WordStream(skipChar, delimiter, opts) {
        var _this = _super.call(this, opts) || this;
        _this.skipChar = skipChar;
        _this.delimiter = delimiter;
        _this.charBuffer = [];
        return _this;
    }
    WordStream.prototype._write = function (byte, _, fallback) {
        var char = byte.toString();
        var shouldBeSkipped = this.skipChar.test(char);
        if (shouldBeSkipped || this.delimiter.test(char)) {
            this.push(this.charBuffer.join(""));
            this.charBuffer = [];
            if (!shouldBeSkipped) {
                this.push(char);
            }
        }
        else {
            this.charBuffer.push(char);
        }
        fallback();
    };
    return WordStream;
}(stream_1.Transform));
exports.WordStream = WordStream;
