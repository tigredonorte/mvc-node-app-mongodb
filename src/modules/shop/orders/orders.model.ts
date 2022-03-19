import fs from 'fs/promises';

const fileName = 'data/orders.json';

export interface Order {
  id: string;
}

export class OrdersModel {
  async list() {
    const read = await fs.readFile(fileName);
    return JSON.parse(Buffer.concat([read]).toString());
  }

  async add(order: Order) {
    const orders = await this.list();
    orders.push({
      ...order,
      id: `${Math.random() * 100000}`,
    });
    await fs.writeFile(fileName, JSON.stringify(orders), 'utf-8');
  }

  async get(id: string) {
    const orders = await this.list();
    return orders.find((order: Order) => order.id === id);
  }

  async edit(id: string, order: Order) {
    const orders = await this.list();
    const index = orders.findIndex((order: Order) => order.id === id);
    if (index === -1) {
      return false;
    }
    orders[index] = { ...order, id };
    await fs.writeFile(fileName, JSON.stringify(orders), 'utf-8');
    return true;
  }

  async delete(id: string) {
    let orders = await this.list();
    orders = orders.filter((order: Order) => order.id !== id);
    await fs.writeFile(fileName, JSON.stringify(orders), 'utf-8');
  }
}
