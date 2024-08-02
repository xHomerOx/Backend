import ProductDto from "../dto/productDTO.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateProductsErrorInfo, updateorDeleteProductsErrorInfo } from "../services/errors/info.js";

class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getProducts() {
        try {
            const products = await this.dao.getProducts();
            return products.map(product => new ProductDto(product));
        } catch (error) {
            throw CustomError.createError({
              name: "Product not found error.",
              cause: updateorDeleteProductsErrorInfo(pid),
              message: "Couldn't find Products",
              code: EErrors.DATABASE_ERROR
            });
        }
    }

    async getProductById(pid) {
        try {
            const product = await this.dao.getProductById(pid);
            return new ProductDto(product);
        } catch (error) {
            throw CustomError.createError({
              name: "Product not found error.",
              cause: updateorDeleteProductsErrorInfo(pid),
              message: "Couldn't find Product",
              code: EErrors.DATABASE_ERROR
            });
        }
    }
    

    async addProducts(product, user) {
        try {
            const result = await this.dao.addProducts(product, user);
            return new ProductDto(result);
        } catch (error) {
            throw CustomError.createError({
                name: 'Product creation error.',
                cause: generateProductsErrorInfo(product),
                message: "Couldn't add Product",
                code: EErrors.DATABASE_ERROR,
            });
        }
    }

    async updateProduct(pid, productUpdate) {
        try {
            await this.dao.getProductById(pid);
            const updatedProduct = await this.dao.updateProduct(pid, productUpdate);
            return new ProductDto(updatedProduct);
        } catch (error) {
            throw CustomError.createError({
              name: "Product update error.",
              cause: updateorDeleteProductsErrorInfo(pid),
              message: "Couldn't update Product",
              code: EErrors.DATABASE_ERROR
            });
        }
    }

    async deleteProduct(pid) {
        try{
            const product = await this.dao.getProductById(pid);

            if (!product) {
                throw new Error(`Product ${pid} not found`);
            }
        
            const deletedProduct = await this.dao.deleteProduct(product);
            return new ProductDto(deletedProduct);
        } catch (error) {
            throw CustomError.createError({
              name: "Product deletion error.",
              cause: updateorDeleteProductsErrorInfo(pid),
              message: "Couldn't delete Product",
              code: EErrors.DATABASE_ERROR
            });
        }
    }
}

export default ProductRepository;