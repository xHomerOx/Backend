import express, { Router } from 'express';
import __dirname from '../utils/utils.js';
import ProductManager from '../dao/productManagerFS.js';

const myProduct = new ProductManager('public');
const viewsRouter = Router();
viewsRouter.use(express.json());

viewsRouter.get('/', async (_req, res) => {
  const products = await myProduct.getProducts();
  res.render('homeView', { title: 'Products', products: products });
});

viewsRouter.get('/realtimeproducts', async (_req, res) => {
  const products = await myProduct.getProducts();
  res.render('realTimeProductsView', { title: 'Products', products: products });
});

export default viewsRouter;
