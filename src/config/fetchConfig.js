import productModel from '../models/productModel.js';

const fetchProducts = async (req, res, next) => {
    try {
      const products = await productModel.find().lean();
      req.products = products;
      next();
    } catch (error) {
      res.status(400).send({
        status: 'error',
        message: error.message
      });
    }
  };

  export default fetchProducts;