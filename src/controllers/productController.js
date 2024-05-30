import { productService } from "../repositories/index.js";

class ProductController {

    async getProducts() {
        return await productService.getProducts();
    }

    async getProductById(product) {
        return await productService.getProductById(product);
    }

    async addProducts(product) {
        return await productService.addProducts(product);
    }

    async updateProduct(product) {
        return await productService.updateProduct(product);
    }

    async deleteProduct(product) {
        return await productService.deleteProduct(product);
    }
}

export default ProductController;