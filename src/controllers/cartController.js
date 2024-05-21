import CartService from "../service/cartService.js";

const myCart = new CartService();

class CartController {
    constructor() {}

    async getProducts(_req, res) {
        const carts = await myCart.getCarts();
        res.send(carts);
    };
    
    async getProductsFromCart(req, res) {
        try {
            const results = await cartModel.findById(req.params.cid).populate("products.product");
    
            res.send({
                status: 'success',
                payload: results
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async addCart(_req, res) {
        try {
            const results = await myCart.addCart();
            
            res.send({
                status: 'success',
                payload: results
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async addProduct(req, res) {
        try {
            const results = await myCart.addProduct(req.params.cid, req.params.pid);
    
            res.send({
                status: 'success',
                payload: results
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async deleteProduct(req, res) {
        try {
            const results = await myCart.deleteProduct(req.params.cid, req.params.pid);
    
            res.send({
                status: 'success',
                payload: results
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async updateProduct(req, res) {
        try {
            const cartId = req.params.cid;
            const updatedProducts = req.body.products;
    
            const results = await myCart.updateProduct(cartId, updatedProducts);
    
            res.send({
                status: 'success',
                payload: results
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async updateProductById(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity;
            
            const results = await myCart.updateProductById(cartId, productId, quantity);
            
            res.send({
                status: 'success',
                payload: results
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
    
    async deleteAllProducts(req, res) {
        try {
            const results = await myCart.deleteAllProducts(req.params.cid);
    
            res.send({
                status: 'success',
                payload: results
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    };
}

export default CartController;
