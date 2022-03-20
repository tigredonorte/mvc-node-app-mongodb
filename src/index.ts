import bodyParser from 'body-parser';
import connectLiveReload from 'connect-livereload';
import express from 'express';
import livereload from 'livereload';
import path from 'path';

import { ShopRoutes } from './modules/shop/shop.route';
import { Database } from './utils/database';

require('dotenv').config();

const dbSync = false;
if (dbSync) {
  Database.db.sync({ alter: true }).catch(err => console.error(err));
}

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

const app = express();
app.locals = { templateFolder: process.cwd() + '/src/template' };
app.set('view engine', 'ejs');
app.set('views', './src/');

app.use(express.static(path.join('public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(connectLiveReload());

app.use('/shop', ShopRoutes);
app.get('/', (req, res) => res.redirect('/shop'));
app.use((req, res) => res.render('modules/index/views/404', { docTitle: 'Page not found' }));

// eslint-disable-next-line
app.listen('3000', () => console.log('\nRunning on port 3000\n'));
