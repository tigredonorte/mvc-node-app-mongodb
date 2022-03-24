import { NextFunction, Request, Response } from 'express';
import { isEmpty } from 'ramda';

import { Cookie } from './cookies';
import { Token } from './token';

export const userGuard = async function (req: Request<any>, res: Response<any>, next: NextFunction) {
  req._cookies = Cookie.parseCookies(req);
  const rawUser = req.session.token ? Token.getToken(req.session.token) : null;
  res.locals.user = rawUser;
  const messages =  req.flash();
  res.locals.flashMessages = isEmpty(messages) ? null: messages;
  next();
};

export const authRouteGuard = (exceptions: string[]) =>
  async function (req: Request<any>, res: Response<any>, next: NextFunction) {
    try {
      if (!res.locals.user) {
        return res.redirect('/auth/login');
      }
      next();
    } catch (error) {
      return res.redirect('/auth/login');
    }
  };

export const nonAuthRouteGuard = (exceptions: string[]) =>
  async function (req: Request<any>, res: Response<any>, next: NextFunction) {
    try {
      if (res.locals.user && exceptions.indexOf(req.url) === -1) {
        return res.status(401).json({ msg: 'Already Authenticated' });
      }
    } catch (error) {
      /** silent fail */
    }
    next();
  };
