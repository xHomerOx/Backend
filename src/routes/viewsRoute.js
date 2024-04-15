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
  const status = req.query.status;
  const category = req.query.category;

  const query = {};

  if (title) {
    query.$or = query.$or || [];
    query.$or.push({ title: { $eq: title } });
  }

  if (description) {
    query.$or = query.$or || [];
    query.$or.push({ description: { $eq: description } });
  }

  if (price) {
    query.$or = query.$or || [];
    query.$or.push({ price: { $eq: price } });
  }

  if (code) {
    query.$or = query.$or || [];
    query.$or.push({ code: { $eq: code } });
  }

  if (stock) {
    query.$or = query.$or || [];
    query.$or.push({ stock: { $eq: stock } });
  }

  if (thumbnail) {
    query.$or = query.$or || [];
    query.$or.push({ thumbnail: { $eq: thumbnail } });
  }

  if (status) {
    query.$or = query.$or || [];
    query.$or.push({ status: { $eq: status } });
  }

  if (category) {
    query.$or = query.$or || [];
    query.$or.push({ category: { $eq: category } });
  }

  let sortOptions = {};

  const sortOrder = req.query.sort === 'desc' ? -1 : 1;
  sortOptions = { price: sortOrder };

  const products = await productModel.find(query, null, { limit, skip }).sort(sortOptions).lean();

  const totalProducts = await productModel.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / limit);
  
  try {
    res.json({
      status: "success",
      payload: products,
      totalPages: totalPages,
      page: page
    }); 
  } catch (error) {
    res.json({
      status: "error",
      error: error.message
    });
  }
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
