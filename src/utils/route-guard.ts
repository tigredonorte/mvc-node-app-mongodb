import { Express, NextFunction, Request, Response } from 'express';

import { parseCookies } from './cookies';
import { Token } from './token';

export const userGuard = (app: Express) =>
  async function (req: Request<any>, res: Response<any>, next: NextFunction) {
    // @ts-ignore
    req._cookies = parseCookies(req);
    req.user = Token.getToken(req._cookies.token);
    app.locals.user = req.user;
    next();
  };

export const authRouteGuard = (exceptions: string[]) =>
  async function (req: Request<any>, res: Response<any>, next: NextFunction) {
    try {
      const user = Token.getToken(req._cookies.token);
      if (!user) {
        return res.status(401).json({ msg: "couldn't Authenticate" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ msg: "couldn't Authenticate" });
    }
  };

export const nonAuthRouteGuard = (exceptions: string[]) =>
  async function (req: Request<any>, res: Response<any>, next: NextFunction) {
    try {
      const user = Token.getToken(req._cookies.token);
      if (user && exceptions.indexOf(req.url) === -1) {
        return res.status(401).json({ msg: 'Already Authenticated' });
      }
    } catch (error) {
      /** silent fail */
    }
    next();
  };
