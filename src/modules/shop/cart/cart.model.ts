import { ObjectId } from 'mongodb';
import { Database } from '../../../utils/database';
import { ProductsModel } from '../products/products.model';

export interface ICart {
  _id: any;
  total: number;
  products: Record<string, ICartItem>;
}

export interface ICartItem {
  productId: string;
  productName: string;
  amount: number;
  total: number;
}

export class CartModel {
  productModel = new ProductsModel();
  emptyCart: ICart = { total: 0, _id: '', products: {} };

  getId = (userId: string) => ({ _id: new ObjectId(userId) });

  async clearCart(userId: string): Promise<boolean> {
    try {
      if (!userId) {
        throw new Error('You must inform the user Id');
      }
      await this.db().deleteOne(this.getId(userId));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getByUserId(userId: string): Promise<ICart> {
    try {
      const cart = (await this.db().findOne(this.getId(userId))) as unknown as ICart;
      if (cart) {
        return cart;
      }
      await this.db().insertOne({
        _id: new ObjectId(userId),
        total: 0,
        products: {},
      });
      return (await this.db().findOne(this.getId(userId))) as unknown as ICart;
    } catch (error) {
      console.error(error);
      return this.emptyCart;
    }
  }

  async increase(productId: string, userId: string): Promise<boolean> {
    try {
      const product = await this.productModel.get(productId);
      const cart = await this.getByUserId(userId);
      if (!cart.products[productId]) {
        await this.db().updateOne(
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
        return true;
      }

      await this.db().updateOne(
        { _id: new ObjectId(userId) },
        {
          $inc: {
            total: product.price,
            [`products.${productId}.amount`]: 1,
            [`products.${productId}.total`]: product.price,
          },
        }
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async decrease(productId: string, userId: string): Promise<boolean> {
    try {
      const product = await this.productModel.get(productId);
      const cart = await this.getByUserId(userId);
      if (cart.products[productId].amount === 1) {
        console.log(productId);
        await this.db().updateOne(
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
        return true;
      }

      await this.db().updateOne(
        { _id: new ObjectId(userId) },
        {
          $inc: {
            total: -product.price,
            [`products.${productId}.amount`]: -1,
            [`products.${productId}.total`]: -product.price,
          },
        }
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async drop(productId: string, userId: string): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      return false;
    }
  }

  db = () => Database.db.collection('cart');
}
