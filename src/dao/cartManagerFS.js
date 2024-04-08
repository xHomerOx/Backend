import fs from 'fs';

class CartManager {
    constructor(path, productManager) {
        this.path = path;
        this.productManager = productManager;
    };

    getCarts = async () => {
        try {
            let carts;
            let myFile = await fs.promises.readFile(`${this.path}/carts.json`, 'utf8');
            carts = JSON.parse(myFile);
            if (!myFile) {
                carts = [];
                await fs.promises.writeFile(`${this.path}/carts.json`, JSON.stringify(carts, null, '\t'));
            }
        }catch(error) {
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

        let id = this.carts.length + 1;

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
        await this.productManager.getProductById(productId);

        let carts = [];

        if (carts.length > 0) {
            productCheck = false;
            for (let key in carts[cartId].products) {
                if (carts[cartId].products[key].product == productId) {
                    productCheck = true;
                    carts[cartId].products[key].quantity++;
                }
            }

            if (productCheck) {
                productCheck.quantity++;
            } else {
                carts.products.push({ product: productId, quantity: 1 });
            }
        } else {
            throw new Error(`Cart ${cartId} does not exist!`);
        }

        try {
            await fs.promises.writeFile(`${this.path}/carts.json`, JSON.stringify(carts, null, '\t'));
            
            return res.status(201).send({ message: "Product successfully created in cart!" });
        } catch (error) {
            return res.status(500).send('Could not add product to cart.');
        }
    }
}

export default CartManager;