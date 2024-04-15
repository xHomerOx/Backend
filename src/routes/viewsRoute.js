import { Router } from 'express';
import __dirname from '../utils/dirnameUtil.js';
import productModel from '../dao/models/productModel.js';

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
  try {
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

    const prev = page > 1 ? page - 1 : null;
    const next = page < totalPages ? page + 1 : null;

    let hasPrev, hasNext;
    if (prev === null) hasPrev = false; else hasPrev = true;
    if (next === null) hasNext = false; else hasNext = true;

    const currentPath = `${req.headers.host}`;
    let prevURI = `${currentPath}/?page=${prev}`;
    let nextURI = `${currentPath}/?page=${next}`;

    if (hasPrev === false) prevURI = null;
    if (hasNext === false) nextURI = null;

    if (page > totalPages) {
      throw new Error("Page does not exist");
    }
  
    res.json({
      status: "success",
      payload: products,
      totalPages: totalPages,
      page: page,
      prevPage: prev,
      nextPage: next,
      hasPrevPage: hasPrev,
      hasNextPage: hasNext,
      prevLink: prevURI,
      nextLink: nextURI
    }); 
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});