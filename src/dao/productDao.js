import productModel from "../models/productModel.js";

class ProductDao {
    constructor() {
      if (!ProductDao.instance) {
        ProductDao.instance = new productModel();
      }
      return ProductDao.instance;
    }

    async getProducts() {
        return await ProductDao.find().lean();
    }

    async getProductById(pid) {
        const product = await productModel.findOne({_id: pid});

        if (!product) throw new Error(`Product ${pid} does not exist!`);

        return product;
    }

    async addProducts(product) {
        const {title, description, code, price, stock, category, thumbnail} = product;
        const existingProduct = await productModel.findOne({ code });

        if (existingProduct) {
            throw new Error('Code could not be the same as existent one!');
        }
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Cart could not be created!');
        }
        
        try {
            const result = await productModel.create({title, description, code, price, stock, category, thumbnail: thumbnail ?? []});

            return result;
        } catch (error) {
            throw new Error('Product could not be added!');
        }
    }

    async updateProduct(pid, productUpdate) {
        try {
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

const instance = new ProductDao();
export default instance;