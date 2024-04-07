import { Router } from "express";
import ProductManager from "../dao/productManagerFS.js";

const myProduct = new ProductManager('public');
const cartsRouter = Router();

cartsRouter.get('/', async (req, res) => {
    const products = await myProduct.getProducts();
    res.render('homeView', { title: 'Products', products: products });
  });

export default cartsRouter;
