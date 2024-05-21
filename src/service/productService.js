import ProductDao from '../dao/productDao.js';

class ProductService {

    constructor() {
        this.productDAO = ProductDao;
    }

    async getProducts() {
        try {
            return await this.productDAO.find().getProducts();
        } catch (error) {
            throw new Error("Error finding Products!");
        }
    }    

    async getProductById(pid) {
        try {        
            return await this.productDAO.getProductById(pid);
        } catch (error) {
            throw new Error(`Product ${pid} does not exist!`);
        }
    }

    async addProducts(product) {
        try {
            return await this.productDAO.addProducts(product);
        } catch (error) {
            throw new Error("Product could not be added!");
        }
    }

    async updateProduct(pid, productUpdate) {
        try {
            return await this.productDAO.updateProduct(pid, productUpdate);
        } catch(error) {
            throw new Error('Error updating Product!');
        }
    }

    async deleteProduct(pid) {
        try {
            return await this.productDAO.deleteProduct(pid);
        } catch(error) {
            throw new Error(`Error deleting Product ${pid}`);
        }
    }
}

export default ProductService;