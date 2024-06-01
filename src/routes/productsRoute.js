import { Router } from "express";
import { uploader } from "../utils/multerUtil.js";
import ProductController from "../controllers/productController.js";
import { productService } from "../repositories/index.js";
import { isAdmin } from "../middlewares/guard.js";

const productsRouter = Router();
const myProduct = new ProductController(productService);

productsRouter.get('/', async (_req, res) => {
    const products = await myProduct.getProducts();
    
    res.send({status: 'success', payload: products});
});

productsRouter.get('/:pid', async (req, res) => {
    try{
        let pid = req.params.pid;
        const products = await myProduct.getProductById(pid);

        res.send({status: 'success', payload: products});
    }catch(error){
        res.status(400).send({status: 'error', message: error.message});
    }
});

productsRouter.post("/", uploader.array('thumbnail', 3), isAdmin, async (req, res) => {
    if (req.files) {
        const thumbnails = req.files.map((file) => file.filename);
        req.body.thumbnail = thumbnails;
    }
  
    try {
        const products = await myProduct.addProducts(req.body);
        res.send({ status: 'success', payload: products });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

productsRouter.put("/:pid", uploader.array('thumbnail', 3), isAdmin, async (req, res) => {
    try {
        const pid = req.params.pid;
    
        if (req.files) {
            const thumbnails = req.files.map((file) => file.filename);
            req.body.thumbnail = thumbnails;
        }
    
        const existingProduct = await myProduct.getProductById(pid);
    
        if (!existingProduct) {
            return res.status(404).send({ message: "Product not found" });
        }
    
        if (req.body.id && req.body.id!== pid) {
            return res.status(400).send({ message: "Product ID in body must match URL ID" });
        }
    
        delete req.body._id;
    
        await myProduct.updateProduct(pid, req.body);
    
        return res.status(200).send({ message: "Product updated successfully" });
    } catch (error) {
        res.status(500).send({ message: 'Could not update product', error: error.message });
    }
  });

 productsRouter.delete("/:pid", isAdmin, async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await myProduct.getProductById(pid);

        if (!product) {
                res.status(404).send({ message: "Product not found" });
                return;
        }
    
        await myProduct.deleteProduct(pid);
        
        return res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).send('Could not delete product');
    }    
});

export default productsRouter;
