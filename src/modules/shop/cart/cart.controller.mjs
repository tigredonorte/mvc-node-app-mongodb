import { CartModel } from './cart.model.mjs';

const model = new CartModel();
const views = 'modules/shop/cart/views/';

export class CartController {
  async list(req, res) {
    const cart = await model.get();
    res.render(`${views}index`, {
      docTitle: 'My Chart',
      pageName: req.originalUrl,
      cart,
    });
  }

  async increase(req, res) {
    await model.increase(req.body.productId);
    res.redirect('/shop/cart');
  }

  async decrease(req, res) {
    await model.decrease(req.body.productId, req.body);
    res.redirect('/shop/cart');
  }
}
