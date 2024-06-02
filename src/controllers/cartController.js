import { cartService } from "../repositories/index.js";

class CartController {

    async getCarts() {
        return await cartService.getCarts();
    }

    async getProductsFromCart(cart) {
        return await cartService.getProductsFromCart(cart);
    }

    async addCart() {
        return await cartService.addCart();
    }

    async addProduct(cart, product) {
        return await cartService.addProduct(cart, product);
    }

    async deleteProduct(cart, product) {
        return await cartService.deleteProduct(cart, product);
    };

    async updateProduct(cart, quantity) {
        return await cartService.updateProduct(cart, quantity);
    }

    async updateProductById(cart, product, quantity) {
        return await cartService.updateProductById(cart, product, quantity);
    }

    async deleteAllProducts(cart) {
        return await cartService.deleteAllProducts(cart);
    };

    async getStockfromProducts(cart) {
        return await cartService.getStockfromProducts(cart);
    }
}

export default CartController;