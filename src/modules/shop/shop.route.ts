import express from 'express';
import { authRouteGuard } from '../../utils/route-guard';
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
ShopRoutes.get('/cart', [ authRouteGuard([]), cartController.list ]);
ShopRoutes.post('/cart/increase', [ authRouteGuard([]), cartController.increase ]);
ShopRoutes.post('/cart/decrease', [ authRouteGuard([]), cartController.decrease ]);
ShopRoutes.post('/cart/delete', [ authRouteGuard([]), cartController.delete ]);

// orders
ShopRoutes.get('/orders', [ authRouteGuard([]), ordersController.list ]);
ShopRoutes.get('/orders/add', [ authRouteGuard([]), ordersController.add ]);
ShopRoutes.post('/orders/edit/:id', [ authRouteGuard([]), ordersController.edit ]);

export { ShopRoutes };
