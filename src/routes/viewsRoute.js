import { Router } from 'express';
import __dirname from '../utils/dirnameUtil.js';
import passport from 'passport';
import fetchProducts from '../config/fetchConfig.js';

const viewsRouter = Router();

//Traigo los productos.
viewsRouter.get('/products', fetchProducts, (req, res) => {
  try {
    const { products } = req;
    const isLoggedIn = req.session.user ? true : false;
    const user = isLoggedIn ? req.session.user.user : null;
    const role = isLoggedIn ? req.session.user.role : null;
    res.render('homeView', { title: 'Products Page', products, isLoggedIn, user, role });
  } catch (error) {
    res.status(400).send({
      status: 'error',
      message: error.message
    });
  }
});

//Endpoints de Login Register y Logout.
viewsRouter.get("/login", (req, res) => {
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

viewsRouter.post("/login", passport.authenticate('login', { failureRedirect: '/failLogin' }), fetchProducts, (req, res) => {
  const { user, role } = req.user;
  res.render('homeView', { title: 'Products Page', products: req.products, isLoggedIn: true, user, role });
});

viewsRouter.post("/register", passport.authenticate('register', { failureRedirect: '/failRegister' }), (req, res) => {
  res.render('loginView', { title: 'Login Form', failLogin: req.session.failLogin ?? false })
});

export default viewsRouter;
