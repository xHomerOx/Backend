import express, { Router } from 'express';
import __dirname from '../utils/dirnameUtil.js';
import ProductManager from '../dao/productManager.js';
import { socketServer } from '../app.js';

const myProduct = new ProductManager();
const viewsRouter = Router();
viewsRouter.use(express.json());

viewsRouter.get('/', async (_req, res) => {
  const products = await myProduct.getProducts();
  res.render('homeView', { title: 'Products', products: products });
});

viewsRouter.get('/', async (_req, res) => {
  const products = await myProduct.getProducts();
  res.render('realTimeProductsView', { title: 'Products', products: products });
});

viewsRouter.post("/", async (req, res) => {
  try {
    const response = await myProduct.addProducts(req.body);
    socketServer.emit("productAdded", myProduct.products);

    res.status(201).send(response);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

viewsRouter.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    await myProduct.deleteProduct(parseInt(productId));
    socketServer.emit("productDeleted", productId); 

    res.status(201).send(productId);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default viewsRouter;
