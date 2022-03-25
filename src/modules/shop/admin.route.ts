import express from 'express';
import { ProductsController } from './products/products.controller';
import { ProductsHandleError as errHandler, ProductsValidator as validator} from './products/products.validator';

const AdminRoutes = express.Router();
const productsController = new ProductsController();

// products
AdminRoutes.get('/product/add', productsController.add);
AdminRoutes.post('/product/add', validator.valid, errHandler.add, productsController.addPost);
AdminRoutes.get('/product/edit/:id', productsController.edit);
AdminRoutes.post('/product/edit/:id', validator.valid, errHandler.edit, productsController.editPatch);
AdminRoutes.get('/product/delete/:id', productsController.delete);
AdminRoutes.get('/', productsController.list);

export { AdminRoutes };
