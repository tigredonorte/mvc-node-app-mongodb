import { Request, Response } from 'express';

import { IProduct, ProductsModel } from './products.model';

const model = new ProductsModel();
const views = 'modules/shop/products/views';

export class ProductsController {
  async list(req: Request<any>, res: Response<any>) {
    const id = req.baseUrl.match('admin') ? res.locals.user._id : undefined;
    let products: IProduct[] = [];
    try {
      products = await model.list(id);
    } catch (error) { /**silent fail */}
    res.render(`${views}/index`, {
      isAdmin: !!id,
      docTitle: 'My shop',
      products,
      hasProducts: products.length > 0,
    });
  }

  async show(req: Request<any>, res: Response<any>) {
    try {
      const product = await model.get(req.params.id);
      res.render(`${views}/product-details`, {
        docTitle: product.title,
        product,
      });
    } catch (error) {
      return res.render('modules/index/views/404', {
        docTitle: 'Product not found',
        docContent: `The product that your looking for doesn't exists`,
      });
    }
  }

  add(req: Request<any>, res: Response<any>) {
    res.render(`${views}/add-product`, {
      docTitle: 'Add Products',
      product: {},
    });
  }

  async addPost(req: Request<any>, res: Response<any>) {
    try {
      await model.add({ ...req.body, userId: res.locals.user._id });
      res.redirect('/admin/shop/');
    } catch (error: any) {
      req.flash('error', error?.message ?? error);
      res.redirect('/admin/shop/product/add');
    }
  }

  async edit(req: Request<any>, res: Response<any>) {
    try {
      const product = await model.get(req.params.id);
      res.render(`${views}/add-product`, {
        docTitle: 'Add Products',
        product,
      });
    } catch (error) {
      return res.render('modules/index/views/404', {
        docTitle: 'Product not found',
        docContent: `The product that your looking for doesn't exists`,
      });
    }
  }

  async editPatch(req: Request<any>, res: Response<any>) {
    try {
      await model.edit(req.params.id, req.body);
      res.redirect(`/admin/shop/product/edit/${req.params.id}`);
    } catch (error: any) {
      req.flash('error', error?.message ?? error);
      res.redirect('/admin/shop/product/add');
    }
  }

  async delete(req: Request<any>, res: Response<any>) {
    try {
      await model.delete(req.params.id);
    } catch (error: any) {
      req.flash('error', error?.message ?? error);
    }
    res.redirect('/admin/shop/');
  }
}
