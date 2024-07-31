import { Router } from 'express';
import __dirname from '../utils/dirnameUtil.js';
import productModel from '../models/productModel.js';
import { cartModel } from '../models/cartModel.js';
import userModel from '../models/userModel.js';
import passport from 'passport';
import { auth } from '../middlewares/auth.js';
import { isLoggedIn } from '../middlewares/guard.js';
import { generateProducts } from "../utils/mockUtil.js";
import { userService } from '../repositories/index.js';
import UserController from '../controllers/userController.js';

const viewsRouter = Router();
const myUser = new UserController(userService);

viewsRouter.get('/', auth, async (req, res) => {
  try {

    const { user, role, cart } = req.user || {};
    const cartId = cart ? cart._id : null;

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

    products.forEach(product => {
      product.status = product.status ? "Available" : "Not Available";
    });
    
    const prevPage = page > 1 ? `?page=${page - 1}` : null;
    const nextPage = page < totalPages ? `?page=${page + 1}` : null;

    const isLoggedIn = req.user ? true : false;
    const isAdmin = req.user && req.user.role === 'admin' ? true : false;

    res.render('homeView', { products, page, prevPage, nextPage, cartId, isLoggedIn, isAdmin, user, role });
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
  res.render('loginView', { title: 'Login Form', failLogin: req.session.failLogin ?? false })
});

viewsRouter.get("/failLogin", (req, res) => {
  req.logger.warning("Login Failed");
  res.render('failLoginView', { title: 'Login Failed' })
});

viewsRouter.get("/register", (req, res) => {
  res.render('registerView', { title: 'Register Form', failRegister: req.session.failRegister ?? false })
});

viewsRouter.get("/failRegister", (req, res) => {
  req.logger.warning("Register Failed");
  res.render('failRegisterView', { title: 'Registration Failed' })
});

viewsRouter.get("/logout", async (req, res) => {
  try {
      await myUser.logoutUser(req.user);

      req.session.destroy((error) => {
          if (error) {
            req.logger.error(error);
          }
      });

      res.redirect("/login");
    } catch (error) {
      req.logger.error(error);
      res.redirect("/login");
    }
});

viewsRouter.post("/login", passport.authenticate('login', { failureRedirect: '/failLogin' }), async (req, res) => {
  const user = req.body.user;
  const password = req.body.password;

  try {
    const result = await myUser.loginUser(user, password);
    req.user = result.user;
    req.role = result.role;
    res.render('homeView', { title: 'Products Page', products: req.products, isLoggedIn: true, user: req.user, role: req.role });
  } catch (error) {
    res.redirect('/failLogin');
  }
});

viewsRouter.post("/register", passport.authenticate('register', { failureRedirect: '/failRegister' }), (req, res) => {
  res.render('loginView', { title: 'Login Form', failLogin: req.session.failLogin ?? false });
});

viewsRouter.get('/api/sessions/github'), passport.authenticate('github', {scope: ['user: user']}, async (_req, _res) => {});

viewsRouter.get('/api/sessions/github', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

viewsRouter.get('/chatbox', isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    res.render('chatView', { title: 'ChatView', user: user.user });
  } catch (error) {
    req.logger.error(`Error rendering chat: ${error.message}`);
    res.status(400).send({
      status: 'error',
      message: error.message
    });
  }
});

viewsRouter.get("/mockingproducts", async (_req, res) => {
  let products = [];

  for (let i = 0; i < 30; i++) {
    products.push(generateProducts());
  }

  await productModel.insertMany(products);
  
  res.render('mockingView', { title: 'Mocking Products', products });
});

viewsRouter.get("/loggerTest", (req, res) => {
  req.logger.fatal("Logger test fatal message");
  req.logger.error("Logger test error message");
  req.logger.warning("Logger test warning message");
  req.logger.info("Logger test info message");
  req.logger.http("Logger test http message");
  req.logger.debug("Logger test debug message");

  res.send("Logger test completed!"); 
});

export default viewsRouter;
