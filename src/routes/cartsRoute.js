import { Router } from "express";
import CartController from "../controllers/cartController.js";

const cartsRouter = Router();
const cartService = new CartController();

cartsRouter.get('/', async (_req, res) => {
    const carts = await cartService.getCarts();
    res.send(carts);
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const results = await cartService.getProductsFromCart(req.params.cid);

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
        const results = await cartService.addCart();
        
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
        const results = await cartService.addProduct(req.params.cid, req.params.pid);
        
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
        const results = await cartService.deleteProduct(req.params.cid, req.params.pid);

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
        const updatedProducts = req.body.products;

        const results = await cartService.updateProduct(cartId, updatedProducts);

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
        
        const results = await cartService.updateProductById(cartId, productId, quantity);
        
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
        const results = await cartService.deleteAllProducts(req.params.cid);

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

export default cartsRouter;