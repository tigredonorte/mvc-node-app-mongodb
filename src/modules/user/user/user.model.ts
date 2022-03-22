import bcrypt from 'bcrypt';
import { Database } from '../../../utils/database';
import { Token } from '../../../utils/token';

export interface IUser {
  email: string;
  password: string;
  name: string;
}
export class UsersModel {

  async list(): Promise<IUser[]> {
    try {
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async get(id: string): Promise<Partial<IUser>> {
    try {
      return {};
    } catch (error) {
      return {};
    }
  }

  async add(user: IUser): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async edit(id: string, user: IUser): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async login(user: { email: string; password: string }): Promise<false | string> {
    try {
      const foundUser = await this.db().findOne({ email: user.email });
      if (!foundUser) {
        return false;
      }
      const password_valid = await bcrypt.compare(user.password, foundUser.password);
      if (!password_valid) {
        return false;
      }
      return Token.sign({
        _id: foundUser._id.toString(),
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
      this.db().insertOne({
        ...user,
        password: hash,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  db = () => Database.db.collection('users');
}
