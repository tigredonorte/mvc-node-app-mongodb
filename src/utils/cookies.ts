import { Request } from 'express';

export function parseCookies(request: Request<any>): Record<string, string> & { token: string; } {
  const list: Record<string, string> & { token: string; } = { token: '' };
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
