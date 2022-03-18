import express from 'express';
import { ProductsController } from './controllers/products.controller.mjs';

const ShopRoutes = express.Router();
const controler = new ProductsController();

ShopRoutes.post('/add-product', controler.addProductPost);
ShopRoutes.get('/add-product', controler.addProductGet);
ShopRoutes.get('/', controler.listProductsPage);

export { ShopRoutes };