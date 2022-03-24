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
    return await Product.find(userId ? { userId } : {})
        .select(['title', 'price', 'img'])
        .populate('userId', ['name']);
  }

  async get(productId: string): Promise<IProduct> {
    this.checkId(productId);
    return (await Product.findById(productId)) as IProduct;
  }

  async add(product: IProduct): Promise<void> {
    const prod = new Product(product);
    await prod.save();
  }

  async edit(productId: string, product: IProduct): Promise<void> {
    this.checkId(productId);
    await Product.updateOne({ _id: productId }, { $set: product });
  }

  async delete(productId: string): Promise<void> {
    this.checkId(productId);
    await Product.findByIdAndDelete(productId);
  }

  async isAuthorized(productId: string, userId: string) {
    const product = await Product.findOne({ _id: productId, userId });
    if (!product) {
      throw new Error('Not Authorized!');
    }
    console.log(product);
  }

  checkId(productId: string) {
    if (!productId) {
      throw new Error('You must inform the product Id');
    }
  }
}
