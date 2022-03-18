import fs from 'fs/promises';

const fileName = 'data/products.json';

export class ProductsModel {

    async addProduct(product) {
        const readed = await fs.readFile(fileName);
        const temp = JSON.parse(Buffer.concat([readed]).toString());
        temp.push({
            title: product.title,
            price: product.price,
            description: product.description,
            image: product.image
        });
        await fs.writeFile(fileName, JSON.stringify(temp), 'utf-8');
    }

    async getProducts() {
        const readed = await fs.readFile(fileName);
        const products = JSON.parse(Buffer.concat([readed]).toString());
        return products;
    }
}
