import express from 'express';
import { CartController } from './cart/cart.controller';
import { OrdersController } from './orders/orders.controller';
import { ProductsController } from './products/products.controller';

const ShopRoutes = express.Router();
const productsController = new ProductsController();
const ordersController = new OrdersController();
const cartController = new CartController();

// products
ShopRoutes.get('/', productsController.list);
ShopRoutes.get('/product/:id', productsController.show);

// cart
ShopRoutes.get('/cart', cartController.list);
ShopRoutes.post('/cart/increase', cartController.increase);
ShopRoutes.post('/cart/decrease', cartController.decrease);
ShopRoutes.post('/cart/delete', cartController.delete);

// orders
ShopRoutes.get('/orders', ordersController.list);
ShopRoutes.post('/orders/add', ordersController.add);
ShopRoutes.post('/orders/edit/:id', ordersController.edit);

export { ShopRoutes };
