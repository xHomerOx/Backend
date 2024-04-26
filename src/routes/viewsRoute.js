import { Router } from 'express';
import __dirname from '../utils/utils.js';
import productModel from '../models/productModel.js';

const viewsRouter = Router();

//Traigo los productos.
viewsRouter.get('/products', async (req, res) => {
  try {
    const products = await productModel.find().lean();

    //Chequeo si está logueado.
    const isLoggedIn = req.session.user ? true : false;
    
    //Assigno user y rol si existe.
    const user = isLoggedIn ? req.session.user.user : null;
    const role = isLoggedIn ? req.session.user.role : null;
    
    res.render('home', { title: 'Products Page', products, isLoggedIn, user, role });
  } catch (error) {
    res.status(400).send({
          status: 'error',
          message: error.message
    });
  }
});

//Endpoints de Login Register y Logout.
viewsRouter.get("/login", (req, res) => {
  res.render('login', { title: 'Login Form', failLogin: req.session.failLogin ?? false })
});

viewsRouter.get("/register", (req, res) => {
  res.render('register', { title: 'Register Form', failRegister: req.session.failRegister ?? false })
});

viewsRouter.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return console.log(error);
    }
    return res.redirect("/login");
  });
});

export default viewsRouter;
