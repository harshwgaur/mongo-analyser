export interface LogTimestamp {
    $date: Date;
}

export interface BaseObject {
    [key: string]: any
}

export interface StorageData {
    bytesRead: number;
    timeReadingMicros: number;
}

export interface Storage {
    data: StorageData;
}

export interface ConnAttr {
    remote: string,
    connectionId: number,
    connectionCount: number,
}


export interface NetworkLogLineModel { 
    t: LogTimestamp;
    s: string;
    c: string;
    id: number;
    ctx: string;
    msg: string;
    attr: ConnAttr;
}
