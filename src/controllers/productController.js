import { productService } from "../repositories/index.js";

class ProductController {

    async getProducts() {
        return await productService.getProducts();
    }

    async getProductById(product) {
        return await productService.getProductById(product);
    }

    async addProducts(cartId, productId) {
        return await productService.addProducts(cartId, productId);
    }

    async updateProduct(product) {
        return await productService.updateProduct(product);
    }

    async deleteProduct(product) {
        return await productService.deleteProduct(product);
    }
}

export default ProductController;