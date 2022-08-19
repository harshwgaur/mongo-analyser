export declare class LocalDBAdapter {
    private db_name;
    private datastore;
    constructor(db_name: string);
    insert(object: any): any;
    fetch(query: any): any;
    fetchAsync(query: any): Promise<any>;
}
