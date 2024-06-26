class CartDao {
    constructor() {
        this.carts = [];
    }

    static getInstance() {
        if (!CartDao.instance) {
          CartDao.instance = new CartDao();
        }
        return CartDao.instance;
    }

    async getCarts() {
        return this.carts;
    }

    async getProductsFromCart(cartId) {
        const cart = this.carts.find((cart) => cart.id === cartId);

        if (!cart) {
          throw new Error(`Cart ${cartId} not found.`);
        }
        return cart.products;
    }

    async addCart() {
        const cart = {
            id: this.carts.length + 1,
            products: [],
        };

        this.carts.push(cart);
        return cart;
    }

    async addProduct(cartId, productId) {
        const cart = this.carts.find((cart) => cart.id === cartId);

        if (!cart) {
          throw new Error(`Cart ${cartId} not found`);
        }

        const foundProduct = cart.products.find((product) => product.id === productId);

        if (foundProduct) {
          foundProduct.quantity++;
        } else {
          cart.products.push({ id: productId, quantity: 1 });
        }

        return "Product successfully added to cart!";
    }

    async deleteProduct(cartId, productId) {
        const cart = this.carts.find((cart) => cart.id === cartId);
        const deleteProduct = cart.products.findIndex((product) => product.id === productId);

        if (deleteProduct >= 0) {
          cart.products.splice(deleteProduct, 1);
          return `Product with ${productId} deleted.`;
        } else {
          return `Product with ${productId} does not exist.`;
        }
    }

    async deleteAllProducts(cartId) {
        const cart = this.carts.find((cart) => cart.id === cartId);

        if (!cart) {
          throw new Error(`Cart ${cartId} not found`);
        }

        cart.products = [];

        return "All Products in Cart successfully deleted!";
    }

    async updateProduct(cartId, quantity) {
        const cart = this.carts.find((cart) => cart.id === cartId);

        if (!cart) {
            throw new Error(`Cart ${cartId} not found`);
        }

        cart.products.forEach((product) => {
          product.quantity = quantity;
        });

        return "Cart successfully updated!";
    }

    async updateProductById(cartId, productId, quantity) {
        const cart = this.carts.find((cart) => cart.id === cartId);
        const myProduct = cart.products.findIndex((product) => product.id === productId);

        if (myProduct >= 0) {
            cart.products[myProduct].quantity = quantity;

            return "Cart successfully updated!";
        } else {
            throw new Error("Product not found in the cart");
        }
    }

    async getStockfromProducts(cartId) {
      const cart = this.carts.find(cart => cart.id === cartId);
      const notProcessed = [];
  
      if (!cart) {
        throw new Error(`Cart ${cartId} not found`);
      }
  
      const removedProducts = [];
  
      for (const cartProduct of cart.products) {
        const product = this.products.find(product => product.id === cartProduct.product);
  
        if (!product) {
          throw new Error(`Product ${cartProduct.product} not found`);
        }
  
        if (product.stock >= cartProduct.quantity) {
          product.stock -= cartProduct.quantity;
        } else {
          notProcessed.push(product.id + ', ');
          removedProducts.push(cartProduct);
        }
      }
  
      cart.products = cart.products.filter(product =>!removedProducts.includes(product));
  
      return { notProcessed };
    }  
}

export default CartDao;