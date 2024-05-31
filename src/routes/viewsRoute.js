import { Router } from 'express';
import __dirname from '../utils/dirnameUtil.js';
import productModel from '../models/productModel.js';
import { cartModel } from '../models/cartModel.js';
import passport from 'passport';

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
  try {

    const myCart = await cartModel.findOne();
    const cartId = myCart ? myCart._id : null;

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const query = {};

    const totalProducts = await productModel.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);
    const skip = (page - 1) * limit;
    const sortOrder = req.query.sort === 'desc' ? -1 : 1;
    
    let sortOptions = {};
    sortOptions = { price: sortOrder };

    const products = await productModel.find(query).skip(skip).limit(limit).sort(sortOptions).lean();

    const prevPage = page > 1 ? `?page=${page - 1}` : null;
    const nextPage = page < totalPages ? `?page=${page + 1}` : null;

    res.render('homeView', { products, page, prevPage, nextPage, cartId });
  } catch (error) {
    res.status(400).send({
          status: 'error',
          message: error.message
    });
  }
});

viewsRouter.get('/carts/:cid', async (req, res) => {
  try {

    const cartId = req.params.cid;

    const myCart = await cartModel.findById(cartId).lean().populate('products.product');

    if (!myCart) {
      return res.status(404).send({ message: 'Carrito no encontrado' });
    }

    res.render('cartView', { cartProducts: myCart.products, cartId });

  } catch (error) {
    res.status(400).send({
          status: 'error',
          message: error.message
    });
  }
});

viewsRouter.get("/login", (req, res) => {
  console.log(req.session)
  res.render('loginView', { title: 'Login Form', failLogin: req.session.failLogin ?? false })
});

viewsRouter.get("/failLogin", (_req, res) => {
  res.render('failLoginView', { title: 'Login Failed' })
});

viewsRouter.get("/register", (req, res) => {
  res.render('registerView', { title: 'Register Form', failRegister: req.session.failRegister ?? false })
});

viewsRouter.get("/failRegister", (_req, res) => {
  res.render('failRegisterView', { title: 'Registration Failed' })
});

viewsRouter.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return console.log(error);
    }
    return res.redirect("/login");
  });
});

viewsRouter.post("/login", passport.authenticate('login', { failureRedirect: '/failLogin', successRedirect: '/products' }), (req, res) => {
  const user = req.user;
  const role = req.user.role;
  res.render('homeView', { title: 'Products Page', products: req.products, isLoggedIn: true, user: user, role: role });
});

viewsRouter.post("/register", passport.authenticate('register', { failureRedirect: '/failRegister' }), (req, res) => {
  res.render('loginView', { title: 'Login Form', failLogin: req.session.failLogin ?? false });
});

export default viewsRouter;
