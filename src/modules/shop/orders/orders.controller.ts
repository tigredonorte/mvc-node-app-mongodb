import { Request, Response } from 'express';

import { OrdersModel, IOrder } from './orders.model';

const model = new OrdersModel();
const views = 'modules/shop/orders/views/';

export class OrdersController {
  async list(req: Request<any>, res: Response<any>) {
    let orders: IOrder[] = [];
    try {
      orders = await model.list(res.locals.user._id);
    } catch (error) {/** silent fail */}
    res.render(`${views}index`, {
      docTitle: 'My Orders',
      orders,
      hasOrders: orders.length > 0,
    });
  }

  async add(req: Request, res: Response<any>) {
    try {
      await model.add(res.locals.user._id);
      res.redirect('/shop/orders');
    } catch (error: any) {
      req.flash('error', error?.message ?? error);
      res.redirect('/shop/cart');
    }
  }

  async edit(req: Request<any>, res: Response<any>) {
    try {
      await model.edit(req.params.id, req.body);
      res.redirect('/shop');
    } catch (error: any) {
      req.flash('error', error?.message ?? error);
      res.redirect('/shop/orders');
    }
  }
}
