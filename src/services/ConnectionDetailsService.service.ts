import { NetworkLogLine } from "../classes/NetworkLogLine.class";
import { BaseObject } from "../models/NetworkLogLine.model";
import { ParsedLog, ParsedLogGrouped } from "../models/ParsedLog.model";
import { redact_v2, sort_by_key } from "../utility/common.functions";
import { RenderHTML } from "./RenderHTML.service";
import { LocalDBAdapter } from "../adapters/nedb.adapter";
import { ConnectionDetails } from "../classes/ConnectionDetails.class";
import { ConnectionInfoModel } from "../models/ConnectionInfo.model";

const fs = require('fs');
const es = require('event-stream');


export class ConnectionDetailsService {

    private logList: Array<ParsedLog>;
    private logFile: string;
    private parsedLogListDB: LocalDBAdapter;

    constructor(logFilePath: string) {
        this.logFile = logFilePath;
        this.logList = [];
        this.parsedLogListDB = new LocalDBAdapter("parsedLogs")
    }

    stream(): void {
        let parsed_log_summary = {
            nOpenConn: 0,
            nClosedConn: 0,
            nIpAdd: 0,
            nSocEx: 0,
        }
        let parsed_log_detailed_summary = {
            ipAddress: "",
            nOpenConn: 0,
            nClosedConn: 0,
            nSocEx: 0,
        }

        let connectionInfoMap = new Map<String, ConnectionInfoModel>();
        let stream = fs.createReadStream(this.logFile)
            .pipe(es.split())
            .pipe(es.mapSync((log: string) => {
                stream.pause();
                if (log) {
                    let logObject = new NetworkLogLine(JSON.parse(log));
                    let logLine = logObject.getLogLine();
                    // process log here and call s.resume() when ready
                    if (logLine != null) {

                        // Only parse commands for the scope
                        // Filter out the commands with undefined attr and ns
                        if (logLine.c === "NETWORK"
                            && (logLine.msg == "Connection accepted" || logLine.msg == "Connection ended")
                            && typeof (logLine.attr) != 'undefined') {
                                let ipAddressArray = logLine.attr.remote.split(':',1);
                                let ipAddress = ipAddressArray[0];
                                console.log("ip address : ", ipAddress);
                                if(connectionInfoMap.get(ipAddress) != null){
                                   let connectionInfoModel = connectionInfoMap.get(ipAddress);
                                    if(connectionInfoModel != undefined && logLine.msg == "Connection accepted"){
                                        connectionInfoModel.o++;
                                        parsed_log_summary.nOpenConn++;
                                    }else if(connectionInfoModel != undefined && logLine.msg == "Connection ended"){
                                        connectionInfoModel.c++;
                                        parsed_log_summary.nClosedConn++;
                                    }
                                    if(connectionInfoModel != undefined){
                                        connectionInfoMap.set(ipAddress, connectionInfoModel);
                                    }
                                    
                                }else{
                                    if(logLine.msg == "Connection accepted"){
                                       let connectionInfoModel : ConnectionInfoModel = {
                                            "ip" : logLine.attr.remote,
                                            "c": 0,
                                            "o": 1,
                                            "se": 0
                                        };
                                        parsed_log_summary.nOpenConn++;
                                        connectionInfoMap.set(ipAddress,connectionInfoModel);
                                    }else if(logLine.msg == "Connection ended"){
                                        let connectionInfoModel : ConnectionInfoModel = {
                                            "ip" : logLine.attr.remote,
                                            "c": 1,
                                            "o": 0,
                                            "se": 0
                                        };
                                        parsed_log_summary.nClosedConn++;
                                        connectionInfoMap.set(ipAddress,connectionInfoModel);
                                    }
                                }
                                
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
                   
                    console.log('Analysis Done.')
                    parsed_log_summary.nIpAdd = connectionInfoMap.size;
                    
                    this.parsedLogListDB.insert("MONGODB CONNECTION INFO");
                    
                    this.parsedLogListDB.insert({"Total Open Connection " : parsed_log_summary.nOpenConn});
                    this.parsedLogListDB.insert({"Total Closed Connection " : parsed_log_summary.nClosedConn});
                    this.parsedLogListDB.insert({"Total Socket Exception " : parsed_log_summary.nSocEx});
                    this.parsedLogListDB.insert({"Total Unique IP Address " : parsed_log_summary.nIpAdd});
                     
                    connectionInfoMap.forEach((value: ConnectionInfoModel, key: String) => {
                        this.parsedLogListDB.insert({"IP " : key , "Total Open Connection " : value.o, "Total Closed Connection " : value.c});
                    });
                })
            );
            
    }
}