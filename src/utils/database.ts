import mysql from 'mysql2';

export class Database {
  static db = mysql
    .createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
    })
    .promise();

  static instance: Database;
  private constructor() {}

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
