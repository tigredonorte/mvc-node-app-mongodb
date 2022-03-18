import { ProductsModel } from "../models/products.model.mjs";

const model = new ProductsModel();
const views = 'modules/shop/views/';

export class ProductsController {

    async addProductPost(req, res) {
        await model.addProduct(req.body);
        res.redirect('/shop');
    }

    addProductGet(req, res) {
        res.render(`${views}add-product`, {
            docTitle: 'Add Products',
            pageName: req.originalUrl
        });
    }

    async listProductsPage(req, res) {
        const products = await model.getProducts();
        res.render(`${views}index`, {
            docTitle: 'My shop',
            pageName: req.originalUrl,
            products,
            hasProducts: products.length > 0
        });
    }

}