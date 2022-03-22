import { UsersModel } from '../modules/user/user/user.model';

// /src/types/types.express.d.ts
declare namespace Express {
  export interface Request {
    user: UsersModel;
    _cookies: {
      token: string;
    };
  }
}
