import CartDao from '../dao/cartDao.js';

class CartService {
  
    constructor() {
      this.cartDAO = CartDao;
    }

    async getCarts() {
      try {
        return await this.cartDAO.getCarts();
      } catch (error) {
        throw new Error("Error finding Carts!");
      }
    }

    async getProductsFromCart(cartId) {
      const cart = await this.cartDAO.getProductsFromCart(cartId);
      if (!cart) {
        throw new Error(`Cart ${cartId} not found.`);
      }
      return cart;
    }

    async addCart() {
      try {
        const cart = await this.cartDAO.addCart();     
        return cart;
      } catch (error) {
        throw new Error("Error creating cart");
      }
    }

    async addProduct(cartId, productId) {
      try {
        const cart = await this.cartDAO.addProduct(cartId, productId);
        return cart;
      } catch (error) {
        throw new Error("Error adding product to cart");
      }
    }

    async deleteProduct(cartId, productId) {
        try {
          const cart = await this.cartDAO.getProductsFromCart(cartId);
          cart.findIndex(product => product.product.toString() === productId);
          await this.cartDAO.deleteProduct(cartId, productId);
        } catch (error) {
          throw error;
        }
    }

    async deleteAllProducts(cartId) {
      try {
        const cart = await this.cartDAO.getProductsFromCart(cartId);
        return cart;
      } catch (error) {
        throw error;
      }
  }

    async updateProduct(cartId) {
      console.log(cartId);
        try {
            const cart = await this.cartDAO.updateProduct(cartId);
            return cart;
        } catch (error) {
            throw new Error("Error updating cart");
        }
    }

    async updateProductById(cartId, productId, quantity) {
      try {
        const cart = await this.cartDAO.getProductsFromCart(cartId);
        return cart;
      } catch (error) {
          throw new Error("Error updating cart: " + error.message);
      }
    }
}

export default CartService;