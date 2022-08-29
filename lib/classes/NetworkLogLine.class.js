"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkLogLine = void 0;
var qs = require("qs");
var NetworkLogLine = /** @class */ (function () {
    function NetworkLogLine(logLine) {
        this.originalLogLine = logLine;
        this.logLine = this.originalLogLine;
    }
    NetworkLogLine.prototype.getLogLine = function () {
        return this.logLine;
    };
    return NetworkLogLine;
}());
exports.NetworkLogLine = NetworkLogLine;
//# sourceMappingURL=NetworkLogLine.class.js.map