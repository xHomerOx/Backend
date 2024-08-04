import productModel from "../../models/productModel.js";

class ProductDao {
    constructor() {}

    static getInstance() {
        if (!ProductDao.instance) {
            ProductDao.instance = new ProductDao();
            ProductDao.instance.productModel = new productModel();
        }
        return ProductDao.instance;
    }

    async getProducts() {
        return await productModel.find().lean();
    }

    async getProductById(pid) {
        const product = await productModel.findOne({_id: pid});

        if (!product) throw new Error(`Product ${pid} does not exist!`);

        return product;
    }

    async addProducts(product, user) {
        const {title, description, code, price, stock, category, thumbnail} = product;
        const existingProduct = await productModel.findOne({ code });

        if (existingProduct) {
            throw new Error('Code could not be the same as existent one!');
        }
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Product could not be created!');
        }

        const status = stock > 0;

        try {
            const result = await productModel.create({title, description, code, price, stock, status, category, thumbnail: thumbnail ?? [], owner: (user && (user.email || user.user)) || 'admin' });

            return result;
        } catch (error) {
            throw new Error('Product could not be added!');
        }
    }

    async updateProduct(pid, productUpdate) {
        try {

            const { stock } = productUpdate;

            if (stock !== undefined) {
                productUpdate.status = stock > 0;
            }
            
            const result = await productModel.updateOne({_id: pid}, productUpdate);
            return result;
        } catch(error) {
            throw new Error('Error updating Product!');
        }
    }

    async deleteProduct(pid) {
        const result = await productModel.deleteOne({_id: pid});

        if (result.deletedCount === 0) throw new Error(`Product with ID ${pid} does not exist!`);

        return result;
    }
}

export default ProductDao;