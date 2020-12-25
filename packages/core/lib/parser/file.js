"use strict";
exports.__esModule = true;
exports.readFile = void 0;
var fs_1 = require("fs");
function readFile(path, encoding) {
    return fs_1.createReadStream(path, {
        encoding: encoding,
        highWaterMark: 1
    });
}
exports.readFile = readFile;
