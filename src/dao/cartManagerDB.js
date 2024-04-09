import { cartModel } from "./models/cartModel.js";
import productModel from "./models/productModel.js";

class CartManager {
  async getCarts() {
    try {
      return await cartModel.find();
    } catch (error) {
      throw new Error("Error finding Carts!");
    }
  }

  async getProductsFromCart(cartId) {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      throw new Error(`Cart ${cartId} not found.`);
    }
    return cart.products;
  }

  async addCart() {
    try {
        const cart = new cartModel({
            products: [],
        });

        await cart.save();
        return cart;
    } catch (error) {
        throw new Error("Error creating cart");
    }
  }

  async addProduct(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);

      if (!cart) {
        throw new Error(`Cart ${cartId} not found`);
      }

      const foundProduct = await productModel.findOne({_id: productId});

      if (foundProduct) {
        const existingProduct = cart.products.find((cartProduct) => cartProduct.product === productId);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();

        return "Product successfully added to cart!";
      } else {
        return `Product with ID ${productId} not found`;
      }
    } catch (error) {
        console.log(error);
        throw new Error("Error adding product to cart");
    }
  }
}

export default CartManager;
