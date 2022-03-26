import bodyParser from 'body-parser';
import flash from 'connect-flash';
import connectLiveReload from 'connect-livereload';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import express, { NextFunction, Request, Response } from 'express';
import livereload from 'livereload';
import path from 'path';

import { AdminRoutes } from './modules/shop/admin.route';
import { ShopRoutes } from './modules/shop/shop.route';
import { AuthRoutes } from './modules/user/auth.route';
import { UserRoutes } from './modules/user/user.route';
import { Database } from './utils/database';
import { authRouteGuard, nonAuthRouteGuard, userGuard } from './utils/route-guard';
import { secureMiddleware } from './utils/secureApp';
import { Session } from './utils/session';

Database.init(() => {});

const app = express();

// live reload
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  const liveReloadServer = livereload.createServer();
  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh('/');
    }, 100);
  });
  app.use(connectLiveReload());
}

// template and files
app.locals = { templateFolder: process.cwd() + '/src/template', user: null };
app.set('view engine', 'ejs');
app.set('views', './src/');
app.use(express.static(path.join('public')));

// handful middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(Session.getSessionMiddleware());
app.use(csurf({}));
app.use(flash());
app.use(secureMiddleware);
app.use(userGuard);

// routes
app.use('/auth', [nonAuthRouteGuard(['/logout']), AuthRoutes]);
app.use('/user', [authRouteGuard([]), UserRoutes]);
app.use('/admin/shop', [authRouteGuard([]), AdminRoutes]);
app.use('/shop', ShopRoutes);
app.get('/', (req, res) => res.redirect('/shop'));

// not found
app.use((req, res) => res.status(404).render('modules/index/views/404', { docTitle: 'Page not found' }));

// error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const msg = err.message ? err.message : null;
  res.status(500).render('modules/index/views/500', { docTitle: 'Internal server error', docContent: msg });
});

app.listen('3000', () => console.log('\nRunning on port 3000\n'));
