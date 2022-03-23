import mongoose, { Schema } from 'mongoose';

import { User } from '../../user/user/user.model';
import { cartItemSchema, CartModel, ICart } from '../cart/cart.model';

interface IOrder extends ICart {
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  status: 'processing' | 'approved' | 'shipped' | 'completed';
  total: number;
}

const Order = mongoose.model(
  'Order',
  new Schema<IOrder>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: User.modelName,
        required: true,
      },
      status: {
        type: String,
        enum: ['processing', 'approved', 'shipped', 'completed'],
        default: 'processing',
        required: true,
      },
      total: {
        type: Number,
        required: true,
        default: 0,
      },
      products: {
        type: Map,
        of: cartItemSchema,
        default: new Map(),
      },
    },
    { timestamps: true }
  )
);

export class OrdersModel {
  cart = new CartModel();
  async list(userId: string): Promise<IOrder[]> {
    try {
      return await Order.find({ userId });
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async add(userId: string): Promise<boolean> {
    try {
      const cartItems = await this.cart.getByUserId(userId);
      const order = new Order({
        ...cartItems,
        products: Object.fromEntries(cartItems.products),
        userId,
        status: 'processing',
      });
      await order.save();
      await this.cart.clearCart(userId);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async get(id: string): Promise<IOrder | null> {
    return await Order.findById(id);
  }

  async edit(id: string, order: IOrder): Promise<boolean> {
    return true;
  }

  async delete(id: string): Promise<boolean> {
    return true;
  }
}
