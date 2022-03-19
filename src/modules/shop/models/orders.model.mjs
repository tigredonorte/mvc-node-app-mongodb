import fs from 'fs/promises';

const fileName = 'data/orders.json';

export class OrdersModel {

    async list() {
        const readed = await fs.readFile(fileName);
        return JSON.parse(Buffer.concat([readed]).toString());
    }

    async add(order) {
        const orders = await this.list();
        orders.push({
            id: `${Math.random() * 100000}`
        });
        await fs.writeFile(fileName, JSON.stringify(orders), 'utf-8');
    }

    async get(id) {
        const orders = await this.list();
        return orders.find(order => order.id === id);
    }
    
    async edit(id, order) {
        const orders = await this.list();
        const index = orders.findIndex(order => order.id === id);
        if (index === -1) {
            return false;
        }
        orders[index] = { ...order, id };
        await fs.writeFile(fileName, JSON.stringify(orders), 'utf-8');
        return true;
    }

    async delete(id) {
        let orders = await this.list();
        orders = orders.filter(order => order.id !== id);
        await fs.writeFile(fileName, JSON.stringify(orders), 'utf-8');
    }
}
