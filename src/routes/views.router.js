import express, { Router } from 'express';
import __dirname from '../utils.js';
import { socketServer } from '../app.js';

//Me traigo solo el Objeto Products.
import { products } from './carts.router.js';
import ProductManager from '../productManager.js';

const myProduct = new ProductManager();
const viewsRouter = Router();
viewsRouter.use(express.json());

viewsRouter.get('/', (_req, res) => {
  res.render('realTimeProducts', { title: 'Products', products });
});

viewsRouter.post("/", async (req, res) => {
  const response = await myProduct.addProducts(req.body);
  socketServer.emit(response);

  res.status(201).send(response);
});


export default viewsRouter;
