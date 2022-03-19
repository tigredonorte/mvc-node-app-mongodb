import { Request, Response } from 'express';

import { OrdersModel } from './orders.model';

const model = new OrdersModel();
const views = 'modules/shop/orders/views/';

export class OrdersController {
  async list(req: Request<any>, res: Response<any>) {
    const orders = await model.list();
    res.render(`${views}index`, {
      docTitle: 'My Chart',
      pageName: req.originalUrl,
      orders,
      hasOrders: orders.length > 0,
    });
  }

  async add(req: Request<any>, res: Response<any>) {
    await model.add(req.body);
    res.redirect('/cart');
  }

  async edit(req: Request<any>, res: Response<any>) {
    await model.edit(req.params.id, req.body);
    res.redirect('/shop');
  }
}
