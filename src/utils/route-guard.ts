import { Express, NextFunction, Request, Response } from 'express';
import { User } from '../modules/user/user/user.model';

import { parseCookies } from './cookies';
import { Token } from './token';

export const userGuard = (app: Express) =>
  async function (req: Request<any>, res: Response<any>, next: NextFunction) {
    req._cookies = parseCookies(req);
    const rawUser = Token.getToken(req._cookies.token);
    if (rawUser) {
      req.user = new User(rawUser);
      app.locals.user = rawUser;
    }
    next();
  };

export const authRouteGuard = (exceptions: string[]) =>
  async function (req: Request<any>, res: Response<any>, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ msg: "couldn't Authenticate" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ msg: "couldn't Authenticate" });
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
