"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionDetailsService = void 0;
var NetworkLogLine_class_1 = require("../classes/NetworkLogLine.class");
var nedb_adapter_1 = require("../adapters/nedb.adapter");
var fs = require('fs');
var es = require('event-stream');
var ConnectionDetailsService = /** @class */ (function () {
    function ConnectionDetailsService(logFilePath) {
        this.logFile = logFilePath;
        this.logList = [];
        this.parsedLogListDB = new nedb_adapter_1.LocalDBAdapter("parsedLogs");
    }
    ConnectionDetailsService.prototype.stream = function () {
        var _this = this;
        var parsed_log_summary = {
            nOpenConn: 0,
            nClosedConn: 0,
            nIpAdd: 0,
            nSocEx: 0,
        };
        var parsed_log_detailed_summary = {
            ipAddress: "",
            nOpenConn: 0,
            nClosedConn: 0,
            nSocEx: 0,
        };
        var connectionInfoMap = new Map();
        var stream = fs.createReadStream(this.logFile)
            .pipe(es.split())
            .pipe(es.mapSync(function (log) {
            stream.pause();
            if (log) {
                var logObject = new NetworkLogLine_class_1.NetworkLogLine(JSON.parse(log));
                var logLine = logObject.getLogLine();
                // process log here and call s.resume() when ready
                if (logLine != null) {
                    // Only parse commands for the scope
                    // Filter out the commands with undefined attr and ns
                    if (logLine.c === "NETWORK"
                        && (logLine.msg == "Connection accepted" || logLine.msg == "Connection ended")
                        && typeof (logLine.attr) != 'undefined') {
                        var ipAddressArray = logLine.attr.remote.split(':', 1);
                        var ipAddress = ipAddressArray[0];
                        console.log("ip address : ", ipAddress);
                        if (connectionInfoMap.get(ipAddress) != null) {
                            var connectionInfoModel = connectionInfoMap.get(ipAddress);
                            if (connectionInfoModel != undefined && logLine.msg == "Connection accepted") {
                                connectionInfoModel.o++;
                                parsed_log_summary.nOpenConn++;
                            }
                            else if (connectionInfoModel != undefined && logLine.msg == "Connection ended") {
                                connectionInfoModel.c++;
                                parsed_log_summary.nClosedConn++;
                            }
                            if (connectionInfoModel != undefined) {
                                connectionInfoMap.set(ipAddress, connectionInfoModel);
                            }
                        }
                        else {
                            if (logLine.msg == "Connection accepted") {
                                var connectionInfoModel = {
                                    "ip": logLine.attr.remote,
                                    "c": 0,
                                    "o": 1,
                                    "se": 0
                                };
                                parsed_log_summary.nOpenConn++;
                                connectionInfoMap.set(ipAddress, connectionInfoModel);
                            }
                            else if (logLine.msg == "Connection ended") {
                                var connectionInfoModel = {
                                    "ip": logLine.attr.remote,
                                    "c": 1,
                                    "o": 0,
                                    "se": 0
                                };
                                parsed_log_summary.nClosedConn++;
                                connectionInfoMap.set(ipAddress, connectionInfoModel);
                            }
                        }
                    }
                }
            }
            // resume the read stream, possibly from a callback
            stream.resume();
        })
            .on('error', function (err) {
            console.log('Error while reading file.', err);
        })
            .on('end', function () {
            console.log('Analysis Done.');
            parsed_log_summary.nIpAdd = connectionInfoMap.size;
            _this.parsedLogListDB.insert("MONGODB CONNECTION INFO");
            _this.parsedLogListDB.insert({ "Total Open Connection ": parsed_log_summary.nOpenConn });
            _this.parsedLogListDB.insert({ "Total Closed Connection ": parsed_log_summary.nClosedConn });
            _this.parsedLogListDB.insert({ "Total Socket Exception ": parsed_log_summary.nSocEx });
            _this.parsedLogListDB.insert({ "Total Unique IP Address ": parsed_log_summary.nIpAdd });
            connectionInfoMap.forEach(function (value, key) {
                _this.parsedLogListDB.insert({ "IP ": key, "Total Open Connection ": value.o, "Total Closed Connection ": value.c });
            });
        }));
    };
    return ConnectionDetailsService;
}());
exports.ConnectionDetailsService = ConnectionDetailsService;
//# sourceMappingURL=ConnectionDetailsService.service.js.map