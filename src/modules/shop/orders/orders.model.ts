import { Database } from '../../../utils/database';
import { CartModel, ICart } from '../cart/cart.model';

interface IOrder extends ICart {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'processing' | 'approved' | 'shipped' | 'completed';
}

export class OrdersModel {

  cart = new CartModel();
  async list(userId: string): Promise<IOrder[]> {
    try {
      return await this.db().find({ userId }).toArray() as unknown as IOrder[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async add(userId: string) {
    try {
      const cartItems = await this.cart.getByUserId(userId);
      delete cartItems._id;
      const order: IOrder = {
        ...cartItems,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'processing'
      };
      await this.db().insertOne(order);
      await this.cart.clearCart(userId);
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

  db = () => Database.db.collection('orders');
}
