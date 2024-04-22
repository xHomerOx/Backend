import { Router } from 'express';
import __dirname from '../utils/dirnameUtil.js';
import productModel from '../models/productModel.js';

const viewsRouter = Router();

viewsRouter.get('/products', async (req, res) => {
  try {
    const query = {}

    const products = await productModel.find(query).lean();
    const isLoggedIn = req.session.user ? true : false;
    const user = isLoggedIn ? req.session.user.user : null;

    res.render('home', { title: 'Products Page', products, isLoggedIn, user });
  } catch (error) {
    res.status(400).send({
          status: 'error',
          message: error.message
    });
  }
});

viewsRouter.get("/login", (req, res) => {
  res.render('login', { title: 'Login Form', failLogin: req.session.failLogin ?? false })
});

viewsRouter.get("/register", (req, res) => {
  res.render('register', { title: 'Register Form', failLogin: req.session.failRegister ?? false })
});

export default viewsRouter;
