import express, { Router } from 'express';
import __dirname from '../utils/dirnameUtil.js';
import ProductManager from '../dao/productManagerDB.js';
import { socketServer } from '../app.js';
import UserManager from '../dao/userManagerDB.js';

const myProduct = new ProductManager();
const viewsRouter = Router();
viewsRouter.use(express.json());
const myUsers = new UserManager();

viewsRouter.get('/', async (_req, res) => {
  const products = await myProduct.getProducts();
  res.render('homeView', { title: 'Products', products: products });
});

viewsRouter.get('/realtimeproducts', async (_req, res) => {
  const products = await myProduct.getProducts();
  res.render('realTimeProductsView', { title: 'Products', products: products });
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

viewsRouter.post("/realtimeproducts", async (req, res) => {
  try {
    const response = await myProduct.addProducts(req.body);
    socketServer.emit("productAdded", myProduct.products);

    res.status(201).send(response);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

viewsRouter.delete("/realtimeproducts/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    await myProduct.deleteProduct(parseInt(productId));
    socketServer.emit("productDeleted", productId); 

    res.status(201).send(productId);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default viewsRouter;
