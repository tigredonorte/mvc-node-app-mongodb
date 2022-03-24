import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  name: string;
  recoverDate?: Date,
  recoverHash?: string,
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
  recoverDate: Date,
  recoverHash: String
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
      user.password = await this.encryptPassword(user.password);
    }
    await User.updateOne({ _id: id }, { $set: user });
  }

  async delete(id: string): Promise<void> {
    await User.deleteOne({ _id: id });
  }

  async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  checkId(productId: string) {
    if (!productId) {
      throw new Error('You must inform the product Id');
    }
  }
}
