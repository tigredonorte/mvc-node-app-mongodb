import { DataTypes, Model, Sequelize } from '@sequelize/core';

import { Database } from '../../../utils/database';
import { User } from '../../user/user/user.model';
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
  declare total?: number;
}

CartItem.init(
  {
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
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

CartItem.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'productId', onDelete: 'CASCADE' });

export class CartModel {
  static readonly table = 'cart';
  async getByUserId(userId: number): Promise<CartItem[]> {
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

      return items;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async increase(productId: string, userId: number) {
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

  async decrease(productId: string, userId: number) {
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

  async drop(productId: string, userId: number) {
    try {
      const res = await CartItem.destroy({ where: { productId, userId } });
      return res ? true : false;
    } catch (error) {
      return false;
    }
  }
}
