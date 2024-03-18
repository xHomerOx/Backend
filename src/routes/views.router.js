import { Router } from 'express';
import __dirname from '../utils.js';

//Me traigo solo el Objeto Products.
import { products } from './carts.router.js';

const viewsRouter = Router();

viewsRouter.get('/', (_req, res) => {
  res.render('realTimeProducts', { title: 'Products', products });
});

export default viewsRouter;
