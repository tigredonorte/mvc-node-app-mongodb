import { Request, Response } from 'express';

import { OrdersModel } from './orders.model';

const model = new OrdersModel();
const views = 'modules/shop/orders/views/';

export class OrdersController {
  async list(req: Request<any>, res: Response<any>) {
    const orders = await req.user.getOrders({ include: ['Products'] });
    console.log(orders);
    res.render(`${views}index`, {
      docTitle: 'My Orders',
      pageName: req.originalUrl,
      orders,
      hasOrders: orders.length > 0,
    });
  }

  async add(req: Request, res: Response<any>) {
    const result = await model.add(req.user);
    if (!result) {
      return res.end();
    }
    res.redirect('/shop/orders');
  }

  async edit(req: Request<any>, res: Response<any>) {
    await model.edit(req.params.id, req.body);
    res.redirect('/shop');
  }
}
