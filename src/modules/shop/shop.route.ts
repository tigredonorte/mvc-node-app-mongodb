import express from 'express';

import { authRouteGuard, errorGuard } from '../../utils/middlewares/route-guard';
import { CartController } from './cart/cart.controller';
import { OrdersController } from './orders/orders.controller';
import { ProductsController } from './products/products.controller';

const ShopRoutes = express.Router();
const productsController = new ProductsController();
const ordersController = new OrdersController();
const cartController = new CartController();

// products
ShopRoutes.get('/', errorGuard(productsController.list));
ShopRoutes.get('/product/:id', errorGuard(productsController.show));

// cart
ShopRoutes.get('/cart', authRouteGuard, errorGuard(cartController.list));
ShopRoutes.post('/cart/increase', authRouteGuard, errorGuard(cartController.increase));
ShopRoutes.post('/cart/decrease', authRouteGuard, errorGuard(cartController.decrease));
ShopRoutes.delete('/cart/:productId', authRouteGuard, errorGuard(cartController.delete));

// orders
ShopRoutes.get('/orders', authRouteGuard, errorGuard(ordersController.list));
ShopRoutes.get('/orders/checkout/success', authRouteGuard, errorGuard(ordersController.success));
ShopRoutes.get('/orders/checkout/cancel', authRouteGuard, errorGuard(ordersController.cancel));
ShopRoutes.get('/orders/checkout', authRouteGuard, errorGuard(ordersController.checkout));
ShopRoutes.get('/orders/invoice/:orderId', authRouteGuard, errorGuard(ordersController.invoice));
ShopRoutes.get('/orders/add', authRouteGuard, errorGuard(ordersController.add));
ShopRoutes.post('/orders/edit/:id', authRouteGuard, errorGuard(ordersController.edit));

export { ShopRoutes };
