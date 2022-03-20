import { Request, Response } from 'express';
import { CartModel } from './cart.model';

const model = new CartModel();
const views = 'modules/shop/cart/views/';

const userId = '1';

export class CartController {
  async list(req: Request<any>, res: Response<any>) {
    const cart = await model.getByUserId(userId);
    res.render(`${views}index`, {
      docTitle: 'My Chart',
      pageName: req.originalUrl,
      total: cart.reduce((acc, it) => acc + (it.total ? it.total : 0), 0),
      cart,
    });
  }

  async increase(req: Request<any>, res: Response<any>) {
    const result = await model.increase(req.body.productId, userId);
    if (!result) {
      res.end();
    }
    res.redirect('/shop/cart');
  }

  async decrease(req: Request<any>, res: Response<any>) {
    const result = await model.decrease(req.body.productId, userId);
    if (!result) {
      res.end();
    }
    res.redirect('/shop/cart');
  }

  async delete(req: Request<any>, res: Response<any>) {
    const result = await model.drop(req.body.productId, userId);
    if (!result) {
      res.end();
    }
    res.redirect('/shop/cart');
  }
}
