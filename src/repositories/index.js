import Products from "../dao/factory.js";
import ProductRepository from "./productRepository.js";

const dao = await Products();
export const productService = new ProductRepository(dao);