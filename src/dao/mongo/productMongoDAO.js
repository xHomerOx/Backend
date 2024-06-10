import productModel from "../../models/productModel.js";
import CustomError from "../../services/errors/CustomError.js";
import EErrors from "../../services/errors/enums.js";
import { generateProductsErrorInfo } from "../../services/errors/info.js";

class ProductDao {
    constructor() {}

    static getInstance() {
        if (!ProductDao.instance) {
            ProductDao.instance = new ProductDao();
            ProductDao.instance.productModel = new productModel();
        }
        return ProductDao.instance;
    }

    async getProducts() {
        return await productModel.find().lean();
    }

    async getProductById(pid) {
        const product = await productModel.findOne({_id: pid});

        if (!product) throw new Error(`Product ${pid} does not exist!`);

        return product;
    }

    async addProducts(product) {
        const {title, description, code, price, stock, category, thumbnail} = product;
        const existingProduct = await productModel.findOne({ code });

        if (existingProduct) {
            CustomError.createError({
                name: "Product creation error.",
                cause: generateProductsErrorInfo({code}),
                message: "Couldn't add Product",
                code: EErrors.INVALID_TYPE_ERROR
            })
        }
        if (!title || !description || !code || !price || !stock || !category) {
            CustomError.createError({
                name: "Product creation error.",
                cause: generateProductsErrorInfo({code}),
                message: "Couldn't add Product",
                code: EErrors.INVALID_TYPE_ERROR
            })
        }
        
        try {
            const result = await productModel.create({title, description, code, price, stock, category, thumbnail: thumbnail ?? []});

            return result;
        } catch (error) {
            CustomError.createError({
                name: "Product creation error.",
                cause: generateProductsErrorInfo({code}),
                message: "Couldn't add Product",
                code: EErrors.DATABASE_ERROR
            })
        }
    }

    async updateProduct(pid, productUpdate) {
        try {
            const result = await productModel.updateOne({_id: pid}, productUpdate);
            return result;
        } catch(error) {
            CustomError.createError({
                name: "Product creation error.",
                cause: generateProductsErrorInfo({code}),
                message: "Couldn't add Product",
                code: EErrors.DATABASE_ERROR
            })
        }
    }

    async deleteProduct(pid) {
        const result = await productModel.deleteOne({_id: pid});

        if (result.deletedCount === 0) {
            CustomError.createError({
                name: "Product creation error.",
                cause: generateProductsErrorInfo({code}),
                message: "Couldn't delete Product",
                code: EErrors.DATABASE_ERROR
            })
        }

        return result;
    }
}

export default ProductDao;