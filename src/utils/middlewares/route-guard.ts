import { NextFunction, Request, Response } from 'express';
import { type } from 'os';
import { isEmpty } from 'ramda';

import { Cookie } from '../cookies';
import { Token } from '../token';

export const userGuard = async function (req: Request<any>, res: Response<any>, next: NextFunction) {
  req._cookies = Cookie.parseCookies(req);
  const rawUser = req.session.token ? Token.getToken(req.session.token) : null;
  res.locals.user = rawUser;
  const messages = req.flash();
  res.locals.flashMessages = isEmpty(messages) ? null : messages;
  res.locals.errorMessage = {};
  res.locals.body = req.body;
  next();
};

export const authRouteGuard = (req: Request<any>, res: Response<any>, next: NextFunction) => {
  if (!res.locals.user) {
    return res.status(401).redirect('/auth/login');
  }
  next();
}

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

export const errorGuard = (route: (req: any, res: any, next: any) => void) =>
  async function (req: Request<any>, res: Response<any>, next: NextFunction) {
    try {
      if (typeof route !== 'function') {
        throw new Error('route is not a function!');
      }
      await route(req, res, next);
    } catch (error) {
      next(error);
    }
  };
