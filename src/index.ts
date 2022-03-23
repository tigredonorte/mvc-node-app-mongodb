import bodyParser from 'body-parser';
import connectLiveReload from 'connect-livereload';
import express from 'express';
import livereload from 'livereload';
import path from 'path';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';

import { AdminRoutes } from './modules/shop/admin.route';
import { ShopRoutes } from './modules/shop/shop.route';
import { AuthRoutes } from './modules/user/auth.route';
import { UserRoutes } from './modules/user/user.route';
import { Database } from './utils/database';
import { authRouteGuard, nonAuthRouteGuard, userGuard } from './utils/route-guard';
import { secureMiddleware } from './utils/secureApp';
import { Session } from './utils/session';

require('dotenv').config();

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

const app = express();
app.locals = { templateFolder: process.cwd() + '/src/template', user: null };
app.set('view engine', 'ejs');
app.set('views', './src/');

app.use(express.static(path.join('public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(Session.getSessionMiddleware());
app.use(csurf({}));
app.use(secureMiddleware);

app.use(connectLiveReload());
app.use(userGuard);

app.use('/auth', [nonAuthRouteGuard(['/logout']), AuthRoutes]);
app.use('/user', [authRouteGuard([]), UserRoutes]);
app.use('/admin/shop', [authRouteGuard([]), AdminRoutes]);
app.use('/shop', ShopRoutes);
app.get('/', (req, res) => res.redirect('/shop'));
app.use((req, res) => res.render('modules/index/views/404', { docTitle: 'Page not found' }));

Database.init(() => app.listen('3000', () => console.log('\nRunning on port 3000\n')));
