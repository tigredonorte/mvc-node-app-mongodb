import bodyParser from 'body-parser';
import connectLiveReload from 'connect-livereload';
import express from 'express';
import session from 'express-session';
import livereload from 'livereload';
import path from 'path';

import { ShopRoutes } from './modules/shop/shop.route';
import { AuthRoutes } from './modules/user/auth.route';
import { UserRoutes } from './modules/user/user.route';
import { Database } from './utils/database';
import { authRouteGuard, nonAuthRouteGuard, userGuard } from './utils/route-guard';

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
app.use(session({ secret: process.env.SECRET || '', cookie: { secure: true }, resave: false,  saveUninitialized: true }));
app.use(connectLiveReload());
app.use(userGuard(app))

app.use('/auth', [ nonAuthRouteGuard(['/logout']), AuthRoutes ]);
app.use('/user', [ authRouteGuard([]), UserRoutes]);
app.use('/shop', ShopRoutes);
app.get('/', (req, res) => res.redirect('/shop'));
app.use((req, res) => res.render('modules/index/views/404', { docTitle: 'Page not found' }));

// eslint-disable-next-line
Database.db
  .sync({ alter: true })
  .then(() => {
    app.listen('3000', () => console.log('\nRunning on port 3000\n'));
  })
  .catch(err => console.error(err));
