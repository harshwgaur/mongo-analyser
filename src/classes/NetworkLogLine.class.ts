const qs = require("qs");
import { NetworkLogLineModel, BaseObject } from "../models/NetworkLogLine.model";


export class NetworkLogLine {

    private logLine: NetworkLogLineModel;
    private originalLogLine: BaseObject;
    private opType?: string;

    constructor(logLine: BaseObject) {
        this.originalLogLine = logLine;
        this.logLine = <NetworkLogLineModel>this.originalLogLine;
    }

    getLogLine(): NetworkLogLineModel {
        return this.logLine;
    }


}