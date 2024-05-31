import { cartService } from "../repositories/index.js";

class CartController {

    async getCarts() {
        return await cartService.getCarts();
    }

    async getProductsFromCart(cart) {
        return await cartService.getProductsFromCart(cart);
    }

    async addCart(cart) {
        return await cartService.addCart(cart);
    }

    async addProduct(cart, product) {
        return await cartService.addProduct(cart, product);
    }

    async updateProduct(cart, updatedProducts) {
        return await cartService.updateProduct(cart, updatedProducts);
    }

    async updateProductById(cart, product, quantity) {
        return await cartService.updateProductById(cart, product, quantity);
    }
}

export default CartController;