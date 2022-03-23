import { Request, Response } from 'express';
import { CartModel } from './cart.model';

const model = new CartModel();
const views = 'modules/shop/cart/views/';

export class CartController {
  async list(req: Request, res: Response<any>) {
    let userCart = { total: 0, products: new Map() };
    try {
      userCart = await model.getByUserId(res.locals.user._id);
    } catch (error) {
      /** silent fail */
    }

    res.render(`${views}index`, {
      docTitle: 'My Chart',
      pageName: req.originalUrl,
      total: userCart?.total || 0,
      cart: Array.from(userCart.products.values()),
    });
  }

  async increase(req: Request, res: Response<any>) {
    try {
      await model.increase(req.body.productId, res.locals.user._id);
    } catch (error: any) {
      req.flash('error', error?.message ?? error);
    }
    res.redirect('/shop/cart');
  }

  async decrease(req: Request<any>, res: Response<any>) {
    try {
      await model.decrease(req.body.productId, res.locals.user._id);
    } catch (error: any) {
      req.flash('error', error?.message ?? error);
    }
    res.redirect('/shop/cart');
  }

  async delete(req: Request<any>, res: Response<any>) {
    try {
      await model.drop(req.body.productId, res.locals.user._id);
    } catch (error: any) {
      req.flash('error', error?.message ?? error);
    }
    res.redirect('/shop/cart');
  }
}
