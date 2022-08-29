export declare class ConnectionDetailsService {
    private logList;
    private logFile;
    private parsedLogListDB;
    constructor(logFilePath: string);
    stream(): void;
}
