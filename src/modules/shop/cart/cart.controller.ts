import { Request, Response } from 'express';
import { CartModel } from './cart.model';

const model = new CartModel();
const views = 'modules/shop/cart/views/';

export class CartController {
  async list(req: Request, res: Response<any>) {
    const cart = await model.getByUserId(req.user.id);
    const cartList = cart.map(it => it.get({ plain: true }));
    res.render(`${views}index`, {
      docTitle: 'My Chart',
      pageName: req.originalUrl,
      total: cartList.reduce((acc, it) => acc + (it.total ? it.total : 0), 0),
      cart: cartList,
    });
  }

  async increase(req: Request, res: Response<any>) {
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
