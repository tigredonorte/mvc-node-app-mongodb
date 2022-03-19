import fs from 'fs/promises';
import { ProductsModel } from '../products/products.model.mjs';

const fileName = 'data/cart.json';
const productModel = new ProductsModel();
const initialCart = {
  total: 0,
  products: [],
};

export class CartModel {
  async get() {
    const read = await fs.readFile(fileName);
    const cart = JSON.parse(Buffer.concat([read]).toString());
    return !cart.products ? initialCart : cart;
  }

  async increase(productId) {
    const cart = await this.get();
    const index = cart.products.findIndex((c) => c.productId === productId);
    const product = await productModel.getProduct(productId);
    cart.total = (cart.total || 0) + parseFloat(product.price);
    if (index === -1) {
      cart.products.push({
        productId,
        product,
        amount: 1,
        subTotal: parseFloat(product.price),
      });
    } else {
      cart.products[index] = {
        ...cart.products[index],
        amount: +cart.products[index].amount + 1,
        subTotal: +cart.products[index].subTotal + parseFloat(product.price),
      };
    }
    await fs.writeFile(fileName, JSON.stringify(cart), 'utf-8');
  }

  async decrease(productId) {
    let cart = await this.get();
    const index = cart.products.findIndex((c) => c.productId === productId);
    if (!cart.products[index]) {
      return;
    }

    const product = await productModel.getProduct(productId);
    cart.total = cart.total - parseFloat(product.price);
    if (cart.products[index].amount > 1) {
      cart.products[index] = {
        ...cart.products[index],
        amount: cart.products[index].amount - 1,
        subTotal: cart.products[index].subTotal - parseFloat(product.price),
      };
    } else {
      cart.products = cart.products.filter((p) => p.productId !== productId);
    }
    await fs.writeFile(fileName, JSON.stringify(cart), 'utf-8');
  }
}
