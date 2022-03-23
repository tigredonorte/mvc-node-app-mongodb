import { CookieOptions, Request, Response } from 'express';

export class Cookie {
  static async addCookie(res: Response, cookie: { name: string; value: any; options?: CookieOptions }) {
    const value = typeof cookie.value === 'string' ? cookie.value : JSON.stringify(cookie.value);
    if (!cookie.options?.maxAge || cookie.options?.expires) {
      if (!cookie.options) {
        cookie.options = {};
      }
      cookie.options.maxAge = 1000 * 60 * 60;
    }
    await res.cookie(cookie.name, value, {
      sameSite: true,
      ...cookie.options,
      secure: process.env.NODE_ENV !== 'development',
      httpOnly: true,
    });
  }

  static async removeCookie(res: Response, cookieName: string) {
    await res.clearCookie(cookieName);
  }

  static parseCookies(request: Request<any>): Record<string, string> & { token: string } {
    const list: Record<string, string> & { token: string } = { token: '' };
    const cookieHeader = request.headers?.cookie;
    if (!cookieHeader) {
      return list;
    }

    cookieHeader.split(`;`).forEach(function (cookie) {
      let [name, ...rest] = cookie.split(`=`);
      name = name?.trim();
      if (!name) return;
      const value = rest.join(`=`).trim();
      if (!value) return;
      list[name] = decodeURIComponent(value);
    });

    return list;
  }
}
