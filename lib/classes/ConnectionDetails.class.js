"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionDetails = void 0;
var qs = require("qs");
var ConnectionDetails = /** @class */ (function () {
    function ConnectionDetails(logLine) {
        this.originalLogLine = logLine;
        this.logLine = this.originalLogLine;
    }
    ConnectionDetails.prototype.getOpenConnCount = function () {
        return 0;
    };
    ConnectionDetails.prototype.getClosedConnCount = function () {
        return 0;
    };
    ConnectionDetails.prototype.getUniqIpAddCount = function () {
        return 0;
    };
    ConnectionDetails.prototype.getSocketExCount = function () {
        return 0;
    };
    ConnectionDetails.prototype.getLogLine = function () {
        return this.logLine;
    };
    return ConnectionDetails;
}());
exports.ConnectionDetails = ConnectionDetails;
//# sourceMappingURL=ConnectionDetails.class.js.map