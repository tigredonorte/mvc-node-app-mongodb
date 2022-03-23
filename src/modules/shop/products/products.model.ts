import { ObjectId } from 'mongodb';
import mongoose, { Schema } from 'mongoose';

import { User } from '../../user/user/user.model';

export interface IProduct {
  title: string;
  price: number;
  description: string;
  img: string;
  userId: string | Schema.Types.ObjectId;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: User.modelName,
    required: true,
  },
});

export const Product = mongoose.model('product', productSchema);

export class ProductsModel {
  async list(userId?: string): Promise<IProduct[]> {
    try {
      return await Product.find(userId ? { userId } : {})
        .select(['title', 'price', 'img'])
        .populate('userId', ['name']);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async get(productId: string): Promise<IProduct> {
    try {
      this.checkId(productId);
      return (await Product.findById(productId)) as IProduct;
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  }

  async add(product: IProduct): Promise<boolean> {
    try {
      const prod = new Product(product);
      await prod.save();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async edit(productId: string, product: IProduct): Promise<boolean> {
    try {
      this.checkId(productId);
      await Product.updateOne({ _id: productId }, { $set: product });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async delete(productId: string): Promise<boolean> {
    try {
      this.checkId(productId);
      await Product.findByIdAndDelete(productId);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  checkId(productId: string) {
    if (!productId) {
      throw new Error('You must inform the product Id');
    }
  }
}
