const qs = require("qs");
import { DistinctMsgCount, BaseObject } from "../models/DistinctMsgCount.model";


export class Log {

    private logLine: DistinctMsgCount;
    private originalLogLine: BaseObject;
    private opType?: string;

    constructor(logLine: BaseObject) {
        this.originalLogLine = logLine;
        this.logLine = <DistinctMsgCount>this.originalLogLine;
        this.opType = this.getOpType();
    }

    getLogLine(): DistinctMsgCount {
        return this.logLine;
    }

    getOpType(): string {
            return "";
    }   
}