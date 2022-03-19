import fs from 'fs/promises';

const fileName = 'data/products.json';

export class ProductsModel {
  async getProducts() {
    const read = await fs.readFile(fileName);
    const products = JSON.parse(Buffer.concat([read]).toString());
    return products;
  }

  async addProduct(product) {
    const products = await this.getProducts();
    products.push({
      id: `${Math.random() * 100000}`,
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.image,
    });
    await fs.writeFile(fileName, JSON.stringify(products), 'utf-8');
  }

  async getProduct(id) {
    const products = await this.getProducts();
    return products.find((product) => product.id === id);
  }

  async editProduct(id, product) {
    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      return false;
    }
    products[index] = { ...product, id };
    await fs.writeFile(fileName, JSON.stringify(products), 'utf-8');
    return true;
  }

  async deleteProduct(id) {
    let products = await this.getProducts();
    products = products.filter((product) => product.id !== id);
    await fs.writeFile(fileName, JSON.stringify(products), 'utf-8');
  }
}
