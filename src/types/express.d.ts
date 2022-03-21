// /src/types/types.express.d.ts
declare namespace Express {
  export interface Request {
    user: {
      id: 1;
      email: 'tigredonorte3@gmail.com';
      name: 'thom';
      iat: 1647861646;
      exp: 1647865246;
    };
    _cookies: {
      token: string;
     };
  }
}
