import mongoose from "mongoose";
import config from "../config/config.js";
import ProductMongoDAO from "../dao/mongo/productMongoDAO.js";
import CartMongoDAO from "../dao/mongo/cartMongoDAO.js";
import UserMongoDAO from "../dao/mongo/userMongoDAO.js"
import ProductMemoryDAO from "../dao/memory/productMemoryDAO.js";
import CartMemoryDAO from "../dao/memory/cartMemoryDAO.js";
import UserMemoryDAO from "../dao/memory/userMemoryDAO.js"

const Products = async () => {
    switch (config.persistence) {
        case 'MONGO':
            mongoose.connect(process.env.DB_CONNECTION);
            return { productDAO: new ProductMongoDAO(), cartDAO: new CartMongoDAO(), userDAO: new UserMongoDAO() };
        case 'MEMORY':
            return { productDAO: new ProductMemoryDAO(), cartDAO: new CartMemoryDAO(), userDAO: new UserMemoryDAO() };
    }
}

export default Products;