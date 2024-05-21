import { Router } from "express";
import CartController from "../controllers/cartController.js";

const myCart = new CartController();
const cartsRouter = Router();

cartsRouter.get('/', myCart.getProducts);
cartsRouter.get('/:cid', myCart.getProductsFromCart);
cartsRouter.post('/', myCart.addCart);
cartsRouter.post('/:cid/products/:pid', myCart.addProduct);
cartsRouter.delete('/:cid/products/:pid', myCart.deleteProduct);
cartsRouter.put('/:cid', myCart.updateProduct);
cartsRouter.put('/:cid/products/:pid', myCart.updateProductById);

export default cartsRouter;