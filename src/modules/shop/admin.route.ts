import express from 'express';

import { errorGuard } from '../../utils/middlewares/route-guard';
import { ProductsController } from './products/products.controller';
import { ProductsValidator as validator } from './products/products.validator';

const AdminRoutes = express.Router();
const productsController = new ProductsController();

// products
AdminRoutes.get('/product/add', errorGuard(productsController.add));
AdminRoutes.post('/product/add', validator.valid(false), errorGuard(productsController.addPost));
AdminRoutes.get('/product/edit/:id', errorGuard(productsController.edit));
AdminRoutes.post('/product/edit/:id', validator.valid(true), errorGuard(productsController.editPatch));
AdminRoutes.delete('/product/:id', errorGuard(productsController.delete));
AdminRoutes.get('/', errorGuard(productsController.list));

export { AdminRoutes };
