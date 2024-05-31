import mongoose from "mongoose";
import config from "../config/config.js";
import ProductMongoDAO from "../dao/mongo/productMongoDAO.js";
import CartMongoDAO from "../dao/mongo/cartMongoDAO.js";
import ProductMemoryDAO from "../dao/memory/productMemoryDAO.js";
import CartMemoryDAO from "../dao/memory/cartMemoryDAO.js";

const Products = async () => {
    switch (config.persistence) {
        case 'MONGO':
            mongoose.connect(process.env.DB_CONNECTION);
            return { productDAO: new ProductMongoDAO(), cartDAO: new CartMongoDAO() };
        case 'MEMORY':
            return { productDAO: new ProductMemoryDAO(), cartDAO: new CartMemoryDAO() };
    }
}

export default Products;
