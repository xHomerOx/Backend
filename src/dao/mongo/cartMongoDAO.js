import { cartModel } from "../../models/cartModel.js";
import productModel from "../../models/productModel.js";

class CartDao {
    constructor() {}

    static getInstance() {
        if (!CartDao.instance) {
            CartDao.instance = new CartDao();
            CartDao.instance.cartModel = new cartModel();
        }
        return CartDao.instance;
    }

    async getCarts() {
        return await cartModel.find().lean();
    }

    async getProductsFromCart(cartId) {
        const cart = await cartModel.findById(cartId).populate({
          path: 'products.product',
          select: 'price stock title status'
        });
        
        if (!cart) {
          throw new Error(`Cart ${cartId} not found.`);
        }
        
        return {
          id: cart._id,
          products: cart.products.map((cartProduct) => ({
            product: cartProduct.product,
            quantity: cartProduct.quantity,
          })),
        };
    }

    async addCart() {
        const cart = new cartModel({
            products: [],
        });

        await cart.save();
        return cart;
    }

    async addProduct(cartId, productId) {
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
    }

    async deleteProduct(cartId, productId) {
      const cart = await cartModel.findById(cartId);
      
      const deleteProduct = cart.products.findIndex(product => product.product.toString() === productId);
      
      if (deleteProduct >= 0) {
          const productInCart = cart.products[deleteProduct];
          
          if (productInCart.quantity > 1) {
              productInCart.quantity -= 1;
          } else {
              cart.products.splice(deleteProduct, 1);
          }

          await cart.save();
          return `Product with ${productId} deleted.`;
      } else {
          return `Product with ${productId} does not exist.`;
      }   
  }  

    async deleteAllProducts(cartId) {
        const cart = await cartModel.findById(cartId);
          
        if (!cart) {
          throw new Error(`Cart ${cartId} not found`);
        }
  
        cart.products = [];
  
        await cart.save();
        return "All Products in Cart successfully deleted!";
    }

    async updateProduct(cartId, quantity) {
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            throw new Error(`Cart ${cartId} not found`);
        }

        cart.products.forEach(product => {
          product.quantity = quantity;
        });

        await cart.save();
        return "Cart successfully updated!";     
    }

    async updateProductById(cartId, productId, quantity) {
        const cart = await cartModel.findById(cartId);
        const myProduct = cart.products.findIndex(product => product.product == productId);

        if (myProduct >= 0) {
            cart.products[myProduct].quantity = quantity;
    
            await cart.save();
            return "Cart successfully updated!";
        } else {
            throw new Error("Product not found in the cart");
        }
    }

    async getStockfromProducts(cartId) {
      const cart = await cartModel.findById(cartId).populate({
        path: 'products.product',
        select: 'title'
      });

      const notProcessed = [];

      if (!cart) {
        throw new Error(`Cart ${cartId} not found`);
      }

      const removedProducts = [];

      for (const cartProduct of cart.products) {
          const product = await productModel.findById(cartProduct.product);
      
          if (!product) {
            throw new Error(`Product ${cartProduct.product} not found`);
          }
          
          if (product.stock >= cartProduct.quantity) {
            product.stock -= cartProduct.quantity;
            
            if (product.stock === 0) {
              product.status = false;
              product.price = 0;
            }
          }else{
            notProcessed.push(product);
            removedProducts.push(cartProduct);
          }

          await product.save();
      }

      cart.products = cart.products.filter(product => removedProducts.includes(product));
      await cart.save();

      return notProcessed;
    }
}

export default CartDao;