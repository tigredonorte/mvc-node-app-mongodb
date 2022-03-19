import express from 'express';
import { ProductsController } from './controllers/products.controller.mjs';

const ShopRoutes = express.Router();
const controler = new ProductsController();

ShopRoutes.get('/', controler.listProductsPage);
ShopRoutes.get('/add-product', controler.addProduct);
ShopRoutes.post('/add-product', controler.addProductPost);
ShopRoutes.get('/edit/:id', controler.editProduct);
ShopRoutes.post('/edit/:id', controler.editProductPatch);
ShopRoutes.get('/delete/:id', controler.deleteProduct);

export { ShopRoutes };
