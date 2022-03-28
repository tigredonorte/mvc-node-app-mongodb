import mongoose, { Schema } from 'mongoose';
import Stripe from 'stripe';
import { User, UsersModel } from '../../user/user/user.model';
import { cartItemSchema, CartModel, ICart } from '../cart/cart.model';

export interface IOrder extends ICart {
  _id?: Schema.Types.ObjectId;
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
  user = new UsersModel();
  async list(userId: string): Promise<IOrder[]> {
    return await Order.find({ userId });
  }

  async add(userId: string): Promise<void> {
    const cartItems = await this.cart.getByUserId(userId);
    const order = new Order({
      ...cartItems,
      products: Object.fromEntries(cartItems.products),
      userId,
      status: 'processing',
    });
    await order.save();
    await this.cart.clearCart(userId);
  }

  async get(id: string): Promise<IOrder | null> {
    return await Order.findById(id);
  }

  async edit(id: string, order: IOrder): Promise<void> {}

  async delete(id: string): Promise<void> {}

  async getCheckoutData(userId: string) {
    return await this.cart.getByUserId(userId);
  }

  async validate(sessionId: string): Promise<boolean> {
    const stripe = this.getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      throw new Error('Payment not completed!');
    }
    return true;
  }

  async processCheckout(userId: string, cart: ICart, baseUrl: string) {
    const user = await this.user.get(userId);
    if (!user) {
      throw new Error(`User doesn't exists`);
    }
    const stripe = this.getStripe();
    if (!user.paymentKey) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        description: user._id,
      });
      console.log(customer);
      user.paymentKey = customer.id;
      user.paymentName = 'stripe';

      // @ts-ignore
      await user.save();
    }
  }

  async checkoutOutside(userId: string, cart: ICart, baseUrl: string) {
    const user = await this.user.get(userId);
    if (!user) {
      throw new Error(`User doesn't exists`);
    }

    const products: any = [];
    cart.products.forEach((p) =>
      products.push({
        name: p.product.title,
        description: p.product.description,
        amount: p.product.price * 100,
        currency: 'brl',
        quantity: p.amount,
      })
    );
    const stripe = this.getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products,
      customer_email: user.email,
      success_url: `${baseUrl}/shop/orders/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/shop/orders/checkout/cancel?session_id={CHECKOUT_SESSION_ID}`,
    });
    return session.id;
  }

  getStripe = () => new Stripe(process.env.STRIPE_SECRET ?? '', { apiVersion: '2020-08-27' });
}
