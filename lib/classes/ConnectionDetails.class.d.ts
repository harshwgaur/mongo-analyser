import { LogLineModel, BaseObject } from "../models/LogLine.model";
export declare class ConnectionDetails {
    private logLine;
    private originalLogLine;
    private opType?;
    constructor(logLine: BaseObject);
    getOpenConnCount(): number;
    getClosedConnCount(): number;
    getUniqIpAddCount(): number;
    getSocketExCount(): number;
    getLogLine(): LogLineModel;
}
