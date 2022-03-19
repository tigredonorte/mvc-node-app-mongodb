import { Request, Response } from 'express';
import { CartModel } from './cart.model';

const model = new CartModel();
const views = 'modules/shop/cart/views/';

export class CartController {
  async list(req: Request<any>, res: Response<any>) {
    const cart = await model.get();
    res.render(`${views}index`, {
      docTitle: 'My Chart',
      pageName: req.originalUrl,
      cart,
    });
  }

  async increase(req: Request<any>, res: Response<any>) {
    await model.increase(req.body.productId);
    res.redirect('/shop/cart');
  }

  async decrease(req: Request<any>, res: Response<any>) {
    await model.decrease(req.body.productId);
    res.redirect('/shop/cart');
  }
}
