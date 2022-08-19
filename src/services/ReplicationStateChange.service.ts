import { LogLine } from "../classes/LogLine.class";
import { BaseObject } from "../models/LogLine.model";
import { RenderHTML } from "./RenderHTML.service";
import { LocalDBAdapter } from "../adapters/nedb.adapter";
import {ParsedReplicaSetStatusLog} from "../models/ReplicasetLog.model";
import {ParsedLog} from "../models/ParsedLog.model";

const fs = require('fs');
const es = require('event-stream');


export class ReplicationStateChange {

    private logList: Array<ParsedReplicaSetStatusLog>;
    private logFile: string;
    private isGrouped: boolean;
    private limit: number;
    private uiPageSize: number;
    private slowMs: number;
    private htmlGenerator?: RenderHTML;
    private parsedLogListDB: LocalDBAdapter;

    constructor(logFilePath: string, isGrouped: boolean, limit: number, uiPageSize: number, slowMs: number) {
        this.logFile = logFilePath;
        this.isGrouped = isGrouped;
        this.limit = limit;
        this.uiPageSize = uiPageSize;
        this.slowMs = slowMs;
        this.logList = [];
        this.parsedLogListDB = new LocalDBAdapter("replicationStatus")
    }

    parse(): void {




        let stream = fs.createReadStream(this.logFile)
            .pipe(es.split())
            .pipe(es.mapSync((log: string) => {
                    stream.pause();
                    if (log) {
                        let logObject = new LogLine(JSON.parse(log));
                        let logLine = logObject.getLogLine();
                        if (logLine != null) {

                            // Only parse commands for the scope
                            // Filter out the commands with undefined attr and ns
                            if (logLine.c === "REPL" && logLine.ctx === "ReplCoord-0") {
                                let parsedLogLine: ParsedReplicaSetStatusLog = {
                                    time: `${logLine.t.$date}`,
                                    host: "",
                                    msg: logLine.msg,
                                    log: JSON.stringify(logLine)
                                }
                                this.logList.push(parsedLogLine);
                                this.parsedLogListDB.insert(parsedLogLine);
                            }
                        }
                    }
                    // resume the read stream, possibly from a callback
                    stream.resume();
                })
                    .on('error', (err: BaseObject) => {
                        console.log('Error while reading file.', err);
                    })
                    .on('end', () => {
                        console.log('Analysis Done for RSC')
                    })
            );
    }
}
