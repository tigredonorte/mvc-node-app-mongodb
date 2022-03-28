import { Request, Response } from 'express';
import fs from 'fs';
import fsPromises from 'fs/promises';
import PDFDocument from 'pdfkit';
import { tryCatch } from 'ramda';

import { IOrder, OrdersModel } from './orders.model';

const model = new OrdersModel();
const views = 'modules/shop/orders/views/';

export class OrdersController {
  async list(req: Request<any>, res: Response<any>) {
    let orders: IOrder[] = [];
    try {
      orders = await model.list(res.locals.user._id);
    } catch (error) {
      /** silent fail */
    }
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

  async checkout(req: Request<any>, res: Response<any>) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const cart = await model.getCheckoutData(res.locals.user._id);
    const sessionId = await model.checkoutOutside(res.locals.user._id, cart, baseUrl);
    res.render(`${views}checkout`, {
      docTitle: 'Checkout',
      cart,
      stripeKey: process.env.STRIPE_KEY,
      sessionId,
    });
  }

  async success(req: Request<any>, res: Response<any>) {
    try {
      const sessionId: string = req.query.session_id as string;
      await model.validate(sessionId);
      await model.add(res.locals.user._id);
      res.redirect('/shop/orders');
    } catch (error: any) {
      req.flash('error', error?.message ?? error);
      res.redirect('/shop/orders/checkout');
    }
  }

  async cancel(req: Request<any>, res: Response<any>) {
    res.redirect('/shop/orders/checkout');
  }

  async invoice(req: Request<any>, res: Response<any>) {
    const orderId = req.params.orderId;
    const controller = new OrdersController();
    const order = await model.get(orderId);
    if (!order) {
      throw new Error('order not found');
    }
    if (order.userId.toString() !== res.locals.user._id) {
      throw new Error('not allowed');
    }

    const invoiceName = `invoices/invoice-${orderId}.pdf`;
    await controller.createPdf(order, invoiceName, res);
    controller.downloadExistingFile(req, res);
  }

  async createPdf(order: IOrder, invoiceName: string, res: Response) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'downloadExistingFile; filename=invoice.pdf');

    const fileStream = fs.createWriteStream(invoiceName);
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(fileStream);
    doc.pipe(res);
    try {
      let total = 0;
      order?.products.forEach((product) => (total += product.total));
      doc.font('public/fonts/Roboto-Light.ttf');
      doc.fontSize(25).text(`Invoice ${order._id}`, 100, 100);
      doc.fontSize(16).text(`Total: R$ ${total}`);
      doc.moveDown();
      doc.fontSize(20).text('Products');
      order?.products.forEach(async (product) => {
        doc.moveDown(0.5);
        tryCatch(
          () => doc.image(`public/images/products/${product.product.img}`, 100, doc.y, { width: 90 }),
          () => {
            /** silent error */
          }
        )();
        doc.fontSize(14).text(product.product.title);
        doc.text(`${product.amount} x R$ ${product.product.price} = R$ ${product.total}`);
      });
    } catch (error) {
      console.error(error);
    }

    doc.end();
  }

  async downloadExistingFile(req: Request<any>, res: Response<any>) {
    const orderId = req.params.orderId;
    const invoiceName = `invoices/invoice-${orderId}.pdf`;
    const stat = await fsPromises.stat(invoiceName);
    const file = fs.createReadStream(invoiceName);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'downloadExistingFile; filename=invoice.pdf');
    res.contentType('application/pdf');
    file.pipe(res);
  }
}
