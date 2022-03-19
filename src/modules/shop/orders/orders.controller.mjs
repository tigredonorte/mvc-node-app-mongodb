import { OrdersModel } from './orders.model.mjs';

const model = new OrdersModel();
const views = 'modules/shop/orders/views/';

export class OrdersController {
  async list(req, res) {
    const orders = await model.get();
    res.render(`${views}index`, {
      docTitle: 'My Chart',
      pageName: req.originalUrl,
      orders,
      hasOrders: orders.length > 0,
    });
  }

  async add(req, res) {
    await model.addProduct(req.body);
    res.redirect('/cart');
  }

  async edit(req, res) {
    await model.editProduct(req.params.id, req.body);
    res.redirect('/shop');
  }
}
