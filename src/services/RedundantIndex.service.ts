import { LocalDBAdapter } from "../adapters/nedb.adapter";
import {ParsedIndexStats} from "../models/ParsedIndexStats.model";
import {MongoDBAdapter} from "../adapters/mongodb.adapter";

export class RedundantIndex {
    private logList: Array<ParsedIndexStats>;
    private parsedLogListDB: LocalDBAdapter;

    constructor() {
        this.logList = [];
        this.parsedLogListDB = new LocalDBAdapter("IndexStats")
    }

    async process(): Promise<void> {
        const db  = new MongoDBAdapter();
        // await db.connect("mongodb+srv://root:root@demo.qo3dr.mongodb.net", "admin:")
        const dbs = await db.listDatabases();
        const exclude = ["admin", "local", "config"];

        console.log("Skipping ", exclude.toString());
        let dbList: Array<string> = [];

        for (let i = 0; i < dbs.databases.length; i++) {
            let db = dbs.databases[i].name;
            if (!exclude.includes(db)) {
                dbList.push(db);
            }
        }
        for (let i =0; i < dbList.length; i++) {

            let d = dbList[i];
            const collInfo = await db.listCollections(d);

            for (let j =0; j < collInfo.length; j++) {
                let coll = collInfo[j].name;
                let indexStats = await db.runIndexStats(d, coll);
                // console.log(indexStats);
                // console.log(indexStats.length);

                for (let k= 0; k < indexStats.length; k++ ) {
                    let is = indexStats[k];
                    let parsedLogLine: ParsedIndexStats = {
                        db: d,
                        coll: coll,
                        usage: is.accesses.ops,
                        index: is.spec.name,
                        comment: "",
                        since: is.accesses.since

                    }

                    if ( is.accesses.ops == 0) {
                        parsedLogLine.comment = "Needs Review";
                    }


                    this.logList.push(parsedLogLine);
                    // console.log(parsedLogLine);
                    // console.log(is);
                    this.parsedLogListDB.insert(parsedLogLine);
                }

            }
        // Extension:
        // 1. can be clubbed with db stats to show how much RAM can we save
        // 2. Can also be used to suggest prefixed indexes
        }

    }
}
