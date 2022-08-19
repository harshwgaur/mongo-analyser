import { LocalDBAdapter } from "../adapters/nedb.adapter";
import { LogFilterModel } from "../models/LogLine.model";
import { ParsedLog, ParsedLogGrouped } from "../models/ParsedLog.model";
const fs = require('fs');
const es = require('event-stream');

export class FilterOpType {

    private logFile: string;
    private ns: string;
    private thread: string;
    private optype: string;
    private processedLogsNs: LocalDBAdapter;
    private processedLogsOp: LocalDBAdapter;
    private processedLogsTh: LocalDBAdapter;
    private processedLogsCo: LocalDBAdapter;
    constructor(logFile: string , ns: string , optype: string, thread:string) {
        this.logFile = logFile;
        this.processedLogsNs = new LocalDBAdapter("logDataNs");
        this.processedLogsOp = new LocalDBAdapter("logDataOp");
        this.processedLogsTh = new LocalDBAdapter("logDataTh");
        this.processedLogsCo = new LocalDBAdapter("logDataCo");
        this.ns = ns;
        this.optype = optype;
        this.thread = thread;
    }

    readLogFile(): void{
       
        var lineNumber = 0;

        var s = fs.createReadStream(this.logFile)
            .pipe(es.split())
            .pipe(es.mapSync((rawLog: string) => {
                if(rawLog)
                {
                    let logLine = JSON.parse(rawLog);
                    if (logLine.c === "COMMAND"
                            && typeof (logLine.attr) != 'undefined'
                            && typeof (logLine.attr.ns) != 'undefined') {
                                let opType = Object.keys(logLine.attr.command)[0];
                        if (typeof (this.ns) != 'undefined' && logLine.attr.ns === this.ns) {
                            this.filterData(logLine , this.processedLogsNs);
                        }
                        else if (typeof (this.thread) != 'undefined' && logLine.ctx === this.thread) {
                            this.filterData(logLine , this.processedLogsTh);
                        }
                        else if (typeof (this.optype) != 'undefined' && opType === this.optype) {
                            this.filterData(logLine , this.processedLogsOp);
                        }
                    }
                }
                
        })
        )
    }

    filterData(logLine:any , adapter:LocalDBAdapter):any
    {
        let opType = Object.keys(logLine.attr.command)[0];
        let parsedLogLine: ParsedLog = {
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
        }
        adapter.insert(parsedLogLine);
    }

    // @ts-ignore
    async prepareResult(): any{
        this.readLogFile();
        // //@ts-ignore
        // let filterCriteria = [];
        // if(typeof(this.ns) != "undefined" && this.ns!="")
        // {
        //     //@ts-ignore
        //     filterCriteria["Namespace"] = this.ns;
        // }
        // if(typeof(this.optype) != "undefined" && this.optype!="")
        // {
        //     //@ts-ignore
        //     filterCriteria["Optype"] = this.optype;
        // }
        // //@ts-ignore
        // let filterClause = Object.assign({}, filterCriteria)
        // console.log(filterClause);
        // let data = await this.processedLogs.fetchAsync(filterClause);
        // console.log(data);
        // this.processedLogs.fetchAsync(filterClause).then(
        //     function(value) { 
                
        //      },
        //     function(error) { 
        //         console.log("Error"); 
        //         console.log(error); 
        //     }
        // );
    }
}


