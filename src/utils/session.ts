import mongoSessionStore from 'connect-mongodb-session';
import session from 'express-session';

const SessionStore = mongoSessionStore(session);

export class Session {
  static getSessionMiddleware() {
    const store = new SessionStore({
      uri: process.env.MONGO_URL || '',
      collection: 'session',
    });
    return session({
      store,
      secret: process.env.SECRET || '',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV !== 'development',
        sameSite: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      },
    });
  }
}
