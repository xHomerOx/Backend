import { Router } from "express";
import ProductManager from "../dao/productManager.js";
import CartManager from "../dao/cartManager.js";
import { cartModel } from "../dao/models/cartModel.js";

const myProduct = new ProductManager();
const myCart = new CartManager();
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

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
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
});

cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;     
        const results = await cartModel.findById(cartId).populate('products.product');
        
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