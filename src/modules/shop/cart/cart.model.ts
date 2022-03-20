import { DataTypes, Model, Sequelize } from '@sequelize/core';

import { Database } from '../../../utils/database';
import { Product } from '../products/products.model';

interface ICartItem {
  productId: string;
  userId: string;
  amount: number;
  total?: number;
}

export class CartItem extends Model implements ICartItem {
  declare productId: string;
  declare userId: string;
  declare amount: number;
}

CartItem.init(
  {
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
    },
    userId: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
      primaryKey: true,
    },
    amount: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'cart',
    sequelize: Database.db, // passing the `sequelize` instance is required
  }
);

CartItem.belongsTo(Product, { foreignKey: 'productId' });

export class CartModel {
  static readonly table = 'cart';
  async getByUserId(userId: string): Promise<ICartItem[]> {
    try {
      const items = await CartItem.findAll({
        where: { userId },
        include: [
          {
            model: Product,
            attributes: ['id', 'title', 'description', 'price', 'img'],
          },
        ],
        attributes: ['amount', [Sequelize.literal('amount * price'), 'total']],
      });

      return items.map((el) => el.get({ plain: true }));
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async increase(productId: string, userId: string) {
    try {
      const res: any = await CartItem.increment({ amount: 1 }, { where: { productId, userId } });
      if (res[0][1]) {
        return true;
      }
      await CartItem.upsert({
        productId,
        userId,
        amount: Sequelize.literal('amount + 1'),
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async decrease(productId: string, userId: string) {
    try {
      const res = await CartItem.destroy({
        where: {
          productId,
          userId,
          amount: Sequelize.literal(`amount - 1 < 1`),
        },
      });
      if (!res) {
        await CartItem.decrement({ amount: 1 }, { where: { productId, userId } });
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async drop(productId: string, userId: string) {
    try {
      const res = await CartItem.destroy({ where: { productId, userId } });
      return res ? true : false;
    } catch (error) {
      return false;
    }
  }
}
