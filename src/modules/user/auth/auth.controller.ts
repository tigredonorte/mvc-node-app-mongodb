import { Request, Response } from 'express';

import { IUser, UsersModel } from '../user/user.model';
import { AuthModel } from './auth.model';

const model = new AuthModel();
const views = 'modules/user/auth/views';

export class AuthController {
  index(req: Request<any>, res: Response<any>) {
    res.redirect('/auth/login');
  }

  login(req: Request<any>, res: Response<any>) {
    res.render(`${views}/login`, {
      docTitle: 'Add User',
      product: {},
    });
  }

  async loginPost(req: Request<any, any, { email: string; password: string }>, res: Response<any>) {
    try {
      const token = await model.login(req.body);
      req.session.token = token;
      req.session.save(() => res.redirect('/'));
    } catch (error: any) {
      req.flash('error', error?.message ?? error);
      res.redirect('/auth/login');
    }
  }

  signup(req: Request, res: Response<any>) {
    res.render(`${views}/signup`, {
      docTitle: 'Signup',
    });
  }

  async signupPost(req: Request<any, any, IUser>, res: Response<any>) {
    let redirectPage = '/auth/signup';
    try {
      await model.signup(req.body);
      const token = await model.login(req.body);
      req.session.token = token;
      redirectPage = '';
      model.signupEmail(req.body);
      req.session.save(() => res.redirect('/'));
    } catch (error: any) {
      console.error(error);
      if (redirectPage) {
        req.flash('error', error?.message ?? error);
        res.redirect(redirectPage);
      }
    }
  }

  recover(req: Request, res: Response<any>) {
    res.render(`${views}/recover`, {
      docTitle: 'Recover password',
    });
  }

  async recoverPost(req: Request<any, any, { email: string }>, res: Response<any>) {
    try {
      await model.recover(req.body.email);
      res.render(`${views}/recoverSuccess`, {
        docTitle: 'Recover password',
      });
    } catch (error: any) {
      req.flash('error', error?.message ?? error);
      res.redirect('/auth/login');
    }
  }

  async changePassword(req: Request<any, any, any, { hash: string }>, res: Response<any>) {
    try {
      const hash = req.params.hash;
      await model.checkHashToRecoverPassword(hash);
      res.render(`${views}/changePassword`, {
        docTitle: 'Change password',
        hash
      });
    } catch (error: any) {
      console.error(error?.message ?? error);
      req.flash('error', error?.message ?? error);
      res.redirect('/auth/recover');
    }
  }

  async changePasswordPost(req: Request<any, any, { password: string; confirm_password: string }>, res: Response<any>) {
    try {
      await model.changePassword(req.params.hash, req.body);
      req.flash('success', 'Password changed!');
      res.redirect(`/auth/login`);
    } catch (error: any) {
      console.error(error?.message ?? error);
      req.flash('error', error?.message ?? error);
      res.redirect(`/auth/changePassword/${req.params.hash}`);
    }
  }

  async logout(req: Request<IUser>, res: Response<any>) {
    delete req.session.token;
    req.session.destroy(() => res.redirect(`/`));
  }
}
