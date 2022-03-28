import bodyParser from 'body-parser';
import flash from 'connect-flash';
import connectLiveReload from 'connect-livereload';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import express from 'express';
import livereload from 'livereload';
import path from 'path';

import { AdminRoutes } from './modules/shop/admin.route';
import { ShopRoutes } from './modules/shop/shop.route';
import { AuthRoutes } from './modules/user/auth.route';
import { UserRoutes } from './modules/user/user.route';
import { Database } from './utils/database';
import { notFoundError, unhandledError } from './utils/middlewares/errorHandler';
import { parseMultipart } from './utils/middlewares/fileUpload';
import { authRouteGuard, nonAuthRouteGuard, userGuard } from './utils/middlewares/route-guard';
import { secureMiddleware } from './utils/middlewares/secureApp';
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
app.use(parseMultipart);
app.use(secureMiddleware);
app.use(userGuard);

// routes
app.use('/auth', [nonAuthRouteGuard(['/logout']), AuthRoutes]);
app.use('/user', [authRouteGuard, UserRoutes]);
app.use('/admin/shop', [authRouteGuard, AdminRoutes]);
app.use('/shop', ShopRoutes);
app.get('/', (_, res) => res.redirect('/shop'));

// not found
app.use(notFoundError);

// error handling
app.use(unhandledError);

app.listen('3000', () => console.log('\nRunning on port 3000\n'));
