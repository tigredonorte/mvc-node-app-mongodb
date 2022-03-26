import express from 'express';

import { authRouteGuard, errorGuard } from '../../utils/route-guard';
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
ShopRoutes.get('/cart', authRouteGuard([]), errorGuard(cartController.list ));
ShopRoutes.post('/cart/increase', authRouteGuard([]), errorGuard(cartController.increase ));
ShopRoutes.post('/cart/decrease', authRouteGuard([]), errorGuard(cartController.decrease ));
ShopRoutes.post('/cart/delete', authRouteGuard([]), errorGuard(cartController.delete ));

// orders
ShopRoutes.get('/orders', authRouteGuard([]), errorGuard(ordersController.list ));
ShopRoutes.get('/orders/add', authRouteGuard([]), errorGuard(ordersController.add ));
ShopRoutes.post('/orders/edit/:id', authRouteGuard([]), errorGuard(ordersController.edit ));

export { ShopRoutes };
