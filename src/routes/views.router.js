import { Router } from 'express';
import __dirname from '../utils.js';
import { products } from './carts.router.js';

const viewsRouter = Router();

viewsRouter.get('/', (_req, res) => {
  res.render('realTimeProducts', { title: 'Products', products });
});

//Exporto ambos ya que tengo el Index en public.
export default viewsRouter;
