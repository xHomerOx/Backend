import { Router } from "express";
import CartController from "../controllers/cartController.js";
import { cartService } from "../repositories/index.js";

const cartsRouter = Router();
const myCart = new CartController(cartService);

cartsRouter.get('/', async (_req, res) => {
    const carts = await myCart.getCarts();
    res.send(carts);
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const results = await myCart.getProductsFromCart(req.params.cid);
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
});

cartsRouter.post('/', async (_req, res) => {
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
});

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    try {
        const results = await myCart.addProduct(req.params.cid, req.params.pid);
        
        res.send({
            status: 'success',
            payload: results
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
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
})

cartsRouter.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const quantity = req.body.quantity;

        const results = await myCart.updateProduct(cartId, quantity);

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
});

cartsRouter.put('/:cid/products/:pid', async (req, res) => {
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
});

cartsRouter.delete('/:cid', async (req, res) => {
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
})

cartsRouter.post('/:cid/purchase', async (req, res) => {
    try {
        const results = await myCart.getStockfromProducts(req.params.cid);

        res.send({
            status: 'success',
            payload: results
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

export default cartsRouter;