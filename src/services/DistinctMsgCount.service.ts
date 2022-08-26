import { BaseObject } from "../models/LogLine.model";
import { LocalDBAdapter } from "../adapters/nedb.adapter";
import { Log } from "../classes/Log.class";

const fs = require('fs');
const es = require('event-stream');


export class DistinctMsgCount {

    private logFile: string;
    private parsedLogListDB: LocalDBAdapter;
    private countMap: any;

    constructor(logFilePath: string) {
        this.logFile = logFilePath;
        this.parsedLogListDB = new LocalDBAdapter("parsedLogs")
    }

    stream(): void {
        this.countMap = new Map()
        let stream = fs.createReadStream(this.logFile)
            .pipe(es.split())
            .pipe(es.mapSync((log: string) => {
                stream.pause();
                if (log) {
                    let logObject = new Log(JSON.parse(log));
                    let logLine = logObject.getLogLine();

                    // process log here and call s.resume() when ready
                    if (logLine != null) {
                        if(this.countMap.get(logLine.msg) == null){
                            this.countMap.set(logLine.msg, 1);
                        }else{
                            let count = 0;
                            count = this.countMap.get(logLine.msg);
                            count++;
                            this.countMap.set(logLine.msg, count)
                        }
                    }
                }
                // resume the read stream, possibly from a callback
                stream.resume();
            }).on('error', (err: BaseObject) => {
                    console.log('Error while reading file.', err);
                })
                .on('end', () => {
                    console.log('Analysis Done.')
                    console.log(this.countMap);
                    
                    // @ts-ignore
                    this.countMap.forEach((key, value) => {
                        //console.log(value);
                        //console.log(key);
                        let data =  {}
                        // @ts-ignore   
                        data[key] = value;
                        //let data = {"{$key}":value};
                        //console.log(data);
                        this.parsedLogListDB.insert(data);
                    });

                    // For future intents and purposes
                    //this.parsedLogListDB.insert(this.countMap);
                    
                })
            );
    }
}