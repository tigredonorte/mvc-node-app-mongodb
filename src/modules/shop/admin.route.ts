import express from 'express';
import { CartController } from './cart/cart.controller';
import { OrdersController } from './orders/orders.controller';
import { ProductsController } from './products/products.controller';

const AdminRoutes = express.Router();
const productsController = new ProductsController();

// products
AdminRoutes.get('/', productsController.list);
AdminRoutes.get('/product/add', productsController.add);
AdminRoutes.post('/product/add', productsController.addPost);
AdminRoutes.get('/product/edit/:id', productsController.edit);
AdminRoutes.post('/product/edit/:id', productsController.editPatch);
AdminRoutes.get('/product/delete/:id', productsController.delete);

export { AdminRoutes };
