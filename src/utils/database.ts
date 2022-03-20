import { Sequelize } from '@sequelize/core';

require('dotenv').config();

export class Database {
  static db = new Sequelize(process.env.DB_DATABASE || '', process.env.DB_USER || '', process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
      min: 0,
      max: !!process.env.DB_POOL ? parseInt(process.env.DB_POOL) : 5,
    },
    logging: false,
  });

  static instance: Database;
  private constructor() {}

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
