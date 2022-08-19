var mongoClient = require("mongodb").MongoClient;

export class MongoDBAdapter {
    private db: any;

    async connect(con_string: string, db_name: any) {
        try {
            const connection = await mongoClient.connect(con_string, { useNewUrlParser: true });
            this.db = connection.db(db_name);
            console.log("MongoClient Connection successfull.");
        }
        catch (ex) {
            console.error("MongoDB Connection Error.,", ex);
        }
    }

    private isObject(obj: any) {
        return Object.keys(obj).length > 0 && obj.constructor === Object;
    }

    async findDocFieldsByFilter(coll: string, query: any, projection: any, lmt: Number) {
        if (!query) {
            throw Error("mongoClient.findDocFieldsByFilter: query is not an object");
        }
        return await this.db.collection(coll).find(query, {
            projection: projection || {},
            limit: lmt || 0
        }).toArray();
    }

    async runAggregation(coll: string, query: any) {
        if (!query.length) {
            throw Error("mongoClient.findDocByAggregation: query is not an object");
        }
        return this.db.collection(coll).aggregate(query).toArray();
    }

    async runIndexStats(db: string, coll: string){
        const client = new mongoClient("mongodb+srv://root:root@demo.qo3dr.mongodb.net");
        await client.connect();
        const conn = await client.db(db);
        return await conn.collection(coll).aggregate([{"$indexStats": {}}]).toArray();
    }

    async getDocumentCountByQuery(coll: string, query: any) {
        return this.db.collection(coll).estimatedDocumentCount(query || {})
    }

    async runAdminCommand(command: any) {
        return this.db.collection("admin").runCommand(command);
    }

    async listDatabases() {
        const client = new mongoClient("mongodb+srv://root:root@demo.qo3dr.mongodb.net");
        await client.connect();
        const adminDb = await client.db("admin").admin();
        return await adminDb.listDatabases();
    }

    async listCollections(db: string) {
        const client = new mongoClient("mongodb+srv://root:root@demo.qo3dr.mongodb.net");
        await client.connect();
        const conn = await client.db(db);
        return await conn.listCollections().toArray();
    }

    async close() {
        return await this.db.close();
    }
}
