"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterOpType = void 0;
var nedb_adapter_1 = require("../adapters/nedb.adapter");
var fs = require('fs');
var es = require('event-stream');
var FilterOpType = /** @class */ (function () {
    function FilterOpType(logFile, ns, optype, thread) {
        this.logFile = logFile;
        this.processedLogsNs = new nedb_adapter_1.LocalDBAdapter("logDataNs");
        this.processedLogsOp = new nedb_adapter_1.LocalDBAdapter("logDataOp");
        this.processedLogsTh = new nedb_adapter_1.LocalDBAdapter("logDataTh");
        this.processedLogsCo = new nedb_adapter_1.LocalDBAdapter("logDataCo");
        this.ns = ns;
        this.optype = optype;
        this.thread = thread;
    }
    FilterOpType.prototype.readLogFile = function () {
        var _this = this;
        var lineNumber = 0;
        var s = fs.createReadStream(this.logFile)
            .pipe(es.split())
            .pipe(es.mapSync(function (rawLog) {
            if (rawLog) {
                var logLine = JSON.parse(rawLog);
                if (logLine.c === "COMMAND"
                    && typeof (logLine.attr) != 'undefined'
                    && typeof (logLine.attr.ns) != 'undefined') {
                    var opType = Object.keys(logLine.attr.command)[0];
                    if (typeof (_this.ns) != 'undefined' && logLine.attr.ns === _this.ns) {
                        _this.filterData(logLine, _this.processedLogsNs);
                    }
                    else if (typeof (_this.thread) != 'undefined' && logLine.ctx === _this.thread) {
                        _this.filterData(logLine, _this.processedLogsTh);
                    }
                    else if (typeof (_this.optype) != 'undefined' && opType === _this.optype) {
                        _this.filterData(logLine, _this.processedLogsOp);
                    }
                }
            }
        }));
    };
    FilterOpType.prototype.filterData = function (logLine, adapter) {
        var opType = Object.keys(logLine.attr.command)[0];
        var parsedLogLine = {
            OpType: opType,
            Duration: logLine.attr.durationMillis,
            QTR: null,
            Namespace: logLine.attr.ns,
            Filter: {},
            Sort: "No Sort",
            Lookup: "N.A.",
            Blocking: "N.A.",
            "Plan Summary": "N.A.",
            "App Name": "N.A.",
            QueryHash: logLine.attr.queryHash,
            Log: JSON.stringify(logLine)
        };
        adapter.insert(parsedLogLine);
    };
    // @ts-ignore
    FilterOpType.prototype.prepareResult = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.readLogFile();
                return [2 /*return*/];
            });
        });
    };
    return FilterOpType;
}());
exports.FilterOpType = FilterOpType;
//# sourceMappingURL=FilterOpType.service.js.map