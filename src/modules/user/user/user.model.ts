import { DataTypes, Model } from '@sequelize/core';
import { Database } from '../../../utils/database';
import bcrypt from 'bcrypt';
import { Token } from '../../../utils/token';

export interface IUser {
  id?: string;
  email: string;
  password: string;
  name: string;
}

export class User extends Model implements IUser {
  declare id: string;
  declare email: string;
  declare password: string;
  declare name: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: new DataTypes.STRING(64),
      unique: true,
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(200),
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(64),
      allowNull: false,
    },
  },
  {
    tableName: 'User',
    sequelize: Database.db, // passing the `sequelize` instance is required
    timestamps: true,
    hooks: {
      // beforeCreate: (user) => {
      //   user.salt = crypto.getRandomValues().toString('hex');
      //   user.password = crypt.pbkdf2Sync(user.password, user.salt, 1000, 64, `sha512`).toString(`hex`);
      // },
    },
    // instanceMethods: {
    //   validPassword: function (password) {
    //     return bcrypt.compareSync(password, this.password);
    //   },
    // },
  }
);

export class UsersModel {
  static readonly table = 'User';

  async list(): Promise<User[]> {
    try {
      return await User.findAll();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async get(id: string): Promise<Partial<User>> {
    try {
      const user = await User.findByPk(id);
      return user || {};
    } catch (error) {
      return {};
    }
  }

  async add(user: IUser): Promise<boolean> {
    try {
      await User.create({ ...user });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async edit(id: string, user: IUser): Promise<boolean> {
    try {
      await User.update({ ...user }, { where: { id } });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await User.destroy({ where: { id } });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async login(user: { email: string; password: string }): Promise<false | string> {
    try {
      const foundUser = await User.findOne({ where: { email: user.email } });
      if (!foundUser) {
        return false;
      }
      const password_valid = await bcrypt.compare(user.password, foundUser.password);
      if (!password_valid) {
        return false;
      }
      return Token.sign({
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
      }, '1h');
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async signup(user: IUser): Promise<boolean> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      await User.create({
        ...user,
        password: hash,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
