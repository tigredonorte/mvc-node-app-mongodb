import { DataTypes, Model, Sequelize } from '@sequelize/core';

import { Database } from '../../../utils/database';
import { User } from '../../user/user/user.model';
import { CartItem, CartModel } from '../cart/cart.model';
import { Product } from '../products/products.model';

interface IOrder {
  productId: number;
}

const Order = Database.db.define('order', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  }
});

export const OrderItem = Database.db.define('order_item', {
  quantity: {
    type: DataTypes.INTEGER()
  }
});

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

const cart = new CartModel();

export class OrdersModel {

  async add(user: User) {
    try {
      const cartItems = await cart.getByUserId(user.id);
      const orderItems = cartItems.map((cartItem) => {
        const product = cartItem.Product;
        cartItem.Product.order_item = {
          quantity: product.amount
        };
        return product;
      });
      const order = await user.createOrder();
      await order.addProducts(orderItems);
      CartItem.destroy({ where: { userId: user.id }  });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async get(id: string) {
    return {};
  }

  async edit(id: string, order: IOrder) {
    return true;
  }

  async delete(id: string) {}
}
