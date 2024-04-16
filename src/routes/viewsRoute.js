import { Router } from 'express';
import __dirname from '../utils/dirnameUtil.js';
import productModel from '../dao/models/productModel.js';
import { cartModel } from '../dao/models/cartModel.js';

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

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

    const products = await productModel.paginate(query, { page, limit, sort: sortOptions });

    const currentPath = `${req.headers.host}`;
    let prevLink = `${currentPath}/?page=${products.prevPage}`;
    let nextLink = `${currentPath}/?page=${products.nextPage}`;

    if (products.prevPage === null) {
      prevLink = null;
    }

    if (products.nextPage === null) {
      nextLink = null;
    }

    res.json({
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      page: products.page,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

viewsRouter.get('/products', async (req, res) => {
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

    const prevPage = page > 1 ? `/products?page=${page - 1}` : null;
    const nextPage = page < totalPages ? `/products?page=${page + 1}` : null;

    res.render('homeView', { products, page, prevPage, nextPage, cartId });
  } catch (error) {
    res.status(400).send({
          status: 'error',
          message: error.message
    });
  }
});

export default viewsRouter;
