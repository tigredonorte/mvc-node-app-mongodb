import fs from 'fs/promises';
import { Database } from '../../../utils/database';

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  img: string;
}

export class ProductsModel {

  static readonly table = 'product';

  async list(): Promise<Product[]> {
    try {
      const [ matches ] = await Database.db.execute('select * from `product`');
      return (matches as Product[]);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async get(id: string): Promise<Partial<Product>> {
    try {
      const [ matches ] = await Database.db.query(
        'select * from `product` WHERE `product`.`id`= ?',
        [ id ]
      );
      return (matches as Product[])[0];
    } catch (error) {
      return {};
    }
  }

  async add(product: Product): Promise<boolean> {
    try {
      const price = parseFloat(product.price.toString()).toFixed(2);
      await Database.db.query(
        'INSERT INTO `product` (`id`, `title`, `img`, `price`, `description`) VALUES (?, ?, ?, ?, ?) ',
        [ null,  product.title, product.img, price, product.description ]
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async edit(id: string, product: Product): Promise<boolean> {
    try {
      const price = parseFloat(product.price.toString()).toFixed(2);
      await Database.db.query(
        'UPDATE `product` SET `title` = ?, `img` = ?, `price` = ?, `description` = ? WHERE id = ?',
        [ product.title, product.img, price, product.description, id ]
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await Database.db.query(
        'DELETE FROM `product` WHERE id = ?',
        [ id ]
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
