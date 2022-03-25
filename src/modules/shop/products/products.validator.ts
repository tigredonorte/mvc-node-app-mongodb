import { body } from 'express-validator/check';

import { handleInputError } from '../../../utils/formErrorHandler';

const views = 'modules/shop/products/views';
export class ProductsHandleError {
  static add = handleInputError({ title: 'Add Products', page: 'add-product', views });
}

export class ProductsValidator {
  static title = body('title').isLength({ min: 5 }).withMessage('Type at least 5 characters to the product title!');
  static price = body('price').isFloat({ min: 0.02, max: 100000 }).withMessage('The price must be a number');
  static description = body('description').isLength({ min: 120 }).withMessage('Type at least 120 characters');
  static img = body('img').isURL().withMessage('Type a valid url');

  static valid = [
    ProductsValidator.title,
    ProductsValidator.price,
    ProductsValidator.description,
    ProductsValidator.img,
    ProductsHandleError.add
  ];
}
