import ProductDao from '../dao/mongo/productMongoDAO.js'

class ProductController {
    constructor() {
        this.dao = new ProductDao();
    }

    async getProducts(_req, res) {
        try {
            const products = await this.dao.getProducts();
            res.send({status: 'success', payload: products});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    async getProductById(req, res) {
        try {
            const pid = req.params.pid;
            const products = await this.dao.getProductById(pid);
            res.send({status: 'success', payload: products});
        } catch (error) {
            res.status(400).send({status: 'error', message: error.message});
        }
    }

    async addProducts(req, res) {
        try {
            const product = await this.dao.addProducts(req.body);
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
    
            const existingProduct = await this.dao.getProductById(pid);
            
            if (!existingProduct) {
                return res.status(404).send({ message: "Product not found" }); 
            }
        
            if (req.body.id && req.body.id !== pid) {
                return res.status(400).send({ message: "Product ID in body must match URL ID" });
            }

            await this.dao.updateProduct(pid, req.body);
            return res.status(200).send({ message: "Product updated successfully" });
        } catch (error) {
            res.status(500).send('Could not update product');
        }
    }

    async deleteProduct(req, res) {
        try{
            const pid = req.params.pid;
            const product = await this.dao.getProductById(pid);

            if (!product) {
                res.status(404).send({ message: "Product not found" });
                return;
            }
        
            await this.dao.deleteProduct(pid);
            res.status(200).send({ message: "Product deleted successfully" });
        } catch (error) {
            res.status(500).send('Could not delete product');
        }
    }
}

export default ProductController;