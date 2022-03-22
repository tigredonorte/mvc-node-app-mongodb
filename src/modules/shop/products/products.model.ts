import { ObjectId } from 'mongodb';

import { Database } from '../../../utils/database';

export interface IProduct {
  title: string;
  price: number;
  description: string;
  img: string;
}

export class ProductsModel {

  async list(author?: string): Promise<IProduct[]> {
    try {
      const products = await this.db().find(author ? { author } : {}).toArray();
      return (products as unknown as IProduct[]);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async get(id: string): Promise<IProduct> {
    try {
      if (!id) {
        throw new Error('You must inform the product Id');
      }
      return await this.db().findOne({ _id: new ObjectId(id) }) as unknown as IProduct;
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  }

  async add(product: IProduct): Promise<boolean> {
    try {
      product.price = parseFloat(product.price.toString());
      this.db().insertOne(product);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async edit(id: string, product: IProduct): Promise<boolean> {
    try {
      if (!id) {
        throw new Error('You must inform the product Id');
      }
      product.price = parseFloat(product.price.toString());
      await this.db().updateOne({ _id: new ObjectId(id) }, { $set: product });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      if (!id) {
        throw new Error('You must inform the product Id');
      }
      await this.db().deleteOne({ _id: new ObjectId(id) });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  db = () => Database.db.collection('products');
}
