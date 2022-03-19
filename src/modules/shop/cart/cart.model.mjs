import fs from 'fs/promises';

const fileName = 'data/cart.json';

export class CartModel {
  async list() {
    const read = await fs.readFile(fileName);
    return JSON.parse(Buffer.concat([read]).toString());
  }

  async add(productId) {
    const carts = await this.list();
    const index = carts.findIndex((cart) => cart.productId === productId);
    if (index === -1) {
      carts.push({
        productId,
        amount: 1,
      });
    } else {
      carts[index] = {
        ...carts[index],
        amount: carts[index].amount + 1,
      };
    }
    await fs.writeFile(fileName, JSON.stringify(carts), 'utf-8');
  }

  async get(id) {
    const carts = await this.list();
    return carts.find((cart) => cart.productId === id);
  }

  async edit(id, cart) {
    const carts = await this.list();
    const index = carts.findIndex((cart) => cart.productId === id);
    if (index === -1) {
      return false;
    }
    carts[index] = { ...cart, id };
    await fs.writeFile(fileName, JSON.stringify(carts), 'utf-8');
    return true;
  }

  async delete(id) {
    let carts = await this.list();
    carts = carts.filter((cart) => cart.productId !== id);
    await fs.writeFile(fileName, JSON.stringify(carts), 'utf-8');
  }
}
