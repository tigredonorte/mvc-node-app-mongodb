import fs from 'fs/promises';

const fileName = 'data/products.json';

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
}

export class ProductsModel {
  async getProducts() {
    const read = await fs.readFile(fileName);
    const products = JSON.parse(Buffer.concat([read]).toString());
    return products;
  }

  async addProduct(product: Product) {
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

  async getProduct(id: string) {
    const products = await this.getProducts();
    return products.find((product: Product) => product.id === id);
  }

  async editProduct(id: string, product: Product) {
    const products = await this.getProducts();
    const index = products.findIndex((product: Product) => product.id === id);
    if (index === -1) {
      return false;
    }
    products[index] = { ...product, id };
    await fs.writeFile(fileName, JSON.stringify(products), 'utf-8');
    return true;
  }

  async deleteProduct(id: string) {
    let products = await this.getProducts();
    products = products.filter((product: Product) => product.id !== id);
    await fs.writeFile(fileName, JSON.stringify(products), 'utf-8');
  }
}
