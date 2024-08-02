import { Router } from "express";
import { uploader } from "../utils/multerUtil.js";
import ProductController from "../controllers/productController.js";
import { productService } from "../repositories/index.js";
import { isAdminOrPremium } from "../middlewares/guard.js";
import { transport } from "../utils/mailerUtil.js";

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
        req.logger.warning("Product does not exist");
        res.status(400).send({status: 'error', message: error.message});
    }
});

productsRouter.post("/", uploader.array('thumbnail', 3), isAdminOrPremium, async (req, res) => {
    if (req.files) {
        const thumbnails = req.files.map((file) => {
            const url = `/uploads/products/${file.filename}`;
            return url;
        });

        req.body.thumbnail = thumbnails[0];
    }
  
    try {
        const products = await myProduct.addProducts(req.body, req.user);
        res.send({ status: 'success', payload: products });
    } catch (error) {
        req.logger.warning("Cannot add Product");
        res.status(400).send({
          status: 'error',
          message: error.message,
          cause: error.cause,
          code: error.code
        });
    }
});

productsRouter.put("/:pid", uploader.array('thumbnail', 3), isAdminOrPremium, async (req, res) => {
    try {
        const pid = req.params.pid;

        const existingProduct = await myProduct.getProductById(pid);

        if (!existingProduct) {
            return res.status(404).send({ message: "Product not found" });
        }

        let updatedProduct = { ...existingProduct };

        if (req.files && req.files.length > 0) {
            const thumbnails = req.files.map((file) => `/img/${file.filename}`);
            updatedProduct.thumbnail = thumbnails[0];
        }

        if (req.body) {
            Object.keys(req.body).forEach((key) => {
                if (req.body[key] !== undefined && req.body[key] !== '') {
                    updatedProduct[key] = req.body[key];
                }
            });
        }

        if (req.body.id && req.body.id !== pid) {
            return res.status(400).send({ message: "Product ID in body must match URL ID" });
        }

        delete updatedProduct._id;

        await myProduct.updateProduct(pid, updatedProduct);

        return res.status(200).send({ message: "Product updated successfully" });
    } catch (error) {
        req.logger.warning("Cannot update Product");
        res.status(400).send({
            status: 'error',
            message: error.message,
            cause: error.cause,
            code: error.code
        });
    }
});

 productsRouter.delete("/:pid", isAdminOrPremium, async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await myProduct.getProductById(pid);
        const { user, email, role } = req.user;

        if (!product) {
                res.status(404).send({ message: "Product not found" });
                return;
        }
    
        await myProduct.deleteProduct(pid);
        
        if (email) {
            if (role !== 'admin') {
                const mailOptions = {
                    from: 'Node Products <homero.tw@gmail.com>',
                    to: email,
                    subject: 'Product Deleted',
                    text: `Product with ${pid} has been deleted by ${user}`
                };

                transport.sendMail(mailOptions, (error) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ error: 'Error sending email' });
                    }

                    res.json({ success: 'Product Deleted!' });
                });
            }
        }
        
        return res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
        req.logger.warning("Cannot delete Product");
        res.status(400).send({
          status: 'error',
          message: error.message,
          cause: error.cause,
          code: error.code
        });
      } 
});

export default productsRouter;
