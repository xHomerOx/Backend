import { Router } from 'express';
import __dirname from '../utils/dirnameUtil.js';
import productModel from '../models/productModel.js';

const viewsRouter = Router();

viewsRouter.get('/products', async (_req, res) => {
  try {
    const query = {}

    const products = await productModel.find(query).lean();

    res.render('home', { products });
  } catch (error) {
    res.status(400).send({
          status: 'error',
          message: error.message
    });
  }
});

viewsRouter.get("/login", (req, res) => {
  res.render('login',{ title: 'Login Form', failLogin: req.session.failLogin ?? false})
});

export default viewsRouter;
