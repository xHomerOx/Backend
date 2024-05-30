import mongoose from "mongoose";
import config from "../config/config.js";

const Products = async () => {
    switch (config.persistence) {
        case 'MONGO':
            mongoose.connect(process.env.DB_CONNECTION);
            const { default: productMongoDAO } = await import('../dao/mongo/productMongoDAO.js');
            return productMongoDAO;
        case 'MEMORY':
            const { default: productMemoryDAO } = await import('../dao/memory/productMemoryDAO.js');
            return productMemoryDAO;
    }
}

export default Products;