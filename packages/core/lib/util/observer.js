"use strict";
exports.__esModule = true;
exports.Observer = void 0;
var Observer = /** @class */ (function () {
    function Observer() {
        this.subscribers = [];
    }
    Observer.prototype.subscribe = function (subscriber) {
        this.subscribers.push(subscriber);
    };
    Observer.prototype.notifySuccess = function (data) {
        for (var i = 0; i < this.subscribers.length; i++) {
            var subscriber = this.subscribers[i];
            if (subscriber === undefined)
                continue;
            subscriber[0](data);
        }
        this.subscribers = [];
    };
    Observer.prototype.notifyError = function (error) {
        for (var i = 0; i < this.subscribers.length; i++) {
            var subscriber = this.subscribers[i];
            if (subscriber === undefined)
                continue;
            subscriber[1](error);
        }
        this.subscribers = [];
    };
    return Observer;
}());
exports.Observer = Observer;
