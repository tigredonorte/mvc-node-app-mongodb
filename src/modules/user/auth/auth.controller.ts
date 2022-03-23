import { Request, Response } from 'express';

import { IUser, UsersModel } from '../user/user.model';

const model = new UsersModel();
const views = 'modules/user/auth/views';

export class AuthController {

  index(req: Request<any>, res: Response<any>) {
    res.redirect('/auth/login');
  }

  login(req: Request<any>, res: Response<any>) {
    res.render(`${views}/login`, {
      docTitle: 'Add User',
      pageName: req.originalUrl,
      product: {},
    });
  }

  async loginPost(req: Request<{ email: string; password: string; }>, res: Response<any>) {
    const token = await model.login(req.body);
    if (token === false) {
      return res.end();
    }
    req.session.token = token;
    req.session.save(() => res.redirect('/'));
  }

  signup(req: Request<{}>, res: Response<any>) {
    res.render(`${views}/signup`, {
      docTitle: 'Signup',
      pageName: req.originalUrl,
    });
  }

  async signupPost(req: Request<IUser>, res: Response<any>) {
    const success = await model.signup(req.body);
    if (!success) {
      return res.end();
    }
    res.redirect(`/`);
  }

  async logout(req: Request<IUser>, res: Response<any>) {
    delete req.session.token;
    req.session.destroy(() => res.redirect(`/`));
  }
}
