import { DataTypes, Model } from '@sequelize/core';

import { Database } from '../../../utils/database';

interface IProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  img: string;
}

export class Product extends Model implements IProduct {
  declare id: string;
  declare title: string;
  declare price: number;
  declare description: string;
  declare img: string;
}

Product.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: new DataTypes.STRING(64),
    allowNull: false,
  },
  description: {
    type: new DataTypes.TEXT(),
    allowNull: false
  },
  price: {
    type: new DataTypes.FLOAT(11, 2),
    allowNull: false
  },
  img: {
    type: new DataTypes.STRING(64),
    allowNull: false,
  },
},
  {
    tableName: "product",
    sequelize: Database.db, // passing the `sequelize` instance is required
  }
);


export class ProductsModel {

  static readonly table = 'product';

  async list(): Promise<Product[]> {
    try {
      return await Product.findAll();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async get(id: string): Promise<Partial<Product>> {
    try {
      const product = await Product.findByPk(id);
      return product || {};
    } catch (error) {
      return {};
    }
  }

  async add(product: IProduct): Promise<boolean> {
    try {
      const price = parseFloat(product.price.toString());
      await Product.create({
        ...product,
        price: price,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async edit(id: string, product: IProduct): Promise<boolean> {
    try {
      const price = parseFloat(product.price.toString());
      await Product.update({...product, price}, { where: { id } } );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await Product.destroy({ where: { id } });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
