import { Router } from 'express';
import __dirname from '../utils/dirnameUtil.js';
import productModel from '../models/productModel.js';
import { cartModel } from '../models/cartModel.js';
import passport from 'passport';
import { auth } from '../middlewares/auth.js';
import { isAdmin, isLoggedIn } from '../middlewares/guard.js';
import { generateProducts } from "../utils/mockUtil.js";
import { userService } from '../repositories/index.js';
import UserController from '../controllers/userController.js';
import jwt from 'jsonwebtoken';
import { transport } from '../utils/mailerUtil.js';
import { createHash, isValidPassword } from '../utils/cryptoUtil.js';

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
    res.redirect('/')
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

viewsRouter.get('/recover', (_req, res) => {
    res.render('recoverView', { title: 'Recover Password' });
});

viewsRouter.get('/recover/:token', async (req, res) => {
    const { token } = req.params;
  
    try {
      const user = await myUser.getUserByToken(token);
      
      if (!user) {
        return res.status(404).render('recoverView', { error: 'Invalid token' });
      }

      res.render('changePasswordView', { user, token });
    } catch (error) {
      res.status(500).render('recoverView', { error: 'Token has expired. Please request a new password recovery link.', token });
    }
});

viewsRouter.post('/recover', async (req, res) => {
    const { email } = req.body;
    
    try {
      const user = await myUser.getUserEmail(email);

      if (!user) {
        return res.status(404).render('recoverView', { error: 'Email not found' });
      }
      
      const token = jwt.sign(user, "secretKey", { expiresIn: "1h" });
      const link = `http://localhost:8080/recover/${token}`;
      
      const mailOptions = {
        from: 'Node Products <homero.tw@gmail.com>',
        to: email,
        subject: 'Password Recovery',
        text: `Click on this link to recover your password: ${link}`,
        html: `<p>Click on this link to recover your password: <a href="${link}">${link}</a></p>`
      };

      transport.sendMail(mailOptions, (error) => {
        if (error) {
          return res.status(500).json({ error: 'Error sending email' });
        }

        res.json({ success: 'Check your email for password recovery instructions' });
      });
    } catch (error) {
      res.status(500).json({ error: 'Error recovering password' });
    }
});

viewsRouter.post('/changePassword', async (req, res) => {
    const { token } = req.body;
    const { newPassword } = req.body;

    try {
      const user = await myUser.getUserByToken(token);

      if (!user) {
        return res.status(404).json({ error: 'Invalid token' });
      }

      if (isValidPassword(user, newPassword)) {
        return res.status(400).json({ error: 'New password cannot be the same as old password' });
      }
      
      const hashedPassword = createHash(newPassword);
      await myUser.updatePassword(user._id, hashedPassword);

      res.json({ success: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Token has expired. Please request a new password recovery link.' });
    }
});

viewsRouter.get('/switcher', isAdmin, async (req, res) => {
    const { user, role } = req.user;
    const roles = ['user', 'premium'];
    const result = await myUser.getUsers();
    const users = result.payload;

    for (let userList of users) {
        userList.roles = roles;
    }

    const isLoggedIn = req.user ? true : false;
    const isAdmin = req.user && req.user.role === 'admin' ? true : false;

    if (role === 'admin') {
        res.render('switchRoleView', { title: 'Role Switcher', user: user,  role: role, users: users, roles: roles, isAdmin, isLoggedIn });
    } else {
        res.status(401).json({ 
            error: 'Unauthorized', 
            message: 'You do not have permission to access this page.' 
        });
    }
});

viewsRouter.put('/switcher/:uid', async (req, res) => {
    const uid = req.params.uid;
    const newRole = req.body.role;
    const documents = [];

    try {
      await myUser.updateRole(uid, newRole, documents);
      res.status(200).send("Role updated successfully!");
    } catch (error) {
      res.status(500).send("Error updating role!");
    }
});

export default viewsRouter;
