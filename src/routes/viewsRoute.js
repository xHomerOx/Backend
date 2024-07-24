import express, { Router } from 'express';
import __dirname from '../utils/dirnameUtil.js';
import ProductManager from '../dao/productManagerDB.js';
import { socketServer } from '../app.js';
import UserManager from '../dao/userManagerDB.js';
import { transport } from '../utils/mailerUtil.js';
import { createHash, isValidPassword } from '../utils/cryptoUtil.js';
import jwt from 'jsonwebtoken';
import roleHelper from '../helpers/roleHelper.js';
import CartManager from '../dao/cartManagerDB.js';

const myProduct = new ProductManager();
const viewsRouter = Router();
viewsRouter.use(express.json());
const myUsers = new UserManager();
const myCart = new CartManager();

viewsRouter.get('/', async (_req, res) => {
  const products = await myProduct.getProducts();
  res.render('homeView', { title: 'Products', products: products });
});

viewsRouter.get('/chatbox', async (_req, res) => {
  res.render('chatView', { title: 'ChatView'});
});

viewsRouter.get('/register', async (_req, res) => {
  res.render('registerView', { title: 'Register' });
});

viewsRouter.post('/register', async (req, res) => {
  try {
    const user = await myUsers.addUser(req.body);
    res.render('registerView', { title: 'Register', user: user });
  } catch (error) {
    if (error.code === 'User already exists') {
      res.status(400).send({
        status: 'error',
        message: 'User already exists'
      });
    }else{
      res.status(500).send('Error adding user');
    }
  }
});

viewsRouter.get('/login', async (_req, res) => {
  res.render('loginView', { title: 'Login' });
});

viewsRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await myUsers.loginUser(email, password);
    
    req.session.user = user;
    res.send({ status: 'success', token: token });
  } catch (error) {
    if (error.code === 'Invalid credentials') {
      res.status(400).send({
        status: 'error',
        message: 'Invalid credentials'
      });
    }else{
      res.status(500).send('Internal Server Error');
    }
  }
});

viewsRouter.get('/logout', async (req, res) => {
  const user = req.session.user;

  req.session.destroy(async error => {
    if (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    } else {
      if (user) {
        await myUsers.logoutUser(user);
      }

      res.render('loginView', { title: 'Login' });
    }
  });
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
  const user = req.session.user; 
  const isAdmin = roleHelper.isAdmin(user);
  const isPremium = roleHelper.isPremium(user);
  const products = await myProduct.getProducts();
  const cart = await myCart.addCart();
  req.session.cartId = cart._id;
  res.render('realTimeProductsView', { title: 'Products', user: user, products: products, cartId: cart._id, isAdmin, isPremium });
});

viewsRouter.post("/realtimeproducts", async (req, res) => {
  try {
    const user = req.session.user;
    const newProduct = await myProduct.addProducts(req.body, user);
    socketServer.emit("productAdded", newProduct);

    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

viewsRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
      const results = await myCart.addProduct(req.params.cid, req.params.pid);
      res.send({
          status: 'success',
          payload: results
      });
  } catch (error) {
      res.status(400).send({
          status: 'error',
          message: error.message
      });
  }
});

viewsRouter.delete("/realtimeproducts/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    await myProduct.deleteProduct(productId);
    socketServer.emit("productDeleted", productId); 

    res.status(201).send(productId);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

viewsRouter.get('/recover', (_req, res) => {
  res.render('recoverView', { title: 'Recover Password' });
});

viewsRouter.get('/recover/:token', async (req, res) => {
  const { token } = req.params;
  
  try {
    const user = await myUsers.getUserByToken(token);

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
    const user = await myUsers.getUserEmail(email);
    
    if (!user) {
      return res.status(404).render('recoverView', { error: 'Email not found' });
    }
    
    const token = jwt.sign(user, "secretKey", { expiresIn: "1h" });
    const link = `http://localhost:8080/products/recover/${token}`;
    
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
    const user = await myUsers.getUserByToken(token);

    if (!user) {
      return res.status(404).json({ error: 'Invalid token' });
    }

    if (isValidPassword(user, newPassword)) {
      return res.status(400).json({ error: 'New password cannot be the same as old password' });
    }
    
    const hashedPassword = createHash(newPassword);
    await myUsers.updatePassword(user._id, hashedPassword);

    res.json({ success: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Token has expired. Please request a new password recovery link.' });
  }
});

export default viewsRouter;
