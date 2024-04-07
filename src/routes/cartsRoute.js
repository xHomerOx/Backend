import { Router } from "express";
import ProductManager from "../dao/productManagerFS.js";
import CartManager from "../dao/cartManagerFS.js";

const myProduct = new ProductManager('public');
const myCart = new CartManager('public', myProduct);
const cartsRouter = Router();

cartsRouter.get('/', async (_req, res) => {
    const products = await myProduct.getProducts();
    res.render('homeView', { title: 'Products', products: products });
  });

export default cartsRouter;
