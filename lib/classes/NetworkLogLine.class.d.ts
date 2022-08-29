import { NetworkLogLineModel, BaseObject } from "../models/NetworkLogLine.model";
export declare class NetworkLogLine {
    private logLine;
    private originalLogLine;
    private opType?;
    constructor(logLine: BaseObject);
    getLogLine(): NetworkLogLineModel;
}
