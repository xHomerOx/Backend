import { cartModel } from "../models/cartModel.js";
import productModel from "../models/productModel.js";

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
        const existingProduct = cart.products.findIndex((cartProduct) => cartProduct.product.equals(productId));
        
        if (existingProduct >= 0) {
          cart.products[existingProduct].quantity++;
        } else {
          cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();

        return "Product successfully added to cart!";
      } else {
        return `Product with ID ${productId} not found`;
      }
    } catch (error) {
        console.log(error)
        throw new Error("Error adding product to cart");
    }
  }

  async deleteProduct(cartId, productId) {
      try {
        const cart = await cartModel.findById(cartId);

        const deleteProduct = cart.products.findIndex(product => product.product.toString() === productId);
        
        if (deleteProduct >= 0) {
          cart.products.splice(deleteProduct, 1);

          await cart.save();
          
          return `Product with ${productId} deleted.`;
        } else {
          return `Product with ${productId} does not exist.`;
        }
      } catch (error) {
        throw error;
      }
  }

  async deleteAllProducts(cartId) {
    try {
      const cart = await cartModel.findById(cartId);
      
      if (!cart) {
        throw new Error(`Cart ${cartId} not found`);
      }

      cart.products = [];

      await cart.save();

      return "All Products in Cart successfully deleted!";
    } catch (error) {
      throw error;
    }
}

  async updateProduct(cartId, updatedProducts) {
      try {
          const cart = await cartModel.findById(cartId);

          if (!cart) {
              throw new Error(`Cart ${cartId} not found`);
          }

          cart.products = updatedProducts;

          await cart.save();

          return "Cart successfully updated!";
      } catch (error) {
          throw new Error("Error updating cart");
      }
  }

  async updateProductById(cartId, productId, quantity) {
    try {
        const cart = await cartModel.findById(cartId);
        const myProduct = cart.products.findIndex(product => product.product == productId);
        
        if (myProduct >= 0) {
            cart.products[myProduct].quantity = quantity;

            await cart.save();

            return "Cart successfully updated!";
        } else {
            throw new Error("Product not found in the cart");
        }
    } catch (error) {
        throw new Error("Error updating cart: " + error.message);
    }
  }
}


export default CartManager;
