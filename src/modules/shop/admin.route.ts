import express from 'express';

import { errorGuard } from '../../utils/route-guard';
import { ProductsController } from './products/products.controller';
import { ProductsValidator as validator } from './products/products.validator';

const AdminRoutes = express.Router();
const productsController = new ProductsController();

// products
AdminRoutes.get('/product/add', errorGuard(productsController.add));
AdminRoutes.post('/product/add', validator.valid, errorGuard(productsController.addPost));
AdminRoutes.get('/product/edit/:id', errorGuard(productsController.edit));
AdminRoutes.post('/product/edit/:id', validator.valid, errorGuard(productsController.editPatch));
AdminRoutes.get('/product/delete/:id', errorGuard(productsController.delete));
AdminRoutes.get('/', errorGuard(productsController.list));

export { AdminRoutes };
