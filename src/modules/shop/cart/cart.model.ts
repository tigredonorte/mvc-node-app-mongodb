import { ObjectId } from 'mongodb';
import mongoose, { Schema } from 'mongoose';
import { IProduct, Product, ProductsModel } from '../products/products.model';

export interface ICart {
  total: number;
  products: Map<string, ICartItem>;
}

export interface ICartItem {
  product: IProduct;
  amount: number;
  total: number;
}

export const cartItemSchema = new Schema<ICartItem>({
  product: {
    type: Product.schema,
  },
  amount: {
    type: Number,
    default: 1,
  },
  total: {
    type: Number,
    default: 0,
  },
});

const Cart = mongoose.model(
  'cart',
  new Schema<ICart>({
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
  })
);

export class CartModel {
  productModel = new ProductsModel();
  emptyCart: ICart = { total: 0, products: new Map() };

  getId = (userId: string) => ({ _id: new ObjectId(userId) });

  async clearCart(userId: string): Promise<void> {
    this.checkId('_', userId);
    await Cart.deleteOne(this.getId(userId));
  }

  async getByUserId(userId: string): Promise<ICart> {
    try {
      this.checkId('_', userId);
      const cart = await Cart.findOne(this.getId(userId));
      if (cart) {
        return cart;
      }
      const _cart = new Cart({
        _id: new ObjectId(userId),
        total: 0,
        products: {},
      });
      await _cart.save();

      return _cart;
    } catch (error) {
      console.error(error);
      return this.emptyCart;
    }
  }

  async increase(productId: string, userId: string): Promise<void> {
    this.checkId(productId, userId);
    const product = await this.productModel.get(productId);
    const cart = new Cart(await this.getByUserId(userId));
    if (!cart?.products?.get(productId)) {
      await Cart.updateOne(
        { _id: new ObjectId(userId) },
        {
          $inc: {
            total: product.price,
          },
          $set: {
            [`products.${productId}.product`]: product,
            [`products.${productId}.amount`]: 1,
            [`products.${productId}.total`]: product.price,
          },
        }
      );
      return;
    }

    await this.changeQuantity({ userId, productId, productPrice: product.price, increment: true });
  }

  async decrease(productId: string, userId: string): Promise<void> {
    this.checkId(productId, userId);
    const product = await this.productModel.get(productId);
    const cart = await this.getByUserId(userId);
    if (cart.products.get(productId)?.amount === 1) {
      return await this.drop(productId, userId);
    }

    await this.changeQuantity({ userId, productId, productPrice: product.price, increment: false });
  }

  async drop(productId: string, userId: string): Promise<void> {
    this.checkId(productId, userId);
    const product = await this.productModel.get(productId);
    await Cart.updateOne(
      { _id: new ObjectId(userId) },
      {
        $inc: {
          total: -product.price,
        },
        $unset: {
          [`products.${productId}`]: '',
        },
      }
    );
  }

  private async changeQuantity(data: { userId: string; productId: string; productPrice: number; increment: boolean }) {
    const multiplier = data.increment ? 1 : -1;
    await Cart.updateOne(
      { _id: new ObjectId(data.userId) },
      {
        $inc: {
          total: multiplier * data.productPrice,
          [`products.${data.productId}.amount`]: multiplier * 1,
          [`products.${data.productId}.total`]: multiplier * data.productPrice,
        },
      }
    );
  }

  checkId(productId: string, userId: string) {
    if (!productId) {
      throw new Error('You must inform the product Id');
    }
    if (!userId) {
      throw new Error('You must inform the userId');
    }
  }
}
