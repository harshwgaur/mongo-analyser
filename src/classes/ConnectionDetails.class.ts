const qs = require("qs");
import { ConnectionInfoModel } from "../models/ConnectionInfo.model";
import { LogLineModel, BaseObject } from "../models/LogLine.model";


export class ConnectionDetails {

    private logLine: LogLineModel;
    private originalLogLine: BaseObject;
    private opType?: string;

    constructor(logLine: BaseObject) {
        this.originalLogLine = logLine;
        this.logLine = <LogLineModel>this.originalLogLine;
    }

    getOpenConnCount(): number{
        return 0;
    }

    getClosedConnCount(): number{
        return 0;
    }

    getUniqIpAddCount(): number{
        return 0;
    }

    getSocketExCount(): number{
        return 0;
    }
    
    getLogLine(): LogLineModel {
        return this.logLine;
    }

 
}