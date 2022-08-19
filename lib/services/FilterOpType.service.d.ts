import { LocalDBAdapter } from "../adapters/nedb.adapter";
export declare class FilterOpType {
    private logFile;
    private ns;
    private thread;
    private optype;
    private processedLogsNs;
    private processedLogsOp;
    private processedLogsTh;
    private processedLogsCo;
    constructor(logFile: string, ns: string, optype: string, thread: string);
    readLogFile(): void;
    filterData(logLine: any, adapter: LocalDBAdapter): any;
    prepareResult(): any;
}
