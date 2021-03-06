import mongoose, { Schema } from 'mongoose';
import fs from 'fs/promises';

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

  async paginate(userId: string, page: number, itemsPerPage = 3): Promise<{ products: IProduct[]; total: number }> {
    const where = userId ? { userId } : {};
    const total = await Product.countDocuments(where);
    const products = await Product.find(where)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .select(['title', 'price', 'img'])
      .populate('userId', ['name']);
    return { products, total: Math.ceil(total / itemsPerPage) };
  }

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

  async edit(productId: string, product: IProduct, oldProduct: IProduct): Promise<void> {
    this.checkId(productId);
    if (oldProduct.title !== product.title) {
      if (!product.img) {
        const img = product.title.toLowerCase().split(' ').join('-');
        const ext = oldProduct.img.split('.').pop();
        await fs.rename(`public/images/products/${oldProduct.img}`, `public/images/products/${img}.${ext}`);
        product.img = `${img}.${ext}`;
      } else {
        this.deleteFile(product);
      }
    }
    await Product.updateOne({ _id: productId }, { $set: product });
  }

  async delete(productId: string, product: IProduct): Promise<void> {
    this.checkId(productId);
    this.deleteFile(product);
    await Product.findByIdAndDelete(productId);
  }

  async isAuthorized(productId: string, userId: string): Promise<IProduct> {
    const product = await Product.findOne({ _id: productId, userId });
    if (!product) {
      throw new Error('Not Authorized!');
    }
    return product;
  }

  async deleteFile(product: IProduct) {
    await fs.unlink(`public/images/products/${product.img}`);
  }

  checkId(productId: string) {
    if (!productId) {
      throw new Error('You must inform the product Id');
    }
  }
}
