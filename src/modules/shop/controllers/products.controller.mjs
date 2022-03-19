import { ProductsModel } from "../models/products.model.mjs";

const model = new ProductsModel();
const views = 'modules/shop/views/';

export class ProductsController {

    async listProductsPage(req, res) {
        const products = await model.getProducts();
        res.render(`${views}index`, {
            docTitle: 'My shop',
            pageName: req.originalUrl,
            products,
            hasProducts: products.length > 0
        });
    }

    addProduct(req, res) {
        res.render(`${views}add-product`, {
            docTitle: 'Add Products',
            pageName: req.originalUrl,
            product: {}
        });
    }

    async addProductPost(req, res) {
        await model.addProduct(req.body);
        res.redirect('/shop');
    }

    async editProduct(req, res) {
        const product = await model.getProduct(req.params.id);
        if (!product) {
            return res.end();
        }
        res.render(`${views}add-product`, {
            docTitle: 'Add Products',
            pageName: req.originalUrl,
            product
        });
    }

    async editProductPatch(req, res) {
        await model.editProduct(req.params.id, req.body);
        res.redirect('/shop');
    }

    async deleteProduct(req, res) {
        await model.deleteProduct(req.params.id);
        res.redirect('/shop');
    }
}