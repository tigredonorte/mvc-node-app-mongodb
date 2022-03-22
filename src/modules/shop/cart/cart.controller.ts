import { Request, Response } from 'express';
import { CartModel } from './cart.model';

const model = new CartModel();
const views = 'modules/shop/cart/views/';

export class CartController {
  async list(req: Request, res: Response<any>) {
    const userCart = await model.getByUserId(req.user._id);
    console.log(Object.values(userCart.products));
    res.render(`${views}index`, {
      docTitle: 'My Chart',
      pageName: req.originalUrl,
      total: userCart?.total || 0,
      cart: Object.values(userCart.products),
    });
  }

  async increase(req: Request, res: Response<any>) {
    const result = await model.increase(req.body.productId, req.user._id);
    if (!result) {
      return res.end();
    }
    res.redirect('/shop/cart');
  }

  async decrease(req: Request<any>, res: Response<any>) {
    const result = await model.decrease(req.body.productId, req.user._id);
    if (!result) {
      return res.end();
    }
    res.redirect('/shop/cart');
  }

  async delete(req: Request<any>, res: Response<any>) {
    const result = await model.drop(req.body.productId, req.user._id);
    if (!result) {
      return res.end();
    }
    res.redirect('/shop/cart');
  }
}
