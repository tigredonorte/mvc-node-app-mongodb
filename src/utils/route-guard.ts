import { Express, NextFunction, Request, Response } from 'express';

import { parseCookies } from './cookies';
import { Token } from './token';

export const userGuard = (app: Express) =>
  async function (req: Request<any>, res: Response<any>, next: NextFunction) {
    req._cookies = parseCookies(req);
    const rawUser = Token.getToken(req._cookies.token);
    req.user = rawUser;
    app.locals.user = rawUser;
    next();
  };

export const authRouteGuard = (exceptions: string[]) =>
  async function (req: Request<any>, res: Response<any>, next: NextFunction) {
    try {
      if (!req.user) {
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
      if (req.user && exceptions.indexOf(req.url) === -1) {
        return res.status(401).json({ msg: 'Already Authenticated' });
      }
    } catch (error) {
      /** silent fail */
    }
    next();
  };
