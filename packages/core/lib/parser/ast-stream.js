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
exports.AstStream = void 0;
var observer_1 = require("../util/observer");
var stream_1 = require("stream");
var AstStream = /** @class */ (function (_super) {
    __extends(AstStream, _super);
    function AstStream(astBuilder, opts) {
        var _this = _super.call(this, __assign(__assign({}, opts), { objectMode: true })) || this;
        _this.astBuilder = astBuilder;
        _this.program = null;
        _this.observer = new observer_1.Observer();
        return _this;
    }
    AstStream.prototype._write = function (token, _, fallback) {
        try {
            var isConsumed = this.astBuilder.consumeToken(token);
            fallback(null);
            if (!isConsumed) {
                _super.prototype.end.call(this);
            }
        }
        catch (e) {
            this.observer.notifyError(e);
            fallback(e);
        }
    };
    AstStream.prototype._final = function (fallback) {
        try {
            this.program = this.astBuilder.getFullAST();
            this.observer.notifySuccess(this.program);
            fallback(null);
        }
        catch (e) {
            this.observer.notifyError(e);
            fallback(e);
        }
    };
    AstStream.prototype.getProgram = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.observer.subscribe([resolve, reject]);
        });
    };
    return AstStream;
}(stream_1.Writable));
exports.AstStream = AstStream;
