import express from 'express';
import { CartController } from './cart/cart.controller.mjs';
import { OrdersController } from './orders/orders.controller.mjs';
import { ProductsController } from './products/products.controller.mjs';

const ShopRoutes = express.Router();
const productsController = new ProductsController();
const ordersController = new OrdersController();
const cartController = new CartController();

// products
ShopRoutes.get('/', productsController.list);
ShopRoutes.get('/product/add', productsController.add);
ShopRoutes.post('/product/add', productsController.addPost);
ShopRoutes.get('/product/edit/:id', productsController.edit);
ShopRoutes.post('/product/edit/:id', productsController.editPatch);
ShopRoutes.get('/product/delete/:id', productsController.delete);
ShopRoutes.get('/product/:id', productsController.show);

// cart
ShopRoutes.get('/cart', cartController.list);
ShopRoutes.post('/cart/add', cartController.add);
ShopRoutes.post('/cart/edit/:id', cartController.edit);
ShopRoutes.get('/cart/delete/:id', cartController.delete);

// orders
ShopRoutes.get('/orders', ordersController.list);
ShopRoutes.post('/orders/add', ordersController.add);
ShopRoutes.post('/orders/edit/:id', ordersController.edit);

export { ShopRoutes };
