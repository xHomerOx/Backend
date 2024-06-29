import productModel from "./models/productModel.js";

class ProductManager {
    async getProducts() {
        try {
            return await productModel.find().lean();
        } catch (error) {
            throw new Error("Error finding Products!");
        }
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
            throw new Error('Cart could not be created!');
        }

        try {
            const result = await productModel.create({title, description, code, price, stock, category, thumbnail: thumbnail ?? [], owner: user.email || 'admin' });

            return result;
        } catch (error) {
            console.log(error);
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
        try {
            const result = await productModel.deleteOne({_id: pid});

            if (result.deletedCount === 0) throw new Error(`Product with ID ${pid} does not exist!`);

            return result;
        } catch(error) {
            throw new Error(`Error deleting Product ${pid}`);
        }
    }
}

export default ProductManager;