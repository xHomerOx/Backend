import { Router } from "express";
import { uploader } from "../utils/multerUtil.js";
import ProductController from "../controllers/productController.js";
import { productService } from "../repositories/index.js";

const productsRouter = Router();
const myProducts = new ProductController();

productsRouter.get('/', async (_req, res) => {
    const products = await myProducts.getProducts();
    
    res.send({status: 'success', payload: products});
});

productsRouter.get('/:pid', async (req, res) => {
    try{
        let pid = req.params.pid;
        const products = await productService.getProductById(pid);

        res.send({status: 'success', payload: products});
    }catch(error){
        res.status(400).send({status: 'error', message: error.message});
    }
});

productsRouter.post("/", uploader.array('thumbnail', 3), async (req, res) => {
    if (req.files) {
        const thumbnails = req.files.map((file) => file.filename);
        req.body.thumbnail = thumbnails;
    }
  
    try {
        const products = await productService.addProducts(req.body);
        res.send({ status: 'success', payload: products });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

productsRouter.put("/:pid", uploader.array('thumbnail', 3), async (req, res) => {
    try {
        const pid = req.params.pid;
    
        if (req.files) {
            const thumbnails = req.files.map((file) => file.filename);
            req.body.thumbnail = thumbnails;
        }
    
        const existingProduct = await productService.getProductById(pid);
    
        if (!existingProduct) {
            return res.status(404).send({ message: "Product not found" });
        }
    
        if (req.body.id && req.body.id!== pid) {
            return res.status(400).send({ message: "Product ID in body must match URL ID" });
        }
    
        delete req.body._id;
    
        await productService.updateProduct(pid, req.body);
    
        return res.status(200).send({ message: "Product updated successfully" });
    } catch (error) {
        res.status(500).send({ message: 'Could not update product', error: error.message });
    }
  });

 productsRouter.delete("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await productService.getProductById(pid);

        if (!product) {
                res.status(404).send({ message: "Product not found" });
                return;
        }
    
        await productService.deleteProduct(pid);
        
        return res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).send('Could not delete product');
    }    
});

export default productsRouter;
