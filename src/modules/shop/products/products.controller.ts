import { Request, Response } from 'express';
import { IProduct, ProductsModel } from './products.model';

const model = new ProductsModel();
const views = 'modules/shop/products/views';

export class ProductsController {
  async list(req: Request<any>, res: Response<any>) {
    const page = Number(req.query.page ?? 1).valueOf();
    const id = req.baseUrl.match('admin') ? res.locals.user._id : undefined;
    let products: IProduct[] = [];
    let totalPages = 0;
    try {
      const data = await model.paginate(id, page);
      products = data.products;
      totalPages = data.total;
    } catch (error) {
      /**silent fail */
    }
    res.render(`${views}/index`, {
      isAdmin: !!id,
      docTitle: 'My shop',
      products,
      page,
      totalPages,
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
    res.render(`${views}/add-product`, { docTitle: 'Add Products' });
  }

  async addPost(req: Request<any>, res: Response<any>) {
    try {
      await model.add({ ...req.body, userId: res.locals.user._id });
      req.flash('success', 'Product added!');
      res.redirect('/admin/shop/');
    } catch (error: any) {
      res.render(`${views}/add-product`, {
        docTitle: 'Add Products',
        flashMessages: {
          error: [error?.message ?? error],
        },
      });
    }
  }

  async edit(req: Request<any>, res: Response<any>) {
    try {
      await model.isAuthorized(req.params.id, res.locals.user._id);
      const product = await model.get(req.params.id);
      res.render(`${views}/add-product`, {
        docTitle: 'Add Products',
        body: product,
      });
    } catch (error: any) {
      console.error(error?.message ?? error);
      req.flash('error', error?.message ?? error);
      res.redirect('/admin/shop/');
    }
  }

  async editPatch(req: Request<any>, res: Response<any>) {
    try {
      const oldProduct = await model.isAuthorized(req.params.id, res.locals.user._id);
      await model.edit(req.params.id, req.body, oldProduct);
      req.flash('success', 'Product changed!');
    } catch (error: any) {
      req.flash('error', error?.message ?? error);
    }
    res.redirect(`/admin/shop/product/edit/${req.params.id}`);
  }

  async delete(req: Request<any>, res: Response<any>) {
    try {
      const product = await model.isAuthorized(req.params.id, res.locals.user._id);
      await model.delete(req.params.id, product);
      res.json({'message' : 'Product deleted!'});
    } catch (error: any) {
      res.status(500).json({'error' : error?.message ?? error});
    }
  }
}
