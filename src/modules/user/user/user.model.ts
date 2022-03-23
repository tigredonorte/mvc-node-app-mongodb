import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';

import { Token } from '../../../utils/token';

export interface IUser {
  email: string;
  password: string;
  name: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, 'Email required'],
    validate: {
      validator: function (email: string) {
        return /^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email',
    },
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
});

userSchema.post('save', function (error: any, doc: any, next: any) {
  const errorMessage = error.code === 11000 ? 'Authentication error!' : error.message;

  if (errorMessage) {
    return next(new Error(errorMessage));
  }
  next();
});

export const User = mongoose.model('user', userSchema);

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
    this.checkId(id);
    return (await User.findById({ _id: id })) as IUser;
  }

  async add(user: IUser): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(user.password as string, salt);
    const u = new User({
      ...user,
      password,
    });
    await u.save();
  }

  async edit(id: string, user: IUser): Promise<void> {
    this.checkId(id);
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password as string, salt);
    }
    await User.updateOne({ _id: id }, { $set: user });
  }

  async delete(id: string): Promise<void> {
    await User.deleteOne({ _id: id });
  }

  async login(user: { email: string; password: string }): Promise<string> {
    const foundUser = await User.findOne({ email: user.email });
    if (!foundUser) {
      throw new Error('email or password incorrect');
    }

    const password_valid = await bcrypt.compare(user.password, foundUser.password);
    if (!password_valid) {
      throw new Error('email or password incorrect');
    }
    return Token.sign(
      {
        _id: foundUser._id.toString(),
        email: foundUser.email,
        name: foundUser.name,
      },
      process.env.TOKEN_PERIOD || '2h'
    );
  }

  async signup(user: IUser): Promise<void> {
    await this.add(user);
  }

  checkId(productId: string) {
    if (!productId) {
      throw new Error('You must inform the product Id');
    }
  }
}
