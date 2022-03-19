import fs from 'fs/promises';
import { ResultSetHeader } from 'mysql2';
import { Database } from '../../../utils/database';

import { ProductsModel } from '../products/products.model';

interface CartItem {
  productId: string;
  userId: string;
  amount: number;
  total?: number;
}

export class CartModel {

  static readonly table = 'cart';
  async getByUserId(userId: string): Promise<CartItem[]> {
    try {
      const [ matches ] = await Database.db.execute(
        `select amount, product.*, product.price * amount as total ` +
        `from ${CartModel.table} ` +
        `LEFT JOIN ${ProductsModel.table} ON product.id = cart.productId ` +
        `WHERE userId = ?`,
        [ userId ]
      );
      return (matches as CartItem[]);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async increase(productId: string, userId: string) {
    try {
      await Database.db.query(
        `INSERT INTO ${CartModel.table} (productId, userId) VALUES (?, ?) ON DUPLICATE KEY UPDATE amount = amount + 1`,
        [ productId, userId ]
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async decrease(productId: string, userId: string) {
    try {
      const [ res ] = await Database.db.query(
        `DELETE FROM ${CartModel.table} WHERE productId = ? AND userId = ? AND amount - 1 < 1`,
        [ productId, userId ]
      );
      const results: any = res;
      if (results.affectedRows > 1) {
        return true;
      }
      await Database.db.query(
        `UPDATE ${CartModel.table} SET amount = amount - 1 WHERE productId = ? AND userId = ?`,
        [ productId, userId ]
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
