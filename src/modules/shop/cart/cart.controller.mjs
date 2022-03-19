import { CartModel } from './cart.model.mjs';

const model = new CartModel();
const views = 'modules/shop/cart/views/';

export class CartController {
  async list(req, res) {
    const products = await model.list();
    console.log(products);
    res.render(`${views}index`, {
      docTitle: 'My Chart',
      pageName: req.originalUrl,
      products,
      hasProducts: products.length > 0,
    });
  }

  async add(req, res) {
    console.log(req.params);
    await model.add(req.body.productId);
    res.redirect('/shop/cart');
  }

  async edit(req, res) {
    await model.edit(req.params.id, req.body);
    res.redirect('/shop');
  }

  async delete(req, res) {
    await model.delete(req.params.id);
    res.redirect('/shop');
  }
}
