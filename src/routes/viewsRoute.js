import { Router } from 'express';
import __dirname from '../utils/dirnameUtil.js';
import ProductManager from '../dao/productManager.js';
import { socketServer } from '../app.js';
import productModel from '../dao/models/productModel.js';

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const title = req.query.title;
  const description = req.query.description;
  const price = req.query.price;
  const code = req.query.code;
  const stock = req.query.stock;
  const thumbnail = req.query.thumbnail;

  const query = {
    $or: [
      { title: { $eq: title } },
      { description: { $eq: description } },
      { price: { $eq: price } },
      { code: { $eq: code } },
      { stock: { $eq: stock } },
      { thumbnail: { $eq: thumbnail } }
    ]
  };

  const products = await productModel.find(query, null, { limit, skip }).lean();

  res.render('homeView', { title: 'Products', products });
});

viewsRouter.get('/', async (_req, res) => {
  const products = await myProducts.getProducts();
  res.render('realTimeProductsView', { title: 'Products', products });
});

viewsRouter.post("/", async (req, res) => {
  try {
    const response = await myProducts.addProducts(req.body);
    socketServer.emit("productAdded", myProducts.products);

    res.status(201).send(response);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

viewsRouter.delete("/:id", async (req, res) => {
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
