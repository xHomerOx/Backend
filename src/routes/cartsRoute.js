import { Router } from "express";
import ProductManager from "../dao/productManagerDB.js";
import CartManager from "../dao/cartManagerDB.js";

const myProduct = new ProductManager('public');
const myCart = new CartManager('public', myProduct);
const cartsRouter = Router();

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

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
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
});

export default cartsRouter;