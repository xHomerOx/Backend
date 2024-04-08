import fs from 'fs';

class CartManager {
    constructor(path, productManager) {
        this.path = path;
        this.productManager = productManager;
    };

    getCarts = async () => {
        try {
          let myFile = await fs.promises.readFile(`${this.path}/carts.json`, 'utf8');

          if (!myFile) {
            carts = [];
            await fs.promises.writeFile(`${this.path}/carts.json`, JSON.stringify(carts, null, '\t'));
          }

          return JSON.parse(myFile);
        } catch (error) {
          throw error;
        }
    }

    getProductsFromCart = async (cartId) => {
        const carts = await this.getCarts();
        const myCart = carts.find(cart => cart.id === cartId);

        if (myCart.length > 0) {
            return myCart[0].products;
        }

        throw new Error(`${cartId} does not exist!`);
    }

    addCart = async () => {
        const carts = await this.getCarts();

        let id = carts.length + 1;

        const newCart = {
            id: id,
            products: []
        }

        carts.push(newCart);

        try {
            await fs.promises.writeFile(`${this.path}/carts.json`, JSON.stringify(carts, null, '\t'));
            return newCart;
        } catch (error) {
            throw error;
        }
    }

    getCartID = async (carts) => {
        if (carts.length > 0) {
            return parseInt(carts[carts.length - 1].id) + 1;
        }

        return 1;
    }

    addProduct = async (cartId, productId) => {
        try {
            const carts = await this.getCarts();
            await this.productManager.getProductById(productId);

            console.log(productId);
            
            if (carts.length > 0) {
                if (!carts[cartId - 1]) {
                    throw new Error(`Cart ${cartId} does not exist!`);
                }

                let productCheck = false;
                for (const existingProduct of carts[cartId - 1].products) {
                    if (existingProduct.product === productId) {
                        productCheck = true;
                        existingProduct.quantity++;
                        break;
                    }
                }
        
                if (!productCheck) {
                    carts[cartId - 1].products.push({ product: productId, quantity: 1 });
                }

                await fs.promises.writeFile(`${this.path}/carts.json`, JSON.stringify(carts, null, '\t'));
        
                return ("Product successfully created in cart!");
            } else {
                throw new Error('No carts found in the system.');
            }
        } catch (error) {
            throw error;
        }
    }      
}

export default CartManager;