import mongoose from "mongoose";
import config from "../config/config.js";

const Products = async () => {
    switch (config.persistence) {
        case 'MONGO':
            mongoose.connect(process.env.DB_CONNECTION);
            const { default: productMongoDAO } = await import('../dao/mongo/productMongoDAO.js');
            const { default: cartMongoDAO } = await import('../dao/mongo/cartMongoDAO.js');
            return { productDAO: productMongoDAO, cartDAO: cartMongoDAO };
        case 'MEMORY':
            const { default: productMemoryDAO } = await import('../dao/memory/productMemoryDAO.js');
            const { default: cartMemoryDAO } = await import('../dao/memory/cartMemoryDAO.js');
            return { productDAO: productMemoryDAO, cartDAO: cartMemoryDAO };
    }
}

export default Products;