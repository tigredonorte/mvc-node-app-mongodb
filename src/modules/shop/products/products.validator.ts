import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';

import { handleInputError } from '../../../utils/middlewares/errorHandler';
import { isValidFile, moveFile } from '../../../utils/middlewares/fileUpload';

const views = 'modules/shop/products/views';
export class ProductsHandleError {
  static add = handleInputError({ title: 'Add Products', views, page: 'add-product' });
}

const moveImg = async(req: Request, res: Response, next: NextFunction) => {
  if (!req.body.img) {
    return next();
  }
  const fileName = req.body.title.toLowerCase().split(' ').join('-');
  const destinyFolder = 'public/images/products';
  const imgName = await moveFile(req.body.img, { fileName, allowedExtensions: ['jpg', 'png', 'jpeg'], destinyFolder });
  req.body.img = imgName;
  next();
}

export class ProductsValidator {
  static title = body('title').isLength({ min: 5 }).withMessage('Type at least 5 characters to the product title!');
  static price = body('price').isFloat({ min: 0.02, max: 100000 }).withMessage('The price must be a number');
  static description = body('description').isLength({ min: 10 }).withMessage('Type at least 120 characters');
  static img = (isEditing: boolean) => body('img').custom((img) => {
    if (img) {
      return isValidFile(img, ['jpg', 'png', 'jpeg']);
    }
    if (!isEditing) {
      throw new Error("You must inform an image!");
    }
    return true;
  });

  static valid = (isEditing: boolean) => [
    ProductsValidator.title,
    ProductsValidator.price,
    ProductsValidator.description,
    ProductsValidator.img(isEditing),
    ProductsHandleError.add,
    moveImg
  ];
}
