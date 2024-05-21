import ProductService from "../service/productService.js";

const myProducts = new ProductService();

class ProductController {
    constructor() {}

    async getProducts(_req, res) {
        try {
            const products = await myProducts.getProducts();
            res.send({status: 'success', payload: products});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    async getProductById(req, res) {
        try {
            const pid = req.params.pid;
            const products = await myProducts.getProductById(pid);
            res.send({status: 'success', payload: products});
        } catch (error) {
            res.status(400).send({status: 'error', message: error.message});
        }
    }

    async addProducts(req, res) {
        try {
            const product = await myProducts.addProducts(req.body);
            res.send({ status: 'success', payload: product });
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const pid = req.params.pid;
      
            if (req.files) {
                const thumbnails = req.files.map((file) => file.filename);
                req.body.thumbnail = thumbnails;
            }
    
            const existingProduct = await myProducts.getProductById(pid);
            
            if (!existingProduct) {
                return res.status(404).send({ message: "Product not found" }); 
            }
        
            if (req.body.id && req.body.id !== pid) {
                return res.status(400).send({ message: "Product ID in body must match URL ID" });
            }
        
            return res.status(200).send({ message: "Product updated successfully" });
        } catch (error) {
            res.status(500).send('Could not update product');
        }
    }

    async deleteProduct(req, res) {
        try{
            const pid = req.params.pid;
            const product = await myProducts.getProductById(pid);

            if (!product) {
                res.status(404).send({ message: "Product not found" });
                return;
            }
        
            await myProducts.deleteProduct(pid);
            res.status(200).send();
        } catch (error) {
            res.status(500).send('Could not delete product');
        }
    }
}

export default ProductController;