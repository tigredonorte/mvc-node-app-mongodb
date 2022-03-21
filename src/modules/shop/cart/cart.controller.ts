import { Request, Response } from 'express';
import { CartModel } from './cart.model';

const model = new CartModel();
const views = 'modules/shop/cart/views/';

export class CartController {
  async list(req: Request<any>, res: Response<any>) {
    const cart = await model.getByUserId(req.user.id);
    res.render(`${views}index`, {
      docTitle: 'My Chart',
      pageName: req.originalUrl,
      total: cart.reduce((acc, it) => acc + (it.total ? it.total : 0), 0),
      cart,
    });
  }

  async increase(req: Request<any>, res: Response<any>) {
    console.log(req.user.id);
    const result = await model.increase(req.body.productId, req.user.id);
    if (!result) {
      return res.end();
    }
    res.redirect('/shop/cart');
  }

  async decrease(req: Request<any>, res: Response<any>) {
    const result = await model.decrease(req.body.productId, req.user.id);
    if (!result) {
      return res.end();
    }
    res.redirect('/shop/cart');
  }

  async delete(req: Request<any>, res: Response<any>) {
    const result = await model.drop(req.body.productId, req.user.id);
    if (!result) {
      return res.end();
    }
    res.redirect('/shop/cart');
  }
}
