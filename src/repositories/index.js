import Products from "../dao/factory.js";
import ProductRepository from "./productRepository.js";
import CartRepository from "./cartRepository.js";

const dao = await Products();
export const productService = new ProductRepository(dao.productDAO);
export const cartService = new CartRepository(dao.cartDAO);
