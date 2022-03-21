import fs from 'fs/promises';

export interface Order {
  id: string;
}

export class OrdersModel {
  async list() {
    return [];
    // const read = await fs.readFile(fileName);
    // return JSON.parse(Buffer.concat([read]).toString());
  }

  async add(order: Order) {}

  async get(id: string) {
    return {};
  }

  async edit(id: string, order: Order) {
    return true;
  }

  async delete(id: string) {}
}
