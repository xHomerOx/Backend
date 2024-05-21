import { Router } from "express";
import { uploader } from "../utils/multerUtil.js";
import ProductController from "../controllers/productController.js";

const myProducts = new ProductController();
const productsRouter = Router();

productsRouter.get('/', myProducts.getProducts);
productsRouter.get('/:pid', myProducts.getProductById);
productsRouter.post("/", uploader.array('thumbnail', 3), myProducts.addProducts);
productsRouter.put("/:pid", uploader.array('thumbnail', 3), myProducts.updateProduct);
productsRouter.delete("/:pid", myProducts.deleteProduct);

export default productsRouter;
