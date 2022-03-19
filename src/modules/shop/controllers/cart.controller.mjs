import { ChartModel } from "../models/chart.model.mjs";

const model = new ChartModel();
const views = 'modules/shop/views/';

export class CartController {

    add(req, res) {
        res.render(`${views}cart`, {
            docTitle: 'Add Product to cart',
            pageName: req.originalUrl,
            product: {}
        });
    }

    async addPost(req, res) {
        await model.addProduct(req.body);
        res.redirect('/cart');
    }

    async edit(req, res) {
        const product = await model.get(req.params.id);
        if (!product) {
            return res.end();
        }
        res.render(`${views}cart`, {
            docTitle: 'Add Products',
            pageName: req.originalUrl,
            product
        });
    }

    async editPatch(req, res) {
        await model.editProduct(req.params.id, req.body);
        res.redirect('/shop');
    }

    async deleteProduct(req, res) {
        await model.deleteProduct(req.params.id);
        res.redirect('/shop');
    }
}