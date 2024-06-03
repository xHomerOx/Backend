import Products from "../dao/factory.js";
import ProductRepository from "./productRepository.js";
import CartRepository from "./cartRepository.js";
import UserRepository from "./userRepository.js";
import TicketRepository from "./ticketRepository.js";

const dao = await Products();
export const productService = new ProductRepository(dao.productDAO);
export const cartService = new CartRepository(dao.cartDAO);
export const userService = new UserRepository(dao.userDAO);
export const ticketService = new TicketRepository(dao.ticketDAO);