import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';

import { Token } from '../../../utils/token';

export interface IUser {
  email: string;
  password: string;
  name: string;
}

export const User = mongoose.model(
  'user',
  new Schema<IUser>({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  })
);

export class UsersModel {
  async list(): Promise<IUser[]> {
    try {
      return await User.find();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async get(id: string): Promise<IUser | null> {
    try {
      this.checkId(id);
      return (await User.findById({ _id: id })) as IUser;
    } catch (error) {
      return null;
    }
  }

  async add(user: IUser): Promise<boolean> {
    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(user.password as string, salt);
      const u = new User({
        ...user,
        password,
      });
      await u.save();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async edit(id: string, user: IUser): Promise<boolean> {
    try {
      this.checkId(id);
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password as string, salt);
      }
      User.updateOne({ _id: id }, { $set: user });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      this.checkId(id);
      await User.deleteOne({ _id: id });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async login(user: { email: string; password: string }): Promise<false | string> {
    try {
      const foundUser = await User.findOne({ email: user.email });
      if (!foundUser) {
        return false;
      }
      const password_valid = await bcrypt.compare(user.password, foundUser.password);
      if (!password_valid) {
        return false;
      }
      return Token.sign(
        {
          _id: foundUser._id.toString(),
          email: foundUser.email,
          name: foundUser.name,
        },
        process.env.TOKEN_PERIOD || '2h'
      );
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async signup(user: IUser): Promise<boolean> {
    try {
      await this.add(user);
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
