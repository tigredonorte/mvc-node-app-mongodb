import { Db, MongoClient, ServerApiVersion } from 'mongodb';

require('dotenv').config();

export class Database {
  static db: Db;

  static instance: Database;
  static init(callback: () => void) {
    console.log(process.env.MONGO_URL);
    const client = new MongoClient(process.env.MONGO_URL || '', {
      serverApi: ServerApiVersion.v1,
    });
    client.connect(() => {
      Database.db = client.db();
      callback();
    });
  }
  private constructor() {}

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
